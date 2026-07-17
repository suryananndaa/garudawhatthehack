import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import LoginPage from './features/auth/LoginPage.tsx'
import RegisterPage from './features/auth/RegisterPage.tsx'
import BerandaPage from './pages/BerandaPage.jsx'
import ProdukSayaPage from './pages/ProdukSayaPage.jsx'
import TambahProdukPage from './pages/TambahProdukPage.jsx'
import EditProdukPage from './pages/EditProdukPage.jsx'
import PesananPage from './pages/PesananPage.jsx'
import PengirimanPage from './pages/PengirimanPage.jsx'
import PengirimanDetailPage from './pages/PengirimanDetailPage.jsx'
import PengaturanPage from './pages/PengaturanPage.jsx'
import LengkapiProfilPage from './pages/LengkapiProfilPage.jsx'
import UMKMDashboard from './umkm/Dashboard.jsx'
import JelajahiPage from './umkm/JelajahiPage.jsx'
import ProfileTokoPage from './umkm/ProfileTokoPage.jsx'
import DetailProdukPage from './umkm/DetailProdukPage.jsx'
import PesananSaya from './umkm/Pesanan.jsx'
import Pengaturan from './umkm/Pengaturan.jsx'
import FavoritPage from './umkm/Favorit.jsx'
import SearchPage from './umkm/Search.jsx'
import './index.css'

function isLoggedIn() {
  return !!(localStorage.getItem('token') || sessionStorage.getItem('token'))
}

function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ===== PETANI / SUPPLIER ===== */}
        <Route path="/petani" element={<PrivateRoute><App /></PrivateRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<BerandaPage />} />
          <Route path="produk-saya" element={<ProdukSayaPage />} />
          <Route path="tambah-produk" element={<TambahProdukPage />} />
          <Route path="produk/:id/edit" element={<EditProdukPage />} />
          <Route path="pesanan" element={<PesananPage />} />
          <Route path="pengiriman" element={<PengirimanPage />} />
          <Route path="pengiriman/:id" element={<PengirimanDetailPage />} />
          <Route path="pengaturan" element={<PengaturanPage />} />
          <Route path="lengkapi-profil" element={<LengkapiProfilPage />} />
        </Route>

        {/* ===== PEMBELI / UMKM ===== */}
        <Route path="/pembeli/dashboard"   element={<PrivateRoute><UMKMDashboard /></PrivateRoute>} />
        <Route path="/pembeli/pesanan"     element={<PrivateRoute><PesananSaya /></PrivateRoute>} />
        <Route path="/pembeli/jelajahi/:category" element={<PrivateRoute><JelajahiPage /></PrivateRoute>} />
        <Route path="/pembeli/toko/:id"    element={<PrivateRoute><ProfileTokoPage /></PrivateRoute>} />
        <Route path="/pembeli/produk/:id"  element={<PrivateRoute><DetailProdukPage /></PrivateRoute>} />
        <Route path="/pembeli/pengaturan"  element={<PrivateRoute><Pengaturan /></PrivateRoute>} />
        <Route path="/pembeli/favorit"     element={<PrivateRoute><FavoritPage /></PrivateRoute>} />
        <Route path="/pembeli/search"      element={<PrivateRoute><SearchPage /></PrivateRoute>} />
        <Route path="/pembeli" element={<Navigate to="/pembeli/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)