import { ORDER_STATUS } from '../../data/orders.js'
import './OrderStatusBadge.css'

export default function OrderStatusBadge({ status }) {
  return (
    <span className={`order-status order-status--${status}`}>
      <span className="order-status__dot" aria-hidden="true" />
      {ORDER_STATUS[status] ?? status}
    </span>
  )
}
