import { ChevronLeft, ChevronRight } from 'lucide-react'
import './Pagination.css'

export default function Pagination({ page, totalPages, totalItems, pageSize, onPageChange }) {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="pagination">
      <p className="pagination__summary">
        Menampilkan {start}-{end} dari {totalItems} produk
      </p>

      <div className="pagination__controls">
        <button
          className="pagination__nav"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            className={`pagination__page ${p === page ? 'pagination__page--active' : ''}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}

        <button
          className="pagination__nav"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Halaman berikutnya"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
