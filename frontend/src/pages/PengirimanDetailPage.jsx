import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './PengirimanDetailPage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const TRACKING_STEPS = [
  { key: 'diproses',         label: 'Pesanan Diterima',  desc: 'Petani telah menerima dan mengkonfirmasi pesanan' },
  { key: 'dalam_pengiriman', label: 'Dalam Pengiriman',  desc: 'Produk sedang dalam perjalanan ke pembeli' },
  { key: 'selesai',          label: 'Selesai',           desc: 'Pesanan telah diterima oleh pembeli' },
]

const TRACKING_NEXT = {
  diproses:         'dalam_pengiriman',
  dalam_pengiriman: 'selesai',
  selesai:          null,
}

const STEP_INDEX = { diproses: 0, dalam_pengiriman: 1, selesai: 2 }

function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token')
}

export default function PengirimanDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder]     = useState(null)
  const [tracking, setTracking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/api/orders`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(r => r.json())
      .then(data => {
        const found = data.orders?.find(o => o.id === id)
        if (found) {
          setOrder(found)
          setTracking(found.status)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const handleNextStep = async () => {
    const nextStep = TRACKING_NEXT[tracking]
    if (!nextStep) return
    setSaving(true)
    const res = await fetch(`${API_URL}/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ status: nextStep }),
    })
    if (res.ok) setTracking(nextStep)
    setSaving(false)
  }

  if (loading) return <div style={{ padding: 40, color: '#aaa', textAlign: 'center' }}>Memuat data...</div>

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

  const currentIndex = STEP_INDEX[tracking] ?? 0
  const nextStep     = TRACKING_NEXT[tracking]
  const nextLabel    = nextStep ? TRACKING_STEPS.find(s => s.key === nextStep)?.label : null
  const produkList   = order.items?.map(i => `${i.product?.name ?? '—'} ${i.quantityKg} kg`).join(', ') ?? '—'

  return (
    <div className="pengiriman-detail">
      <div className="pengiriman-detail__header">
        <button type="button" className="pengiriman-detail__back" onClick={() => navigate('/petani/pengiriman')}>
          ← Kembali ke Pengiriman
        </button>
        <h2 className="pengiriman-detail__title">Detail Pengiriman</h2>
        <p className="pengiriman-detail__sub">
          {order.id.slice(0, 8).toUpperCase()} · {new Date(order.createdAt).toLocaleDateString('id-ID')}
        </p>
      </div>

      <div className="pengiriman-detail__body">
        {/* Tracking stepper horizontal */}
        <div className="pengiriman-detail__card">
          <h3 className="pengiriman-detail__section-title">Status Pengiriman</h3>
          <div className="tracking__stepper">
            <div className="tracking__dots-row">
              {TRACKING_STEPS.map((step, i) => {
                const isDone   = i < currentIndex
                const isActive = i === currentIndex
                return (
                  <div key={step.key} className="tracking__dot-col">
                    <div className={`tracking__dot ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                      {isDone ? '✓' : i + 1}
                    </div>
                    {i < TRACKING_STEPS.length - 1 && (
                      <div className={`tracking__line ${isDone ? 'done' : ''}`} />
                    )}
                  </div>
                )
              })}
            </div>
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

          {nextStep ? (
            <div className="tracking__action">
              <button
                type="button"
                className="tracking__btn-next"
                onClick={handleNextStep}
                disabled={saving}
              >
                {saving ? 'Menyimpan...' : `Tandai: ${nextLabel} →`}
              </button>
            </div>
          ) : (
            <div className="tracking__done-msg">🎉 Pesanan ini telah selesai.</div>
          )}
        </div>

        {/* Info pembeli */}
        <div className="pengiriman-detail__card">
          <h3 className="pengiriman-detail__section-title">Informasi Pembeli</h3>
          <div className="pengiriman-detail__row">
            <span className="pengiriman-detail__label">Nama</span>
            <span className="pengiriman-detail__value">{order.buyerName}</span>
          </div>
          {order.buyerContact && (
            <div className="pengiriman-detail__row">
              <span className="pengiriman-detail__label">Kontak</span>
              <span className="pengiriman-detail__value">{order.buyerContact}</span>
            </div>
          )}
        </div>

        {/* Rincian produk */}
        <div className="pengiriman-detail__card">
          <h3 className="pengiriman-detail__section-title">Rincian Produk</h3>
          <div className="pengiriman-detail__row">
            <span className="pengiriman-detail__label">Produk</span>
            <span className="pengiriman-detail__value">{produkList}</span>
          </div>
          <div className="pengiriman-detail__row pengiriman-detail__row--total">
            <span className="pengiriman-detail__label">Total</span>
            <span className="pengiriman-detail__value pengiriman-detail__total">
              Rp {Number(order.totalPrice).toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
