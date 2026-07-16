import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader.jsx'
import ProdukToolbar from '../components/produk/ProdukToolbar.jsx'
import Tabs from '../components/shared/Tabs.jsx'
import ProdukTable from '../components/produk/ProdukTable.jsx'
import Pagination from '../components/shared/Pagination.jsx'
import './ProdukSayaPage.css'

const ALL_PRODUCTS = [
  { emoji: '🥭', name: 'Matoa', kategori: 'Buah', stok: '1.250 kg', harga: 'Rp 28.000', terjual: '850 kg', status: 'tersedia' },
  { emoji: '🥑', name: 'Alpukat Mentega', kategori: 'Buah', stok: '900 kg', harga: 'Rp 22.000', terjual: '620 kg', status: 'tersedia' },
  { emoji: '🍍', name: 'Nanas Madu', kategori: 'Buah', stok: '750 kg', harga: 'Rp 12.000', terjual: '410 kg', status: 'tersedia' },
  { emoji: '🍫', name: 'Kakao Fermentasi', kategori: 'Rempah', stok: '500 kg', harga: 'Rp 35.000', terjual: '220 kg', status: 'tersedia' },
  { emoji: '🟣', name: 'Manggis', kategori: 'Buah', stok: '200 kg', harga: 'Rp 30.000', terjual: '120 kg', status: 'stok-rendah' },
  { emoji: '🍋', name: 'Jeruk Nipis', kategori: 'Buah', stok: '0 kg', harga: 'Rp 18.000', terjual: '95 kg', status: 'habis' },
  { emoji: '🌶️', name: 'Cabai Rawit', kategori: 'Rempah', stok: '340 kg', harga: 'Rp 55.000', terjual: '410 kg', status: 'tersedia' },
  { emoji: '🧄', name: 'Bawang Putih', kategori: 'Rempah', stok: '180 kg', harga: 'Rp 40.000', terjual: '260 kg', status: 'stok-rendah' },
  { emoji: '🥥', name: 'Kelapa Muda', kategori: 'Buah', stok: '600 kg', harga: 'Rp 15.000', terjual: '300 kg', status: 'tersedia' },
  { emoji: '🍅', name: 'Tomat', kategori: 'Sayur', stok: '420 kg', harga: 'Rp 10.000', terjual: '380 kg', status: 'tersedia' },
  { emoji: '🥬', name: 'Sawi Hijau', kategori: 'Sayur', stok: '0 kg', harga: 'Rp 8.000', terjual: '150 kg', status: 'habis' },
  { emoji: '🍯', name: 'Madu Hutan', kategori: 'Lainnya', stok: '90 kg', harga: 'Rp 120.000', terjual: '60 kg', status: 'stok-rendah' },
]

const TABS = [
  { key: 'semua', label: 'Semua Produk' },
  { key: 'tersedia', label: 'Tersedia' },
  { key: 'stok-rendah', label: 'Stok Rendah' },
  { key: 'habis', label: 'Habis' },
]

const KATEGORI_OPTIONS = ['Semua Kategori', 'Buah', 'Sayur', 'Rempah', 'Lainnya']

const PAGE_SIZE = 5

export default function ProdukSayaPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [kategori, setKategori] = useState('Semua Kategori')
  const [activeTab, setActiveTab] = useState('semua')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return ALL_PRODUCTS.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.trim().toLowerCase())
      const matchesKategori = kategori === 'Semua Kategori' || product.kategori === kategori
      const matchesTab = activeTab === 'semua' || product.status === activeTab
      return matchesSearch && matchesKategori && matchesTab
    })
  }, [search, kategori, activeTab])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const updateSearch = (value) => {
    setSearch(value)
    setPage(1)
  }

  const updateKategori = (value) => {
    setKategori(value)
    setPage(1)
  }

  const updateTab = (key) => {
    setActiveTab(key)
    setPage(1)
  }

  return (
    <div className="produk-saya">
      <PageHeader
        title="Produk Saya"
        subtitle="Kelola semua produk hasil panen yang Anda jual."
        onAddProduct={() => navigate('/tambah-produk')}
      />

      <section className="produk-saya__card">
        <ProdukToolbar
          search={search}
          onSearchChange={updateSearch}
          kategori={kategori}
          onKategoriChange={updateKategori}
          kategoriOptions={KATEGORI_OPTIONS}
        />

        <Tabs tabs={TABS} active={activeTab} onChange={updateTab} ariaLabel="Filter status produk" />

        <ProdukTable
          products={paginated}
          onEdit={(product) => alert(`Edit produk: ${product.name}`)}
          onMore={(product) => alert(`Aksi lainnya untuk: ${product.name}`)}
        />

        <Pagination
          page={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          itemLabel="produk"
        />
      </section>
    </div>
  )
}
