import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Store } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader.jsx'
import StatsGrid from '../components/dashboard/StatsGrid.jsx'
import ProductTable from '../components/dashboard/ProductTable.jsx'
import PerformancePanel from '../components/dashboard/PerformancePanel.jsx'
import NotificationPanel from '../components/dashboard/NotificationPanel.jsx'
import '../App.css'
import './BerandaPage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function formatRupiah(n) {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)} jt`
  if (n >= 1_000)     return `Rp ${(n / 1_000).toFixed(0)} rb`
  return `Rp ${n}`
}

function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token')
}

const TIER_LABEL = {
  Fresh:    { label: 'Fresh',    className: 'beranda-suggest__tier--fresh' },
  Standard: { label: 'Standard', className: 'beranda-suggest__tier--standard' },
  Rescue:   { label: 'Rescue',   className: 'beranda-suggest__tier--rescue' },
}

function formatPrice(n) {
  return `Rp ${Number(n).toLocaleString('id-ID')}/kg`
}

export default function BerandaPage() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchTouched, setSearchTouched] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [suggestionsLoading, setSuggestionsLoading] = useState(true)
  const [suggestionsMessage, setSuggestionsMessage] = useState('')

  useEffect(() => {
    const token = getToken()
    if (!token) { navigate('/login'); return }

    fetch(`${API_URL}/api/dashboard/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [navigate])

  useEffect(() => {
    const token = getToken()
    if (!token) return

    setSuggestionsLoading(true)
    fetch(`${API_URL}/api/dashboard/umkm-suggestions`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => {
        setSuggestions(d.suggestions ?? [])
        setSuggestionsMessage(d.message ?? '')
      })
      .catch(() => {
        setSuggestions([])
        setSuggestionsMessage('Gagal memuat rekomendasi UMKM')
      })
      .finally(() => setSuggestionsLoading(false))
  }, [])

  useEffect(() => {
    const q = searchQuery.trim()
    if (q.length < 2) {
      setSearchResults([])
      setSearchLoading(false)
      return
    }

    const token = getToken()
    if (!token) return

    setSearchLoading(true)
    const timer = setTimeout(() => {
      fetch(`${API_URL}/api/umkm/search?q=${encodeURIComponent(q)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(r => r.json())
        .then(d => setSearchResults(d.results ?? []))
        .catch(() => setSearchResults([]))
        .finally(() => setSearchLoading(false))
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}')

  const stats = data ? [
    { label: 'Pesanan Masuk',      value: String(data.stats.pesananMasuk),           footnote: 'Menunggu konfirmasi' },
    { label: 'Stok Tersedia',      value: `${data.stats.stokTotal.toFixed(1)} kg`,   footnote: 'Total semua produk' },
    { label: 'Pesanan Diproses',   value: String(data.stats.pesananDiproses),         footnote: 'Sedang diproses' },
    { label: 'Pendapatan Bulan Ini', value: formatRupiah(data.stats.pendapatanBulanIni), footnote: 'Bulan berjalan' },
  ] : []

  const products = data?.topProducts?.map(p => ({
    emoji: p.emoji, name: p.name, stock: p.stock, price: p.price, sold: '—',
  })) ?? []

  const notifications = data?.notifications?.map(n => ({
    id: n.id, message: n.message, isRead: n.isRead, createdAt: n.createdAt,
  })) ?? []

  const showSearchFeedback = searchTouched && searchQuery.trim().length >= 2

  return (
    <>
      <PageHeader
        title={`Halo, ${user.name ?? 'Petani'}!`}
        subtitle="Berikut ringkasan aktivitas Anda hari ini."
        onAddProduct={() => navigate('/petani/tambah-produk')}
      />

      <section className="beranda-search" aria-label="Cari toko UMKM">
        <p className="beranda-search__label">Cari Toko UMKM</p>
        <div className="beranda-search__input-wrap">
          <Search size={18} className="beranda-search__icon" aria-hidden="true" />
          <input
            type="search"
            className="beranda-search__input"
            placeholder="Ketik nama toko UMKM..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setSearchTouched(true)
            }}
          />
        </div>

        {searchQuery.trim().length > 0 && searchQuery.trim().length < 2 && (
          <p className="beranda-search__hint">Ketik minimal 2 karakter untuk mulai mencari.</p>
        )}

        {showSearchFeedback && (
          <div className="beranda-search__results">
            {searchLoading ? (
              <p className="beranda-search__hint">Mencari...</p>
            ) : searchResults.length === 0 ? (
              <p className="beranda-search__empty">Tidak ada toko UMKM dengan nama tersebut.</p>
            ) : (
              searchResults.map(umkm => (
                <div key={umkm.id} className="beranda-search__result">
                  <div className="beranda-search__avatar">
                    {umkm.logoUrl ? (
                      <img src={`${API_URL}${umkm.logoUrl}`} alt="" />
                    ) : (
                      <Store size={20} aria-hidden="true" />
                    )}
                  </div>
                  <div className="beranda-search__info">
                    <p className="beranda-search__name">{umkm.shopName}</p>
                    <p className="beranda-search__meta">
                      {[umkm.city, umkm.phone].filter(Boolean).join(' · ') || 'Profil UMKM'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      <section className="beranda-suggest" aria-label="Saran Pelanggan">
        <div className="beranda-suggest__header">
          <div>
            <p className="beranda-suggest__label">Saran Pelanggan</p>
            <p className="beranda-suggest__sub">UMKM yang kemungkinan besar butuh produk kamu saat ini</p>
          </div>
        </div>

        {suggestionsLoading ? (
          <p className="beranda-suggest__empty">Memuat rekomendasi...</p>
        ) : suggestions.length === 0 ? (
          <p className="beranda-suggest__empty">
            {suggestionsMessage || 'Belum ada UMKM yang cocok dengan produk kamu.'}
          </p>
        ) : (
          <div className="beranda-suggest__list">
            {suggestions.map((item, index) => {
              const tier = TIER_LABEL[item.predictedTier] ?? TIER_LABEL.Standard
              return (
                <article key={item.umkmId} className="beranda-suggest__card">
                  <div className="beranda-suggest__rank">#{index + 1}</div>
                  <div className="beranda-suggest__avatar">
                    {item.logoUrl ? (
                      <img src={`${API_URL}${item.logoUrl}`} alt="" />
                    ) : (
                      <Store size={20} aria-hidden="true" />
                    )}
                  </div>
                  <div className="beranda-suggest__body">
                    <div className="beranda-suggest__top">
                      <p className="beranda-suggest__name">{item.shopName}</p>
                      <span className="beranda-suggest__score">{Math.round(item.matchScore * 100)}% cocok</span>
                    </div>
                    <p className="beranda-suggest__meta">
                      {[item.city, item.phone].filter(Boolean).join(' · ')}
                    </p>
                    <div className="beranda-suggest__tags">
                      <span className="beranda-suggest__tag">Butuh: {item.matchedProduct}</span>
                      <span className="beranda-suggest__tag">Harga kamu: {formatPrice(item.yourPrice)}</span>
                      <span className={`beranda-suggest__tier ${tier.className}`}>{tier.label}</span>
                      {item.distanceKm < 9000 && (
                        <span className="beranda-suggest__tag">~{item.distanceKm} km</span>
                      )}
                    </div>
                    {item.note && (
                      <p className="beranda-suggest__note">"{item.note}"</p>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#aaa' }}>Memuat data...</div>
      ) : (
        <>
          <StatsGrid stats={stats} />
          <div className="app__grid">
            <ProductTable
              products={products}
              onManage={(p) => navigate('/petani/produk-saya')}
            />
            <div className="app__side">
              <PerformancePanel rating={data?.stats ? 4.8 : 0} maxRating={5} />
              <NotificationPanel notifications={notifications} />
            </div>
          </div>
        </>
      )}
    </>
  )
}
