import { formatRupiah } from '../../data/orders.js'
import './OrderItemsList.css'

export default function OrderItemsList({ items }) {
  return (
    <div className="order-items">
      {items.map((item) => (
        <div className="order-items__row" key={item.name}>
          <span className="order-items__emoji" aria-hidden="true">{item.emoji}</span>
          <div className="order-items__info">
            <span className="order-items__name">{item.name}</span>
            <span className="order-items__meta">
              {item.qty} {item.unit} &times; {formatRupiah(item.harga)}
            </span>
          </div>
          <span className="order-items__subtotal">{formatRupiah(item.qty * item.harga)}</span>
        </div>
      ))}
    </div>
  )
}
