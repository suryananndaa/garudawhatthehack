import { useState, useEffect } from 'react'
import { useParams, useNavigate, NavLink } from 'react-router-dom'
import './ProfileTokoPage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function StarIcon() {
  return (
    <svg className="star" viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
      <path d="M12 2.5l2.9 6.1 6.6.7-4.9 4.6 1.3 6.6L12 17l-5.9 3.5 1.3-6.6L2.5 9.3l6.6-.7Z" />
    </svg>
  )
}

function ProductCard({ product, onClick, showDiscount }) {
  const tierColors = {
    Fresh: { bg: '#e4f1e7', text: '#2d5940', label: 'Segar' },
    Standard: { bg: '#fbf1dd', text: '#c49a3c', label: 'Standard' },
    Rescue: { bg: '#fdecea', text: '#c0392b', label: 'Rescue' },
  }
  const tier = tierColors[product.predictedTier] || tierColors.Standard
  const isRescue = product.predictedTier === 'Rescue'

  return (
    <button className="toko-product-card" type="button" onClick={onClick}>
      <div className="toko-product-card__img">
        {isRescue && showDiscount && (
          <span className="toko-discount-badge">💥 Diskon 30%</span>
        )}
      </div>
      <div className="toko-product-card__body">
        <p className="toko-product-card__name">{product.name}</p>
        <div className="toko-product-card__rating">
          <StarIcon /> <span>4.8</span>
        </div>
        <div className="toko-product-card__price-row">
          <p className="toko-product-card__price">
            Rp {product.pricePerKg.toLocaleString('id-ID')}/kg
          </p>
          {isRescue && showDiscount && (
            <span className="toko-original-price">Rp {Math.round(product.pricePerKg * 1.3).toLocaleString('id-ID')}</span>
          )}
        </div>
        <div className="toko-product-card__footer">
          <span className="toko-tier-badge" style={{ background: tier.bg, color: tier.text }}>
            {tier.label}
          </span>
          <span className="toko-stock">{product.quantityKg} kg</span>
        </div>
      </div>
    </button>
  )
}

