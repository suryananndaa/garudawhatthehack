import { MoreHorizontal } from 'lucide-react'
import StatusBadge from './StatusBadge.jsx'
import './ProdukTable.css'

const TIER_CONFIG = {
  Fresh:    { label: 'Fresh',    bg: '#f0fdf4', color: '#166534' },
  Standard: { label: 'Standard', bg: '#fefce8', color: '#854d0e' },
  Rescue:   { label: 'Rescue',   bg: '#fff5f5', color: '#991b1b' },
}

function TierBadge({ tier }) {
  if (!tier) return <span style={{ color: '#ccc', fontSize: 12 }}>—</span>
  const t = TIER_CONFIG[tier] ?? TIER_CONFIG.Standard
  return (
    <span style={{
      background: t.bg,
      color: t.color,
      padding: '3px 10px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
    }}>
      {t.label}
    </span>
  )
}

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
              <th>Tier Kesegaran</th>
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
                <td><TierBadge tier={product.predictedTier} /></td>
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
