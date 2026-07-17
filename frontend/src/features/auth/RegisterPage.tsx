import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { IconUser, IconMail, IconLock, IconEye, IconEyeOff, IconWheat, IconCart, IconArrowRight } from './icons'
import './LoginPage.css'

type Role = 'petani' | 'pembeli'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function RegisterPage() {
  const [role, setRole]                       = useState<Role>('petani')
  const [name, setName]                       = useState('')
  const [email, setEmail]                     = useState('')
  const [password, setPassword]               = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword]       = useState(false)
  const [showConfirm, setShowConfirm]         = useState(false)
  const [error, setError]                     = useState('')
  const [loading, setLoading]                 = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok')
      return
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Registrasi gagal')
        setLoading(false)
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // Redirect ke dashboard — banner notif akan muncul kalau profil belum lengkap
      navigate(data.user.role === 'petani' ? '/petani/dashboard' : '/pembeli/dashboard')
    } catch {
      setError('Tidak dapat terhubung ke server.')
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
          <h2 className="login-title">Daftar ke Taniku</h2>
          <p className="login-subtitle">Lengkapi data di bawah untuk membuat akun</p>
        </div>

        <div className="login-role-label">DAFTAR SEBAGAI</div>
        <div className="login-role-selector">
          <button type="button" className={`login-role-btn ${role === 'petani' ? 'active' : ''}`} onClick={() => setRole('petani')}>
            <div className="login-role-btn-icon"><IconWheat /></div>
            <div className="login-role-btn-text">Petani</div>
          </button>
          <button type="button" className={`login-role-btn ${role === 'pembeli' ? 'active' : ''}`} onClick={() => setRole('pembeli')}>
            <div className="login-role-btn-icon"><IconCart /></div>
            <div className="login-role-btn-text">Pembeli</div>
          </button>
        </div>

        <form onSubmit={handleRegister}>
          <div className="login-field">
            <label className="login-field-label">Nama lengkap</label>
            <div className="login-input-wrapper">
              <span className="login-input-icon"><IconUser /></span>
              <input type="text" placeholder="Nama kamu atau nama usaha"
                value={name} onChange={e => setName(e.target.value)} className="login-input" required />
            </div>
          </div>

          <div className="login-field">
            <label className="login-field-label">Email</label>
            <div className="login-input-wrapper">
              <span className="login-input-icon"><IconMail /></span>
              <input type="email" placeholder="nama@email.com"
                value={email} onChange={e => setEmail(e.target.value)} className="login-input" required />
            </div>
          </div>

          <div className="login-field">
            <label className="login-field-label">Password</label>
            <div className="login-input-wrapper">
              <span className="login-input-icon"><IconLock /></span>
              <input type={showPassword ? 'text' : 'password'} placeholder="Minimal 6 karakter"
                value={password} onChange={e => setPassword(e.target.value)} className="login-input" required />
              <button type="button" className="login-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </div>

          <div className="login-field">
            <label className="login-field-label">Konfirmasi password</label>
            <div className="login-input-wrapper">
              <span className="login-input-icon"><IconLock /></span>
              <input type={showConfirm ? 'text' : 'password'} placeholder="Ulangi password"
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="login-input" required />
              <button type="button" className="login-eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? 'Memproses...' : `Daftar sebagai ${role}`}
            {!loading && <IconArrowRight className="login-submit-arrow" />}
          </button>
        </form>

        <div className="login-footer">
          Sudah punya akun?{' '}
          <Link to="/login" className="login-link">Masuk sekarang</Link>
        </div>
      </div>

      <div className="login-bottom-bar">© 2026 Taniku · Dari petani, untuk negeri</div>
    </div>
  )
}