export default function ProfileTokoPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSupplier()
  }, [id])

  const fetchSupplier = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/supplier/${id}`)
      const result = await res.json()
      setData(result)
    } catch (err) {
      console.error('Error fetching supplier:', err)
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
          <div className="profile-loading">Memuat profil toko...</div>
        </main>
      </div>
    )
  }

  if (!data || !data.supplier) {
    return (
      <div className="umkm-app">
        <aside className="umkm-sidebar">
          <div className="brand">
            <span className="brand__mark">🌿</span>
            <span className="brand__name">Tani<span className="brand__accent">ku</span></span>
          </div>
        </aside>
        <main className="main">
          <div className="profile-error">Toko tidak ditemukan</div>
        </main>
      </div>
    )
  }

  const { supplier, products, stats } = data
  const categories = Array.isArray(supplier.categories) ? supplier.categories : []
  const shippingMethods = Array.isArray(supplier.shippingMethods) ? supplier.shippingMethods : []

  // Sort products untuk sections
  const topProducts = [...products].sort((a, b) => b.quantityKg - a.quantityKg).slice(0, 4)
  const recommendedProducts = [...products].filter(p => p.predictedTier === 'Fresh').slice(0, 4)
  const otherProducts = products

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
        <button className="profile-back-btn" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Kembali
        </button>

        {/* Profile header - cover + avatar */}
        <div className="toko-header">
          <div className="toko-cover">
            {supplier.fieldPhotoUrl ? (
              <img src={supplier.fieldPhotoUrl} alt="Cover" />
            ) : (
              <div className="toko-cover-placeholder" />
            )}
          </div>

          <div className="toko-profile-bar">
            <div className="toko-avatar">
              {supplier.logoUrl ? (
                <img src={supplier.logoUrl} alt={supplier.shopName} />
              ) : (
                <span className="toko-avatar-placeholder">🏪</span>
              )}
            </div>
            <div className="toko-profile-info">
              <h1>{supplier.shopName}</h1>
              <p className="toko-meta">
                <span className="toko-rating-badge"><StarIcon /> {supplier.rating.toFixed(1)}</span>
                <span>·</span>
                <span>{stats.totalProducts} produk</span>
                {supplier.city && (
                  <>
                    <span>·</span>
                    <span>{supplier.city}</span>
                  </>
                )}
              </p>
            </div>
            <button className="toko-contact-btn" type="button">
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Hubungi
            </button>
          </div>
        </div>

        {/* Content: Sidebar (Tentang) + Main (Produk sections) */}
        <div className="toko-content">
          {/* LEFT: Tentang sidebar */}
          <div className="toko-sidebar">
            <div className="toko-about-card">
              <h3>Tentang</h3>
              
              {supplier.description && (
                <p className="toko-about-desc">{supplier.description}</p>
              )}

              {categories.length > 0 && (
                <div className="toko-about-item">
                  <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                    <path d="M20 7h-9M20 12h-9M20 17h-9M5 7h.01M5 12h.01M5 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <div>
                    <strong>Kategori</strong>
                    <div className="toko-tags">
                      {categories.map((cat, i) => (
                        <span key={i} className="toko-tag">{cat}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {supplier.city && (
                <div className="toko-about-item">
                  <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="1.8"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.8"/>
                  </svg>
                  <div>
                    <strong>Lokasi</strong>
                    <span>{supplier.city}</span>
                  </div>
                </div>
              )}

              {supplier.phone && (
                <div className="toko-about-item">
                  <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <strong>Telepon</strong>
                    <span>{supplier.phone}</span>
                  </div>
                </div>
              )}

              {supplier.sellingSince && (
                <div className="toko-about-item">
                  <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M3 10h18M9 4v4M15 4v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                  <div>
                    <strong>Berjualan sejak</strong>
                    <span>{supplier.sellingSince}</span>
                  </div>
                </div>
              )}

              {shippingMethods.length > 0 && (
                <div className="toko-about-item">
                  <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                    <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <strong>Pengiriman</strong>
                    <div className="toko-tags">
                      {shippingMethods.map((m, i) => (
                        <span key={i} className="toko-tag">{m}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Produk sections */}
          <div className="toko-main">
            {/* Section 1: Buah Terlaku */}
            {topProducts.length > 0 && (
              <section className="toko-section">
                <div className="toko-section-header">
                  <h2>🔥 Buah Terlaku</h2>
                  <p>Produk paling diminati dari toko ini</p>
                </div>
                <div className="toko-products-grid">
                  {topProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onClick={() => navigate(`/pembeli/produk/${p.id}`)}
                      showDiscount={true}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Section 2: Rekomendasi AI */}
            {recommendedProducts.length > 0 && (
              <section className="toko-section">
                <div className="toko-section-header">
                  <h2>✨ Rekomendasi AI</h2>
                  <p>Produk yang cocok dengan pencarian Anda</p>
                </div>
                <div className="toko-products-grid">
                  {recommendedProducts.map((p) => (
                    <ProductCard
                      key={`rec-${p.id}`}
                      product={p}
                      onClick={() => navigate(`/pembeli/produk/${p.id}`)}
                      showDiscount={true}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Section 3: Semua Produk */}
            <section className="toko-section">
              <div className="toko-section-header">
                <h2>🍎 Semua Produk</h2>
                <p>{otherProducts.length} produk tersedia</p>
              </div>
              {otherProducts.length === 0 ? (
                <div className="toko-empty">Belum ada produk</div>
              ) : (
                <div className="toko-products-grid">
                  {otherProducts.map((p) => (
                    <ProductCard
                      key={`all-${p.id}`}
                      product={p}
                      onClick={() => navigate(`/pembeli/produk/${p.id}`)}
                      showDiscount={true}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
