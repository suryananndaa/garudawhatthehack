import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Wallet, StickyNote } from 'lucide-react'
import OrderStatusBadge from '../components/orders/OrderStatusBadge.jsx'
import OrderTimeline from '../components/orders/OrderTimeline.jsx'
import OrderItemsList from '../components/orders/OrderItemsList.jsx'
import OrderActions from '../components/orders/OrderActions.jsx'
import { getOrderById, getOrderSubtotal, getOrderTotal, formatRupiah } from '../data/orders.js'
import './PesananDetailPage.css'

export default function PesananDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const baseOrder = getOrderById(id)
  const [order, setOrder] = useState(baseOrder)

  if (!order) {
    return (
      <div className="pesanan-detail__not-found">
        <p>Pesanan dengan nomor "{id}" tidak ditemukan.</p>
        <Link to="/pesanan" className="pesanan-detail__back-link">
          <ArrowLeft size={16} />
          Kembali ke daftar pesanan
        </Link>
      </div>
    )
  }

  const subtotal = getOrderSubtotal(order)
  const total = getOrderTotal(order)

  const handleAdvance = (nextStatus) => setOrder((prev) => ({ ...prev, status: nextStatus }))
  const handleCancel = () => {
    if (confirm('Tolak pesanan ini? Pembeli akan diberi tahu bahwa pesanan dibatalkan.')) {
      setOrder((prev) => ({ ...prev, status: 'dibatalkan' }))
    }
  }

  return (
    <div className="pesanan-detail">
      <button className="pesanan-detail__back" onClick={() => navigate('/pesanan')}>
        <ArrowLeft size={16} />
        Kembali ke Pesanan
      </button>

      <div className="pesanan-detail__header">
        <div>
          <div className="pesanan-detail__title-row">
            <h2 className="pesanan-detail__title">{order.id}</h2>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="pesanan-detail__subtitle">
            Dipesan pada {order.tanggal} &middot; {order.waktu} oleh {order.buyer}
          </p>
        </div>
      </div>

      <section className="pesanan-detail__card">
        <OrderTimeline status={order.status} />
      </section>

      <div className="pesanan-detail__grid">
        <div className="pesanan-detail__main">
          <section className="pesanan-detail__card">
            <h3 className="pesanan-detail__card-title">Produk Dipesan</h3>
            <OrderItemsList items={order.items} />
          </section>

          {order.catatan && (
            <section className="pesanan-detail__card">
              <h3 className="pesanan-detail__card-title">
                <StickyNote size={16} />
                Catatan Pembeli
              </h3>
              <p className="pesanan-detail__note">{order.catatan}</p>
            </section>
          )}
        </div>

        <div className="pesanan-detail__side">
          <section className="pesanan-detail__card">
            <h3 className="pesanan-detail__card-title">
              <MapPin size={16} />
              Informasi Pembeli
            </h3>
            <p className="pesanan-detail__buyer-name">{order.buyer}</p>
            <p className="pesanan-detail__address">{order.alamat}</p>
          </section>

          <section className="pesanan-detail__card">
            <h3 className="pesanan-detail__card-title">
              <Wallet size={16} />
              Ringkasan Pembayaran
            </h3>
            <div className="pesanan-detail__summary-row">
              <span>Subtotal Produk</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            <div className="pesanan-detail__summary-row">
              <span>Ongkos Kirim</span>
              <span>{formatRupiah(order.ongkir)}</span>
            </div>
            <div className="pesanan-detail__summary-row pesanan-detail__summary-row--total">
              <span>Total</span>
              <span>{formatRupiah(total)}</span>
            </div>
            <div className="pesanan-detail__payment-method">
              Dibayar via <strong>{order.pembayaran}</strong>
            </div>
          </section>

          <section className="pesanan-detail__card">
            <h3 className="pesanan-detail__card-title">Aksi Pesanan</h3>
            <OrderActions status={order.status} onAdvance={handleAdvance} onCancel={handleCancel} />
          </section>
        </div>
      </div>
    </div>
  )
}
