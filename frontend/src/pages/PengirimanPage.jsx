import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader.jsx'
import './PengirimanPage.css'

const INIT_PENGIRIMAN = [
  { id: 'ORD-001', pembeli: 'UMKM Berkah Jaya',         produk: 'Matoa 300 kg',           total: 'Rp 8.400.000', tanggal: '2026-07-14', tracking: 'selesai' },
  { id: 'ORD-002', pembeli: 'UMKM Sari Rasa',           produk: 'Alpukat Mentega 200 kg',  total: 'Rp 4.400.000', tanggal: '2026-07-13', tracking: 'selesai' },
  { id: 'ORD-003', pembeli: 'UMKM Segar Alami',         produk: 'Nanas Madu 137.5 kg',     total: 'Rp 2.200.000', tanggal: '2026-07-12', tracking: 'selesai' },
  { id: 'ORD-004', pembeli: 'UMKM Rejeki Barokah',      produk: 'Matoa 50 kg',             total: 'Rp 1.400.000', tanggal: '2026-07-15', tracking: 'dalam_pengiriman' },
  { id: 'ORD-005', pembeli: 'UMKM Cita Rasa Nusantara', produk: 'Alpukat Mentega 30 kg',   total: 'Rp 660.000',   tanggal: '2026-07-15', tracking: 'diproses' },
  { id: 'ORD-006', pembeli: 'UMKM Tani Makmur',         produk: 'Nanas Madu 25 kg',        total: 'Rp 400.000',   tanggal: '2026-07-16', tracking: 'diterima' },
  { id: 'ORD-007', pembeli: 'UMKM Sumber Segar',        produk: 'Matoa 40 kg',             total: 'Rp 1.120.000', tanggal: '2026-07-16', tracking: 'diterima' },
]

const TRACKING_CONFIG = {
  diterima:         { label: 'Pesanan Diterima',  color: '#6366f1', bg: '#eef2ff' },
  diproses:         { label: 'Sedang Diproses',   color: '#f59e0b', bg: '#fffbeb' },
  dalam_pengiriman: { label: 'Dalam Pengiriman',  color: '#3b82f6', bg: '#eff6ff' },
  selesai:          { label: 'Selesai',           color: '#22c55e', bg: '#f0fdf4' },
}

const TABS = [
  { key: 'semua',           label: 'Semua' },
  { key: 'diterima',        label: 'Diterima' },
  { key: 'diproses',        label: 'Diproses' },
  { key: 'dalam_pengiriman',label: 'Dikirim' },
  { key: 'selesai',         label: 'Selesai' },
]

export default function PengirimanPage() {
  const navigate = useNavigate()
  const [orders] = useState(INIT_PENGIRIMAN)
  const [activeTab, setActiveTab] = useState('semua')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchTab = activeTab === 'semua' || o.tracking === activeTab
      const matchSearch =
        o.pembeli.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toLowerCase().includes(search.toLowerCase())
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
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="pengiriman__tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`pengiriman__tab ${activeTab === tab.key ? 'pengiriman__tab--active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              <span className="pengiriman__tab-count">
                {tab.key === 'semua' ? orders.length : orders.filter((o) => o.tracking === tab.key).length}
              </span>
            </button>
          ))}
        </div>

        <div className="pengiriman__table-wrapper">
          <table className="pengiriman__table">
            <thead>
              <tr>
                <th>ID Pesanan</th>
                <th>Pembeli</th>
                <th>Produk</th>
                <th>Total</th>
                <th>Tanggal</th>
                <th>Status Pengiriman</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="pengiriman__empty">Tidak ada data ditemukan.</td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const t = TRACKING_CONFIG[order.tracking]
                  return (
                    <tr key={order.id}>
                      <td className="pengiriman__id">{order.id}</td>
                      <td>{order.pembeli}</td>
                      <td className="pengiriman__produk">{order.produk}</td>
                      <td className="pengiriman__total">{order.total}</td>
                      <td>{order.tanggal}</td>
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
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
