import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader.jsx'
import ProdukToolbar from '../components/produk/ProdukToolbar.jsx'
import ProdukTabs from '../components/produk/ProdukTabs.jsx'
import ProdukTable from '../components/produk/ProdukTable.jsx'
import Pagination from '../components/produk/Pagination.jsx'
import './ProdukSayaPage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const TABS = [
  { key: 'semua',      label: 'Semua Produk' },
  { key: 'tersedia',   label: 'Tersedia' },
  { key: 'stok-rendah', label: 'Stok Rendah' },
  { key: 'habis',      label: 'Habis' },
]

const KATEGORI_OPTIONS = ['Semua Kategori', 'Buah', 'Sayur', 'Rempah', 'Lainnya']
const PAGE_SIZE = 5

// Konversi data API → format yang dipakai ProdukTable
function toTableFormat(p) {
  const stokKg = p.quantityKg ?? 0
  let status = 'tersedia'
  if (stokKg === 0)        status = 'habis'
  else if (stokKg < 50)    status = 'stok-rendah'

  return {
    id:            p.id,
    name:          p.name,
    emoji:         p.iconUrl ?? '📦',
    kategori:      p.kategori ?? 'Lainnya',
    stok:          `${stokKg} kg`,
    harga:         `Rp ${Number(p.pricePerKg).toLocaleString('id-ID')}`,
    terjual:       '—',             // belum ada data terjual dari API
    status,
    predictedTier: p.predictedTier ?? null,
  }
}

export default function ProdukSayaPage() {
  const navigate = useNavigate()
  const [products, setProducts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [search, setSearch]       = useState('')
  const [kategori, setKategori]   = useState('Semua Kategori')
  const [activeTab, setActiveTab] = useState('semua')
  const [page, setPage]           = useState(1)

  // Fetch produk dari API
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (!token) { navigate('/login'); return }

    fetch(`${API_URL}/api/products`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.products) {
          setProducts(data.products.map(toTableFormat))
        } else {
          setError('Gagal memuat produk.')
        }
      })
      .catch(() => setError('Tidak dapat terhubung ke server.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch   = p.name.toLowerCase().includes(search.trim().toLowerCase())
      const matchKategori = kategori === 'Semua Kategori' || p.kategori === kategori
      const matchTab      = activeTab === 'semua' || p.status === activeTab
      return matchSearch && matchKategori && matchTab
    })
  }, [products, search, kategori, activeTab])

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated   = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const updateSearch   = (v) => { setSearch(v);   setPage(1) }
  const updateKategori = (v) => { setKategori(v); setPage(1) }
  const updateTab      = (k) => { setActiveTab(k); setPage(1) }

  return (
    <div className="produk-saya">
      <PageHeader
        title="Produk Saya"
        subtitle="Kelola semua produk hasil panen yang Anda jual."
        onAddProduct={() => navigate('/petani/tambah-produk')}
      />

      <section className="produk-saya__card">
        {loading ? (
          <div className="produk-saya__loading">Memuat produk...</div>
        ) : error ? (
          <div className="produk-saya__error">{error}</div>
        ) : (
          <>
            <ProdukToolbar
              search={search}
              onSearchChange={updateSearch}
              kategori={kategori}
              onKategoriChange={updateKategori}
              kategoriOptions={KATEGORI_OPTIONS}
            />

            <ProdukTabs tabs={TABS} active={activeTab} onChange={updateTab} />

            <ProdukTable
              products={paginated}
              onEdit={(p) => alert(`Edit produk: ${p.name}`)}
              onMore={(p) => alert(`Aksi lainnya untuk: ${p.name}`)}
            />

            <Pagination
              page={currentPage}
              totalPages={totalPages}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </div>
  )
}
