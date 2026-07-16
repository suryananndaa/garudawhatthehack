import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from './supabaseClient'
import './LoginPage.css'

type Role = 'petani' | 'pembeli'

export default function LoginPage() {
  const [role, setRole] = useState<Role>('petani')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: identifier,
      password,
    })

    if (authError) {
      setError('Email atau password salah')
      setLoading(false)
      return
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profileError || !profile) {
      setError('Gagal mengambil data profil')
      setLoading(false)
      return
    }

    if (profile.role !== role) {
      setError(`Akun ini terdaftar sebagai ${profile.role}. Pilih peran yang sesuai.`)
      setLoading(false)
      return
    }

    navigate(role === 'petani' ? '/petani/dashboard' : '/dashboard')
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
  <div className="login-container">
    <div className="login-top-logo">
        <img src="/logo-taniku.PNG" alt="Taniku" className="login-logo-img" />
    </div>


    <div className="login-card">
      <div className="login-header">
        <h2 className="login-title">Selamat datang kembali</h2>
        <p className="login-subtitle">Masuk sesuai peranmu di Taniku</p>
      </div>

      <div className="login-role-label">MASUK SEBAGAI</div>
      <div className="login-role-selector">
        <button
          type="button"
          className={`login-role-btn ${role === 'petani' ? 'active' : ''}`}
          onClick={() => setRole('petani')}
        >
          <div className="login-role-btn-icon">🌾</div>
          <div className="login-role-btn-text">Petani</div>
        </button>
        <button
          type="button"
          className={`login-role-btn ${role === 'pembeli' ? 'active' : ''}`}
          onClick={() => setRole('pembeli')}
        >
          <div className="login-role-btn-icon">🛒</div>
          <div className="login-role-btn-text">Pembeli</div>
        </button>
      </div>

      <form onSubmit={handleLogin}>
        <div className="login-field">
          <label className="login-field-label">Email atau nomor HP</label>
          <div className="login-input-wrapper">
            <span className="login-input-icon">👤</span>
            <input
              type="text"
              placeholder="nama@email.com atau 08xx"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="login-input"
              required
            />
          </div>
        </div>

        <div className="login-field">
          <label className="login-field-label">Password</label>
          <div className="login-input-wrapper">
            <span className="login-input-icon">🔒</span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />
            <button
              type="button"
              className="login-eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '🙈' : '👁'}
            </button>
          </div>
        </div>

        <div className="login-options">
          <label className="login-checkbox-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Ingat saya
          </label>
          <a href="/forgot-password" className="login-link">Lupa password?</a>
        </div>

        {error && <div className="login-error">{error}</div>}

        <button type="submit" className="login-submit-btn" disabled={loading}>
          {loading ? 'Memproses...' : `Masuk sebagai ${role}`}
          {!loading && '→'}
        </button>
      </form>

      <div className="login-divider">
        <div className="login-divider-line"></div>
        <span>atau</span>
        <div className="login-divider-line"></div>
      </div>

      <button type="button" className="login-google-btn" onClick={handleGoogleLogin}>
        <svg width="15" height="15" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Masuk dengan Google
      </button>

      <div className="login-footer">
        Belum punya akun?{' '}
        <Link to="/register" className="login-link">Daftar sekarang</Link>
      </div>

      <div className="login-security">
        🛡 Data kamu aman dan terenkripsi
      </div>
    </div>

    <div className="login-bottom-bar">
      © 2026 Taniku · Dari petani, untuk negeri
    </div>

  </div>
)
}