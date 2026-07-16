import { Search, ChevronDown } from 'lucide-react'
import './ProdukToolbar.css'

export default function ProdukToolbar({ search, onSearchChange, kategori, onKategoriChange, kategoriOptions }) {
  return (
    <div className="produk-toolbar">
      <div className="produk-toolbar__search">
        <Search size={17} className="produk-toolbar__search-icon" aria-hidden="true" />
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      <div className="produk-toolbar__select">
        <select value={kategori} onChange={(e) => onKategoriChange?.(e.target.value)}>
          {kategoriOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown size={17} className="produk-toolbar__select-icon" aria-hidden="true" />
      </div>
    </div>
  )
}
