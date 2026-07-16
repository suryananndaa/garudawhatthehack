import { ChevronRight } from 'lucide-react'
import OrderStatusBadge from './OrderStatusBadge.jsx'
import { formatRupiah, getOrderTotal } from '../../data/orders.js'
import './OrdersTable.css'

export default function OrdersTable({ orders, onView }) {
  if (orders.length === 0) {
    return (
      <div className="orders-table__empty">
        Tidak ada pesanan yang cocok dengan pencarian atau filter ini.
      </div>
    )
  }

  return (
    <div className="orders-table">
      <div className="orders-table__scroll">
        <table>
          <thead>
            <tr>
              <th>No. Pesanan</th>
              <th>Pembeli</th>
              <th>Produk</th>
              <th>Tanggal</th>
              <th>Total</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const firstItem = order.items[0]
              const extraCount = order.items.length - 1
              return (
                <tr key={order.id} className="orders-table__row" onClick={() => onView?.(order)}>
                  <td>
                    <span className="orders-table__id">{order.id}</span>
                  </td>
                  <td>
                    <div className="orders-table__buyer">
                      <span>{order.buyer}</span>
                      <span className="orders-table__city">{order.kota}</span>
                    </div>
                  </td>
                  <td>
                    <div className="orders-table__product">
                      <span className="orders-table__emoji" aria-hidden="true">{firstItem.emoji}</span>
                      <span>
                        {firstItem.name}
                        {extraCount > 0 && <span className="orders-table__extra"> +{extraCount} lainnya</span>}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="orders-table__date">
                      <span>{order.tanggal}</span>
                      <span className="orders-table__time">{order.waktu}</span>
                    </div>
                  </td>
                  <td className="orders-table__total">{formatRupiah(getOrderTotal(order))}</td>
                  <td>
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td>
                    <button
                      className="orders-table__view"
                      aria-label={`Lihat detail pesanan ${order.id}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        onView?.(order)
                      }}
                    >
                      <ChevronRight size={17} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
