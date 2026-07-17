import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader.jsx'
import './PengirimanPage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const TRACKING_CONFIG = {
  diproses:         { label: 'Pesanan Diterima',  color: '#6366f1', bg: '#eef2ff' },
  dalam_pengiriman: { label: 'Dalam Pengiriman',  color: '#3b82f6', bg: '#eff6ff' },
  selesai:          { label: 'Selesai',           color: '#22c55e', bg: '#f0fdf4' },
}

const TABS = [
  { key: 'semua',    label: 'Semua' },
  { key: 'diproses', label: 'Diterima' },
  { key: 'selesai',  label: 'Selesai' },
]

function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token')
}

export default function PengirimanPage() {
  const navigate = useNavigate()
  const [orders, setOrders]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [activeTab, setActiveTab] = useState('semua')
  const [search, setSearch]       = useState('')

  useEffect(() => {
    fetch(`${API_URL}/api/orders`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.orders) {
          // Tampilkan hanya pesanan yang sudah diterima (diproses/selesai)
          setOrders(data.orders.filter(o => ['diproses', 'selesai'].includes(o.status)))
        } else {
          setError('Gagal memuat data.')
        }
      })
      .catch(() => setError('Tidak dapat terhubung ke server.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return orders.filter(o => {
      const matchTab    = activeTab === 'semua' || o.status === activeTab
      const matchSearch = o.buyerName?.toLowerCase().includes(search.toLowerCase()) ||
                          o.id?.toLowerCase().includes(search.toLowerCase())
      return matchTab && matchSearch
    })
  }, [orders, activeTab, search])

  return (
    <div className="pengiriman">
      <PageHeader title="Pengiriman" subtitle="Pantau status pengiriman semua pesanan yang diterima." />

      <section className="pengiriman__card">
        <div className="pengiriman__toolbar">
          <input
            type="text"
            className="pengiriman__search"
            placeholder="Cari pembeli atau ID pesanan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="pengiriman__tabs">
          {TABS.map(tab => (
            <button
              key={tab.key}
              type="button"
              className={`pengiriman__tab ${activeTab === tab.key ? 'pengiriman__tab--active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              <span className="pengiriman__tab-count">
                {tab.key === 'semua' ? orders.length : orders.filter(o => o.status === tab.key).length}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="pengiriman__empty">Memuat data...</div>
        ) : error ? (
          <div className="pengiriman__empty" style={{ color: '#c33' }}>{error}</div>
        ) : (
          <div className="pengiriman__table-wrapper">
            <table className="pengiriman__table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Pembeli</th>
                  <th>Produk</th>
                  <th>Total</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="pengiriman__empty">Tidak ada data.</td></tr>
                ) : filtered.map(order => {
                  const t        = TRACKING_CONFIG[order.status] ?? TRACKING_CONFIG.diproses
                  const produk   = order.items?.[0]?.product?.name ?? '—'
                  const total    = `Rp ${Number(order.totalPrice).toLocaleString('id-ID')}`
                  const tanggal  = new Date(order.createdAt).toLocaleDateString('id-ID')
                  return (
                    <tr key={order.id}>
                      <td className="pengiriman__id">{order.id.slice(0, 8).toUpperCase()}</td>
                      <td>{order.buyerName}</td>
                      <td className="pengiriman__produk">{produk}</td>
                      <td className="pengiriman__total">{total}</td>
                      <td>{tanggal}</td>
                      <td>
                        <span className="pengiriman__badge" style={{ color: t.color, background: t.bg }}>
                          {t.label}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="pengiriman__detail-btn"
                          onClick={() => navigate(`/petani/pengiriman/${order.id}`)}
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
