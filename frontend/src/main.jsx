import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import BerandaPage from './pages/BerandaPage.jsx'
import ProdukSayaPage from './pages/ProdukSayaPage.jsx'
import TambahProdukPage from './pages/TambahProdukPage.jsx'
import PesananPage from './pages/PesananPage.jsx'
import PesananDetailPage from './pages/PesananDetailPage.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<BerandaPage />} />
          <Route path="produk-saya" element={<ProdukSayaPage />} />
          <Route path="tambah-produk" element={<TambahProdukPage />} />
          <Route path="pesanan" element={<PesananPage />} />
          <Route path="pesanan/:id" element={<PesananDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
