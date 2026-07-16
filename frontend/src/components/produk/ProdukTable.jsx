import { MoreHorizontal } from 'lucide-react'
import StatusBadge from './StatusBadge.jsx'
import './ProdukTable.css'

export default function ProdukTable({ products, onEdit, onMore }) {
  if (products.length === 0) {
    return (
      <div className="produk-table__empty">
        Tidak ada produk yang cocok dengan pencarian atau filter ini.
      </div>
    )
  }

  return (
    <div className="produk-table">
      <div className="produk-table__scroll">
        <table>
          <thead>
            <tr>
              <th>Produk</th>
              <th>Kategori</th>
              <th>Stok Tersedia</th>
              <th>Harga / kg</th>
              <th>Terjual (Bulan ini)</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.name}>
                <td>
                  <div className="produk-table__product">
                    <span className="produk-table__emoji" aria-hidden="true">{product.emoji}</span>
                    <span>{product.name}</span>
                  </div>
                </td>
                <td>{product.kategori}</td>
                <td>{product.stok}</td>
                <td>{product.harga}</td>
                <td>{product.terjual}</td>
                <td>
                  <StatusBadge status={product.status} />
                </td>
                <td>
                  <div className="produk-table__actions">
                    <button className="produk-table__edit" onClick={() => onEdit?.(product)}>
                      Edit
                    </button>
                    <button
                      className="produk-table__more"
                      aria-label={`Aksi lainnya untuk ${product.name}`}
                      onClick={() => onMore?.(product)}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
