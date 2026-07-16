import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import LoginPage from './features/auth/LoginPage.tsx'
import RegisterPage from './features/auth/RegisterPage.tsx'
import BerandaPage from './pages/BerandaPage.jsx'
import ProdukSayaPage from './pages/ProdukSayaPage.jsx'
import TambahProdukPage from './pages/TambahProdukPage.jsx'
import PesananPage from './pages/PesananPage.jsx'
import PengirimanPage from './pages/PengirimanPage.jsx'
import PengirimanDetailPage from './pages/PengirimanDetailPage.jsx'
import PengaturanPage from './pages/PengaturanPage.jsx'
import './index.css'

function isLoggedIn() {
  return !!(localStorage.getItem('token') || sessionStorage.getItem('token'))
}

function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />
}

function ComingSoon({ title }) {
  return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
      <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#333', marginBottom: '8px' }}>{title}</h2>
      <p style={{ fontSize: '14px' }}>Halaman ini sedang dalam pengembangan.</p>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/petani" element={<PrivateRoute><App /></PrivateRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<BerandaPage />} />
          <Route path="produk-saya" element={<ProdukSayaPage />} />
          <Route path="tambah-produk" element={<TambahProdukPage />} />
          <Route path="pesanan" element={<PesananPage />} />
          <Route path="pengiriman" element={<PengirimanPage />} />
          <Route path="pengiriman/:id" element={<PengirimanDetailPage />} />
          <Route path="pengaturan" element={<PengaturanPage />} />
          <Route path="keuangan" element={<ComingSoon title="Keuangan" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
