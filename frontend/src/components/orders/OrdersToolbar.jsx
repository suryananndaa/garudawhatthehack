import { Search, ChevronDown, ArrowDownUp } from 'lucide-react'
import './OrdersToolbar.css'

const SORT_OPTIONS = [
  { value: 'terbaru', label: 'Terbaru' },
  { value: 'terlama', label: 'Terlama' },
  { value: 'total-tertinggi', label: 'Total Tertinggi' },
  { value: 'total-terendah', label: 'Total Terendah' },
]

export default function OrdersToolbar({ search, onSearchChange, sort, onSortChange }) {
  return (
    <div className="orders-toolbar">
      <div className="orders-toolbar__search">
        <Search size={17} className="orders-toolbar__search-icon" aria-hidden="true" />
        <input
          type="text"
          placeholder="Cari nomor pesanan atau nama pembeli..."
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      <div className="orders-toolbar__sort">
        <ArrowDownUp size={15} className="orders-toolbar__sort-icon" aria-hidden="true" />
        <select value={sort} onChange={(e) => onSortChange?.(e.target.value)}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="orders-toolbar__select-icon" aria-hidden="true" />
      </div>
    </div>
  )
}
