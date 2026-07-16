import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import LoginPage from './features/auth/LoginPage.tsx'
import RegisterPage from './features/auth/RegisterPage.tsx'
import BerandaPage from './pages/BerandaPage.jsx'
import ProdukSayaPage from './pages/ProdukSayaPage.jsx'
import TambahProdukPage from './pages/TambahProdukPage.jsx'
import PengaturanPage from './pages/PengaturanPage.jsx'
import './index.css'

// Cek apakah user sudah login
function isLoggedIn() {
  return !!(localStorage.getItem('token') || sessionStorage.getItem('token'))
}

// Guard: redirect ke /login kalau belum login
function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Dashboard (hanya bisa diakses kalau sudah login) */}
        <Route path="/petani" element={<PrivateRoute><App /></PrivateRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<BerandaPage />} />
          <Route path="produk-saya" element={<ProdukSayaPage />} />
          <Route path="tambah-produk" element={<TambahProdukPage />} />
          <Route path="pengaturan" element={<PengaturanPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
