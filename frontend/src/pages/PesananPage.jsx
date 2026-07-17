import { useState, useEffect, useMemo } from 'react'
import PageHeader from '../components/layout/PageHeader.jsx'
import './PesananPage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const STATUS_CONFIG = {
  masuk:      { label: 'Menunggu', color: '#f59e0b', bg: '#fffbeb' },
  diproses:   { label: 'Diproses', color: '#3b82f6', bg: '#eff6ff' },
  selesai:    { label: 'Selesai',  color: '#22c55e', bg: '#f0fdf4' },
  dibatalkan: { label: 'Ditolak',  color: '#ef4444', bg: '#fff5f5' },
}

const TABS = [
  { key: 'semua',    label: 'Semua' },
  { key: 'masuk',    label: 'Menunggu' },
  { key: 'diproses', label: 'Diproses' },
  { key: 'selesai',  label: 'Selesai' },
]

function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token')
}

export default function PesananPage() {
  const [orders, setOrders]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [activeTab, setActiveTab] = useState('semua')
  const [search, setSearch]       = useState('')

  const fetchOrders = () => {
    setLoading(true)
    fetch(`${API_URL}/api/orders`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.orders) setOrders(data.orders)
        else setError('Gagal memuat pesanan.')
      })
      .catch(() => setError('Tidak dapat terhubung ke server.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [])

  const handleUpdateStatus = async (id, status) => {
    const res = await fetch(`${API_URL}/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ status }),
    })
    if (res.ok) fetchOrders()
  }

  const filtered = useMemo(() => {
    return orders.filter(o => {
      const matchTab    = activeTab === 'semua' || o.status === activeTab
      const matchSearch = o.buyerName?.toLowerCase().includes(search.toLowerCase()) ||
                          o.id?.toLowerCase().includes(search.toLowerCase())
      return matchTab && matchSearch
    })
  }, [orders, activeTab, search])

  return (
    <div className="pesanan">
      <PageHeader title="Pesanan" subtitle="Terima atau tolak permintaan pembelian dari UMKM." />

      <section className="pesanan__card">
        <div className="pesanan__toolbar">
          <input
            type="text"
            className="pesanan__search"
            placeholder="Cari pembeli atau ID pesanan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="pesanan__tabs">
          {TABS.map(tab => (
            <button
              key={tab.key}
              type="button"
              className={`pesanan__tab ${activeTab === tab.key ? 'pesanan__tab--active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              <span className="pesanan__tab-count">
                {tab.key === 'semua' ? orders.length : orders.filter(o => o.status === tab.key).length}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="pesanan__empty">Memuat pesanan...</div>
        ) : error ? (
          <div className="pesanan__empty" style={{ color: '#c33' }}>{error}</div>
        ) : (
          <div className="pesanan__list">
            {filtered.length === 0 ? (
              <div className="pesanan__empty">Tidak ada pesanan ditemukan.</div>
            ) : filtered.map(order => {
              const s        = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.masuk
              const produkList = order.items?.map(i => `${i.product?.name ?? '—'} ${i.quantityKg} kg`).join(', ') ?? '—'
              const total    = `Rp ${Number(order.totalPrice).toLocaleString('id-ID')}`

              return (
                <div key={order.id} className="pesanan__item">
                  <div className="pesanan__item-top">
                    <div className="pesanan__item-left">
                      <span className="pesanan__item-id">{order.id.slice(0, 8).toUpperCase()}</span>
                      <span className="pesanan__item-tanggal">
                        {new Date(order.createdAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <span className="pesanan__badge" style={{ color: s.color, background: s.bg }}>
                      {s.label}
                    </span>
                  </div>

                  <div className="pesanan__item-body">
                    <div className="pesanan__item-info">
                      <div className="pesanan__item-pembeli">{order.buyerName}</div>
                      <div className="pesanan__item-meta">
                        <span>📦 {produkList}</span>
                        {order.buyerContact && <span>📞 {order.buyerContact}</span>}
                      </div>
                    </div>
                    <div className="pesanan__item-total">
                      <div className="pesanan__item-total-label">Total</div>
                      <div className="pesanan__item-total-value">{total}</div>
                    </div>
                  </div>

                  {order.status === 'masuk' && (
                    <div className="pesanan__item-actions">
                      <button
                        type="button"
                        className="pesanan__btn pesanan__btn--tolak"
                        onClick={() => handleUpdateStatus(order.id, 'dibatalkan')}
                      >
                        Tolak
                      </button>
                      <button
                        type="button"
                        className="pesanan__btn pesanan__btn--terima"
                        onClick={() => handleUpdateStatus(order.id, 'diproses')}
                      >
                        Terima Pesanan
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
