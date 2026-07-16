import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './LoginPage.css'

type Role = 'petani' | 'pembeli'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

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

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, password, role }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Login gagal')
        setLoading(false)
        return
      }

      // Simpan token — pakai sessionStorage kalau "ingat saya" tidak dicentang
      const storage = rememberMe ? localStorage : sessionStorage
      storage.setItem('token', data.token)
      storage.setItem('user', JSON.stringify(data.user))

      navigate(data.user.role === 'petani' ? '/petani/dashboard' : '/dashboard')
    } catch {
      setError('Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.')
      setLoading(false)
    }
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
            <label className="login-field-label">Email</label>
            <div className="login-input-wrapper">
              <span className="login-input-icon">👤</span>
              <input
                type="email"
                placeholder="nama@email.com"
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
            {!loading && ' →'}
          </button>
        </form>

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
