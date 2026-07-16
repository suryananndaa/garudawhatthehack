import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './PengirimanDetailPage.css'

const ORDERS_DATA = {
  'ORD-001': { id: 'ORD-001', pembeli: 'UMKM Berkah Jaya',         kontak: '0812-1111-2222', produk: 'Matoa',           jumlah: '300 kg',   harga: 'Rp 28.000/kg', total: 'Rp 8.400.000', tanggal: '2026-07-14', alamat: 'Jl. Merdeka No. 12, Jakarta Selatan',  tracking: 'selesai' },
  'ORD-002': { id: 'ORD-002', pembeli: 'UMKM Sari Rasa',           kontak: '0813-2222-3333', produk: 'Alpukat Mentega', jumlah: '200 kg',   harga: 'Rp 22.000/kg', total: 'Rp 4.400.000', tanggal: '2026-07-13', alamat: 'Jl. Sudirman No. 45, Bandung',          tracking: 'selesai' },
  'ORD-003': { id: 'ORD-003', pembeli: 'UMKM Segar Alami',         kontak: '0814-3333-4444', produk: 'Nanas Madu',      jumlah: '137.5 kg', harga: 'Rp 16.000/kg', total: 'Rp 2.200.000', tanggal: '2026-07-12', alamat: 'Jl. Gatot Subroto No. 7, Surabaya',    tracking: 'selesai' },
  'ORD-004': { id: 'ORD-004', pembeli: 'UMKM Rejeki Barokah',      kontak: '0815-4444-5555', produk: 'Matoa',           jumlah: '50 kg',    harga: 'Rp 28.000/kg', total: 'Rp 1.400.000', tanggal: '2026-07-15', alamat: 'Jl. Ahmad Yani No. 3, Makassar',        tracking: 'dalam_pengiriman' },
  'ORD-005': { id: 'ORD-005', pembeli: 'UMKM Cita Rasa Nusantara', kontak: '0816-5555-6666', produk: 'Alpukat Mentega', jumlah: '30 kg',    harga: 'Rp 22.000/kg', total: 'Rp 660.000',   tanggal: '2026-07-15', alamat: 'Jl. Diponegoro No. 88, Yogyakarta',     tracking: 'diproses' },
  'ORD-006': { id: 'ORD-006', pembeli: 'UMKM Tani Makmur',         kontak: '0817-6666-7777', produk: 'Nanas Madu',      jumlah: '25 kg',    harga: 'Rp 16.000/kg', total: 'Rp 400.000',   tanggal: '2026-07-16', alamat: 'Jl. Pemuda No. 21, Semarang',           tracking: 'diterima' },
  'ORD-007': { id: 'ORD-007', pembeli: 'UMKM Sumber Segar',        kontak: '0818-7777-8888', produk: 'Matoa',           jumlah: '40 kg',    harga: 'Rp 28.000/kg', total: 'Rp 1.120.000', tanggal: '2026-07-16', alamat: 'Jl. Pemuda No. 5, Semarang',            tracking: 'diterima' },
}

const TRACKING_STEPS = [
  { key: 'diterima',         label: 'Pesanan Diterima',  desc: 'Petani telah menerima dan mengkonfirmasi pesanan' },
  { key: 'diproses',         label: 'Sedang Diproses',   desc: 'Produk sedang dipanen / disiapkan' },
  { key: 'dalam_pengiriman', label: 'Dalam Pengiriman',  desc: 'Produk sedang dalam perjalanan ke pembeli' },
  { key: 'selesai',          label: 'Selesai',           desc: 'Pesanan telah diterima oleh pembeli' },
]

const STEP_INDEX = { diterima: 0, diproses: 1, dalam_pengiriman: 2, selesai: 3 }

