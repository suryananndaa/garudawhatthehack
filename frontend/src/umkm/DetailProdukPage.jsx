import { useState, useEffect } from 'react'
import { useParams, useNavigate, NavLink } from 'react-router-dom'
import './DetailProdukPage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function StarIcon() {
  return (
    <svg className="star" viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
      <path d="M12 2.5l2.9 6.1 6.6.7-4.9 4.6 1.3 6.6L12 17l-5.9 3.5 1.3-6.6L2.5 9.3l6.6-.7Z" />
    </svg>
  )
}

export default function DetailProdukPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/product/${id}`)
      const result = await res.json()
      setData(result)
    } catch (err) {
      console.error('Error fetching product:', err)
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="umkm-app">
        <aside className="umkm-sidebar">
          <div className="brand">
            <span className="brand__mark">🌿</span>
            <span className="brand__name">Tani<span className="brand__accent">ku</span></span>
          </div>
        </aside>
        <main className="main">
          <div className="detail-loading">Memuat detail produk...</div>
        </main>
      </div>
    )
  }

  if (!data || !data.product) {
    return (
      <div className="umkm-app">
        <aside className="umkm-sidebar">
          <div className="brand">
            <span className="brand__mark">🌿</span>
            <span className="brand__name">Tani<span className="brand__accent">ku</span></span>
          </div>
        </aside>
        <main className="main">
          <div className="detail-error">Produk tidak ditemukan</div>
        </main>
      </div>
    )
  }

  const { product } = data
  const { supplier } = product

  const tierColors = {
    Fresh: { bg: '#e4f1e7', text: '#2d5940', label: 'Segar' },
    Standard: { bg: '#fbf1dd', text: '#c49a3c', label: 'Standard' },
    Rescue: { bg: '#fdecea', text: '#c0392b', label: 'Rescue' },
  }
  const tier = tierColors[product.predictedTier] || tierColors.Standard

  const storageLabels = {
    suhu_ruang: 'Suhu Ruang',
    kulkas: 'Kulkas',
    vakum: 'Vakum',
  }

  const harvestDate = new Date(product.harvestDate)
  const daysSinceHarvest = Math.floor((new Date() - harvestDate) / (1000 * 60 * 60 * 24))

  return (
    <div className="umkm-app">
      {/* SIDEBAR */}
      <aside className="umkm-sidebar">
        <div className="brand">
          <span className="brand__mark">🌿</span>
          <span className="brand__name">Tani<span className="brand__accent">ku</span></span>
        </div>

        <nav className="nav" aria-label="Navigasi utama">
          <NavLink to="/pembeli/dashboard" end className={({ isActive }) => `nav__item${isActive ? ' nav__item--active' : ''}`}>
            <svg className="nav__icon" viewBox="0 0 24 24" fill="none">
              <path d="M4 11.5 12 4l8 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 20v-5h4v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Beranda</span>
          </NavLink>
          <NavLink to="/pembeli/pesanan" className={({ isActive }) => `nav__item${isActive ? ' nav__item--active' : ''}`}>
            <svg className="nav__icon" viewBox="0 0 24 24" fill="none">
              <path d="M7 3h8l3 3v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M9 9h6M9 13h6M9 17h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <span>Pesanan Saya</span>
          </NavLink>
          <NavLink to="/pembeli/favorit" className={({ isActive }) => `nav__item${isActive ? ' nav__item--active' : ''}`}>
            <svg className="nav__icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 20.5s-7.5-4.6-9.6-9A5.2 5.2 0 0 1 12 6.4 5.2 5.2 0 0 1 21.6 11.5c-2.1 4.4-9.6 9-9.6 9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
            </svg>
            <span>Favorit</span>
          </NavLink>
          <NavLink to="/pembeli/pengaturan" className={({ isActive }) => `nav__item${isActive ? ' nav__item--active' : ''}`}>
            <svg className="nav__icon" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M12 2.6v2.2M12 19.2v2.2M4.5 4.5l1.5 1.5M18 18l1.5 1.5M2.6 12h2.2M19.2 12h2.2M4.5 19.5 6 18M18 6l1.5-1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <span>Pengaturan</span>
          </NavLink>
        </nav>

        <div className="sidebar__bottom">
          <button className="help-pill" type="button" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <span>Keluar<br /><small>dari akun Taniku</small></span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        <button className="detail-back-btn" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Kembali
        </button>

        <div className="detail-container">
          {/* LEFT: Product Image & Gallery */}
          <div className="detail-left">
            <div className="detail-image-main">
              {product.iconUrl ? (
                <img src={product.iconUrl} alt={product.name} />
              ) : (
                <div className="detail-image-placeholder">
                  <span>🍎</span>
                </div>
              )}
              <span className="detail-tier-badge" style={{ background: tier.bg, color: tier.text }}>
                {tier.label}
              </span>
            </div>

            {/* Supplier info card */}
            <div className="detail-supplier-card">
              <h3>Dijual oleh</h3>
              <div className="detail-supplier-info" onClick={() => navigate(`/pembeli/toko/${supplier.id}`)}>
                <div className="detail-supplier-avatar">
                  {supplier.logoUrl ? (
                    <img src={supplier.logoUrl} alt={supplier.shopName} />
                  ) : (
                    <span>🏪</span>
                  )}
                </div>
                <div className="detail-supplier-text">
                  <p className="detail-supplier-name">{supplier.shopName}</p>
                  <p className="detail-supplier-loc">
                    <StarIcon /> {supplier.rating.toFixed(1)} · {supplier.city || 'Lokasi tidak diketahui'}
                  </p>
                </div>
                <button type="button" className="detail-supplier-btn">
                  <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Details */}
          <div className="detail-right">
            <div className="detail-header">
              <h1>{product.name}</h1>
              <p className="detail-price">Rp {product.pricePerKg.toLocaleString('id-ID')} / kg</p>
            </div>

            <div className="detail-info-grid">
              <div className="detail-info-item">
                <span className="detail-info-label">Stok Tersedia</span>
                <span className="detail-info-value">{product.quantityKg} kg</span>
              </div>
              <div className="detail-info-item">
                <span className="detail-info-label">Tingkat Kesegaran</span>
                <span className="detail-info-value" style={{ color: tier.text }}>{tier.label}</span>
              </div>
              <div className="detail-info-item">
                <span className="detail-info-label">Metode Penyimpanan</span>
                <span className="detail-info-value">{storageLabels[product.storageMethod] || product.storageMethod}</span>
              </div>
              <div className="detail-info-item">
                <span className="detail-info-label">Tanggal Panen</span>
                <span className="detail-info-value">{harvestDate.toLocaleDateString('id-ID')} ({daysSinceHarvest} hari lalu)</span>
              </div>
              <div className="detail-info-item">
                <span className="detail-info-label">Kondisi Higienis</span>
                <span className="detail-info-value">{product.hygienic ? '✓ Ya' : '✗ Tidak'}</span>
              </div>
            </div>

            {/* Quantity selector & Add to cart */}
            <div className="detail-order-section">
              <div className="detail-qty-selector">
                <label>Jumlah (kg)</label>
                <div className="detail-qty-controls">
                  <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                  <input
                    type="number"
                    min="1"
                    max={product.quantityKg}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.quantityKg, parseInt(e.target.value) || 1)))}
                  />
                  <button type="button" onClick={() => setQuantity(Math.min(product.quantityKg, quantity + 1))}>+</button>
                </div>
              </div>

              <div className="detail-total">
                <span>Total Harga</span>
                <strong>Rp {(product.pricePerKg * quantity).toLocaleString('id-ID')}</strong>
              </div>

              <button className="detail-order-btn" type="button">
                <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                  <path d="M4 6h2l1.6 10.2A2 2 0 0 0 9.6 18H18a2 2 0 0 0 2-1.6L21.5 9H6.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="10" cy="21" r="1.3" fill="currentColor"/>
                  <circle cx="18" cy="21" r="1.3" fill="currentColor"/>
                </svg>
                Tambah ke Keranjang
              </button>
            </div>

            {/* Description */}
            {supplier.description && (
              <div className="detail-description">
                <h3>Deskripsi</h3>
                <p>{supplier.description}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
