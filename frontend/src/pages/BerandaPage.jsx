import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader.jsx'
import StatsGrid from '../components/dashboard/StatsGrid.jsx'
import ProductTable from '../components/dashboard/ProductTable.jsx'
import PerformancePanel from '../components/dashboard/PerformancePanel.jsx'
import NotificationPanel from '../components/dashboard/NotificationPanel.jsx'
import '../App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function formatRupiah(n) {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)} jt`
  if (n >= 1_000)     return `Rp ${(n / 1_000).toFixed(0)} rb`
  return `Rp ${n}`
}

export default function BerandaPage() {
  const navigate = useNavigate()
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (!token) { navigate('/login'); return }

    fetch(`${API_URL}/api/dashboard/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}')

  const stats = data ? [
    { label: 'Pesanan Masuk',      value: String(data.stats.pesananMasuk),           footnote: 'Menunggu konfirmasi' },
    { label: 'Stok Tersedia',      value: `${data.stats.stokTotal.toFixed(1)} kg`,   footnote: 'Total semua produk' },
    { label: 'Pesanan Diproses',   value: String(data.stats.pesananDiproses),         footnote: 'Sedang diproses' },
    { label: 'Pendapatan Bulan Ini', value: formatRupiah(data.stats.pendapatanBulanIni), footnote: 'Bulan berjalan' },
  ] : []

  const products = data?.topProducts?.map(p => ({
    emoji: p.emoji, name: p.name, stock: p.stock, price: p.price, sold: '—',
  })) ?? []

  const notifications = data?.notifications?.map(n => ({
    id: n.id, message: n.message, isRead: n.isRead, createdAt: n.createdAt,
  })) ?? []

  return (
    <>
      <PageHeader
        title={`Halo, ${user.name ?? 'Petani'}!`}
        subtitle="Berikut ringkasan aktivitas Anda hari ini."
        onAddProduct={() => navigate('/petani/tambah-produk')}
      />

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#aaa' }}>Memuat data...</div>
      ) : (
        <>
          <StatsGrid stats={stats} />
          <div className="app__grid">
            <ProductTable
              products={products}
              onManage={(p) => navigate('/petani/produk-saya')}
            />
            <div className="app__side">
              <PerformancePanel rating={data?.stats ? 4.8 : 0} maxRating={5} />
              <NotificationPanel notifications={notifications} />
            </div>
          </div>
        </>
      )}
    </>
  )
}