export default function PengirimanDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tracking, setTracking] = useState(() => ORDERS_DATA[id]?.tracking ?? 'diterima')

  const order = ORDERS_DATA[id]

  if (!order) {
    return (
      <div className="pengiriman-detail__notfound">
        <div style={{ fontSize: 48 }}>📭</div>
        <h2>Pesanan tidak ditemukan</h2>
        <button type="button" onClick={() => navigate('/petani/pengiriman')} className="pengiriman-detail__back-btn">
          ← Kembali ke Pengiriman
        </button>
      </div>
    )
  }

  const currentIndex = STEP_INDEX[tracking]

  function handleStepClick(stepKey) {
    // TODO: panggil API buat update status pengiriman pesanan ini di backend
    setTracking(stepKey)
  }

  return (
    <div className="pengiriman-detail">
      {/* Header */}
      <div className="pengiriman-detail__header">
        <button type="button" className="pengiriman-detail__back" onClick={() => navigate('/petani/pengiriman')}>
          ← Kembali ke Pengiriman
        </button>
        <h2 className="pengiriman-detail__title">Detail Pengiriman</h2>
        <p className="pengiriman-detail__sub">{order.id} · {order.tanggal}</p>
      </div>

      <div className="pengiriman-detail__body">
        {/* Tracking stepper */}
        <div className="pengiriman-detail__card">
          <h3 className="pengiriman-detail__section-title">Status Pengiriman</h3>
          <div className="tracking__stepper">
            {/* Baris atas: dot (bisa diklik langsung) + line */}
            <div className="tracking__dots-row">
              {TRACKING_STEPS.map((step, i) => {
                const isDone   = i < currentIndex
                const isActive = i === currentIndex
                return (
                  <div key={step.key} className="tracking__dot-col">
                    <button
                      type="button"
                      className={`tracking__dot ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}
                      onClick={() => handleStepClick(step.key)}
                      aria-label={`Ubah status ke ${step.label}`}
                      aria-current={isActive ? 'step' : undefined}
                    >
                      {isDone ? '✓' : i + 1}
                    </button>
                    {i < TRACKING_STEPS.length - 1 && (
                      <div className={`tracking__line ${isDone ? 'done' : ''}`} />
                    )}
                  </div>
                )
              })}
            </div>
            {/* Baris bawah: label + deskripsi */}
            <div className="tracking__labels-row">
              {TRACKING_STEPS.map((step, i) => {
                const isDone   = i < currentIndex
                const isActive = i === currentIndex
                return (
                  <div key={step.key} className={`tracking__label-col ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                    <div className="tracking__step-label">{step.label}</div>
                    <div className="tracking__step-desc">{step.desc}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {tracking === 'selesai' && (
            <div className="tracking__done-msg">🎉 Pesanan ini telah selesai.</div>
          )}
        </div>

        {/* Info pembeli */}
        <div className="pengiriman-detail__card">
          <h3 className="pengiriman-detail__section-title">Informasi Pembeli</h3>
          <div className="pengiriman-detail__row">
            <span className="pengiriman-detail__label">Nama</span>
            <span className="pengiriman-detail__value">{order.pembeli}</span>
          </div>
          <div className="pengiriman-detail__row">
            <span className="pengiriman-detail__label">Kontak</span>
            <span className="pengiriman-detail__value">{order.kontak}</span>
          </div>
          <div className="pengiriman-detail__row">
            <span className="pengiriman-detail__label">Alamat</span>
            <span className="pengiriman-detail__value">{order.alamat}</span>
          </div>
        </div>

        {/* Rincian produk */}
        <div className="pengiriman-detail__card">
          <h3 className="pengiriman-detail__section-title">Rincian Produk</h3>
          <div className="pengiriman-detail__row">
            <span className="pengiriman-detail__label">Produk</span>
            <span className="pengiriman-detail__value">{order.produk}</span>
          </div>
          <div className="pengiriman-detail__row">
            <span className="pengiriman-detail__label">Jumlah</span>
            <span className="pengiriman-detail__value">{order.jumlah}</span>
          </div>
          <div className="pengiriman-detail__row">
            <span className="pengiriman-detail__label">Harga satuan</span>
            <span className="pengiriman-detail__value">{order.harga}</span>
          </div>
          <div className="pengiriman-detail__row pengiriman-detail__row--total">
            <span className="pengiriman-detail__label">Total</span>
            <span className="pengiriman-detail__value pengiriman-detail__total">{order.total}</span>
          </div>
        </div>
      </div>
    </div>
  )
}