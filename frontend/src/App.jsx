import { useState, useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar.jsx'
import './App.css'

function isProfilLengkap() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}')
    return !!(user.phone && user.fieldPhotoUrl)
  } catch { return true }
}

export default function App() {
  const navigate      = useNavigate()
  const [profilLengkap, setProfilLengkap] = useState(isProfilLengkap())
  const [visible, setVisible]   = useState(false)
  const [dismissed, setDismissed] = useState(false)

  // Cek ulang status profil begitu ada halaman lain yang menyimpan perubahan
  // (mis. Pengaturan / Lengkapi Profil) — App.jsx tidak reload saat navigasi antar halaman.
  useEffect(() => {
    const recheck = () => setProfilLengkap(isProfilLengkap())
    window.addEventListener('taniku:user-updated', recheck)
    window.addEventListener('storage', recheck)
    return () => {
      window.removeEventListener('taniku:user-updated', recheck)
      window.removeEventListener('storage', recheck)
    }
  }, [])

  // Muncul 1.5 detik setelah halaman load
  useEffect(() => {
    if (!profilLengkap && !dismissed) {
      const t = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(t)
    }
  }, [profilLengkap, dismissed])

  const handleDismiss = () => {
    setVisible(false)
    setTimeout(() => setDismissed(true), 400) // tunggu animasi keluar
  }

  return (
    <div className="app">
      <Sidebar />

      <main className="app__content">
        <Outlet />
      </main>

      {/* Popup notif pojok kanan atas */}
      {!profilLengkap && !dismissed && (
        <div className={`app__notif-popup ${visible ? 'app__notif-popup--visible' : ''}`}>
          <div className="app__notif-popup-icon">⚠️</div>
          <div className="app__notif-popup-body">
            <p className="app__notif-popup-title">Profil belum lengkap</p>
            <p className="app__notif-popup-desc">Lengkapi profil toko agar pembeli bisa menghubungi kamu.</p>
            <button
              type="button"
              className="app__notif-popup-btn"
              onClick={() => { handleDismiss(); navigate('/petani/pengaturan') }}
            >
              Lengkapi Sekarang →
            </button>
          </div>
          <button type="button" className="app__notif-popup-close" onClick={handleDismiss} aria-label="Tutup">✕</button>
        </div>
      )}
    </div>
  )
}
