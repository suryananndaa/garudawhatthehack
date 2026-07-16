import { useState, useMemo } from 'react'
import PageHeader from '../components/layout/PageHeader.jsx'
import './PesananPage.css'

const INIT_TAWARAN = [
  { id: 'TAW-001', pembeli: 'UMKM Makmur Jaya',         kontak: '0811-1234-5678', produk: 'Matoa',           jumlah: '150 kg', hargaTawar: 'Rp 25.000/kg', total: 'Rp 3.750.000',  tanggal: '2026-07-16', jarak: '12 km', catatan: 'Butuh pengiriman sebelum 20 Juli.', status: 'menunggu' },
  { id: 'TAW-002', pembeli: 'UMKM Sari Bumi',           kontak: '0812-2345-6789', produk: 'Alpukat Mentega', jumlah: '80 kg',  hargaTawar: 'Rp 20.000/kg', total: 'Rp 1.600.000',  tanggal: '2026-07-16', jarak: '35 km', catatan: '', status: 'menunggu' },
  { id: 'TAW-003', pembeli: 'UMKM Dapur Nusantara',     kontak: '0813-3456-7890', produk: 'Nanas Madu',      jumlah: '200 kg', hargaTawar: 'Rp 14.000/kg', total: 'Rp 2.800.000',  tanggal: '2026-07-15', jarak: '8 km',  catatan: 'Stok harus fresh, panen max 3 hari lalu.', status: 'menunggu' },
  { id: 'TAW-004', pembeli: 'UMKM Berkah Tani',         kontak: '0814-4567-8901', produk: 'Matoa',           jumlah: '500 kg', hargaTawar: 'Rp 26.000/kg', total: 'Rp 13.000.000', tanggal: '2026-07-15', jarak: '62 km', catatan: 'Jumlah besar, bisa negosiasi harga.', status: 'menunggu' },
  { id: 'TAW-005', pembeli: 'UMKM Rasa Kampung',        kontak: '0815-5678-9012', produk: 'Alpukat Mentega', jumlah: '50 kg',  hargaTawar: 'Rp 21.000/kg', total: 'Rp 1.050.000',  tanggal: '2026-07-14', jarak: '5 km',  catatan: '', status: 'ditolak' },
  { id: 'TAW-006', pembeli: 'UMKM Hijau Lestari',       kontak: '0816-6789-0123', produk: 'Nanas Madu',      jumlah: '120 kg', hargaTawar: 'Rp 15.000/kg', total: 'Rp 1.800.000',  tanggal: '2026-07-14', jarak: '18 km', catatan: '', status: 'diterima' },
]

const STATUS_CONFIG = {
  menunggu: { label: 'Menunggu', color: '#f59e0b', bg: '#fffbeb' },
  diterima: { label: 'Diterima', color: '#22c55e', bg: '#f0fdf4' },
  ditolak:  { label: 'Ditolak',  color: '#ef4444', bg: '#fff5f5' },
}

const TABS = [
  { key: 'semua',    label: 'Semua' },
  { key: 'menunggu', label: 'Menunggu' },
  { key: 'diterima', label: 'Diterima' },
  { key: 'ditolak',  label: 'Ditolak' },
]

export default function PesananPage() {
  const [tawaran, setTawaran] = useState(INIT_TAWARAN)
  const [activeTab, setActiveTab] = useState('semua')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return tawaran.filter((t) => {
      const matchTab = activeTab === 'semua' || t.status === activeTab
      const matchSearch =
        t.pembeli.toLowerCase().includes(search.toLowerCase()) ||
        t.produk.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase())
      return matchTab && matchSearch
    })
  }, [tawaran, activeTab, search])

  const handleTerima = (id) =>
    setTawaran((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'diterima' } : t)))

  const handleTolak = (id) =>
    setTawaran((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'ditolak' } : t)))

  return (
    <div className="pesanan">
      <PageHeader title="Pesanan" subtitle="Terima atau tolak tawaran pembelian dari UMKM." />

      <section className="pesanan__card">
        {/* Toolbar */}
        <div className="pesanan__toolbar">
          <input
            type="text"
            className="pesanan__search"
            placeholder="Cari pembeli, produk, atau ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="pesanan__tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`pesanan__tab ${activeTab === tab.key ? 'pesanan__tab--active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              <span className="pesanan__tab-count">
                {tab.key === 'semua' ? tawaran.length : tawaran.filter((t) => t.status === tab.key).length}
              </span>
            </button>
          ))}
        </div>

        {/* List tawaran */}
        <div className="pesanan__list">
          {filtered.length === 0 ? (
            <div className="pesanan__empty">Tidak ada tawaran ditemukan.</div>
          ) : (
            filtered.map((t) => {
              const s = STATUS_CONFIG[t.status]
              return (
                <div key={t.id} className="pesanan__item">
                  <div className="pesanan__item-top">
                    <div className="pesanan__item-left">
                      <span className="pesanan__item-id">{t.id}</span>
                      <span className="pesanan__item-tanggal">{t.tanggal}</span>
                    </div>
                    <span className="pesanan__badge" style={{ color: s.color, background: s.bg }}>
                      {s.label}
                    </span>
                  </div>

                  <div className="pesanan__item-body">
                    <div className="pesanan__item-info">
                      <div className="pesanan__item-pembeli">{t.pembeli}</div>
                      <div className="pesanan__item-meta">
                        <span>📦 {t.produk} · {t.jumlah}</span>
                        <span>📍 {t.jarak} dari lokasi kamu</span>
                        <span>💰 Harga tawar: {t.hargaTawar}</span>
                      </div>
                      {t.catatan && (
                        <div className="pesanan__item-catatan">💬 "{t.catatan}"</div>
                      )}
                    </div>
                    <div className="pesanan__item-total">
                      <div className="pesanan__item-total-label">Total tawaran</div>
                      <div className="pesanan__item-total-value">{t.total}</div>
                    </div>
                  </div>

                  {t.status === 'menunggu' && (
                    <div className="pesanan__item-actions">
                      <button
                        type="button"
                        className="pesanan__btn pesanan__btn--tolak"
                        onClick={() => handleTolak(t.id)}
                      >
                        Tolak
                      </button>
                      <button
                        type="button"
                        className="pesanan__btn pesanan__btn--terima"
                        onClick={() => handleTerima(t.id)}
                      >
                        Terima Tawaran
                      </button>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </section>
    </div>
  )
}
