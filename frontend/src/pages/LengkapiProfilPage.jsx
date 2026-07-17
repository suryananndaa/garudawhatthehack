import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LocationPicker from '../components/form/LocationPicker.jsx'
import './LengkapiProfilPage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const KATEGORI_OPTIONS = [
  { key: 'buah', label: 'Buah-buahan' },
  { key: 'sayur', label: 'Sayuran' },
  { key: 'rempah', label: 'Rempah & Bumbu' },
  { key: 'lainnya', label: 'Lainnya' },
]

function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token')
}

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function LengkapiProfilPage() {
  const navigate = useNavigate()
  const [phone, setPhone]             = useState('')
  const [address, setAddress]         = useState('')
  const [deskripsi, setDeskripsi]     = useState('')
  const [shopName, setShopName]       = useState('')
  const [city, setCity]               = useState('')
  const [coords, setCoords]           = useState(null)
  const [radius, setRadius]           = useState('')
  const [kategori, setKategori]       = useState([])
  const [mulaiJualan, setMulaiJualan] = useState('')
  const [foto, setFoto]               = useState(null)
  const [preview, setPreview]         = useState(null)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')

  const handleFoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setFoto(file)
    setPreview(URL.createObjectURL(file))
  }

  const toggleKategori = (key) => {
    setKategori(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!phone.trim()) {
      setError('Nomor HP wajib diisi agar pembeli bisa menghubungi kamu.')
      return
    }
    if (!foto) {
      setError('Foto ladang / kebun wajib diupload sebagai bukti keberadaan toko.')
      return
    }

    setLoading(true)
    try {
      const body = {
        phone,
        address,
        description: deskripsi,
        shopName,
        city,
        categories: kategori,
        deliveryRadiusKm: radius || undefined,
        sellingSince: mulaiJualan || undefined,
        fieldPhotoBase64: await fileToBase64(foto),
      }
      if (coords) {
        body.latitude = coords.lat
        body.longitude = coords.lon
      }

      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Gagal menyimpan profil.')
        setLoading(false)
        return
      }

      const storage = localStorage.getItem('token') ? localStorage : sessionStorage
      storage.setItem('user', JSON.stringify(data.user))

      navigate('/petani/dashboard')
    } catch {
      setError('Tidak dapat terhubung ke server.')
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => navigate('/petani/dashboard')

  return (
    <div className="lengkapi-profil">
      <div className="lengkapi-profil__card">
        <div className="lengkapi-profil__header">
          <div className="lengkapi-profil__icon">🌱</div>
          <h2 className="lengkapi-profil__title">Lengkapi Profil Toko</h2>
          <p className="lengkapi-profil__sub">
            Profil lengkap membantu pembeli mengenal dan mempercayai toko kamu.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="lengkapi-profil__form">
          <div className="lengkapi-profil__field">
            <label className="lengkapi-profil__label">Nama Toko</label>
            <input
              type="text"
              placeholder="Contoh: Kebun Matoa Papua"
              value={shopName}
              onChange={e => setShopName(e.target.value)}
              className="lengkapi-profil__input"
            />
          </div>

          <div className="lengkapi-profil__field">
            <label className="lengkapi-profil__label">
              Nomor HP / WhatsApp <span className="lengkapi-profil__required">*</span>
            </label>
            <input
              type="tel"
              placeholder="Contoh: 0812-3456-7890"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="lengkapi-profil__input"
            />
            <p className="lengkapi-profil__hint">Akan ditampilkan ke pembeli untuk negosiasi langsung.</p>
          </div>

          <div className="lengkapi-profil__field">
            <label className="lengkapi-profil__label">Alamat Lengkap</label>
            <input
              type="text"
              placeholder="Contoh: Jl. Kebun Raya No. 5, Bogor"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="lengkapi-profil__input"
            />
          </div>

          <div className="lengkapi-profil__field">
            <label className="lengkapi-profil__label">Lokasi (kota/desa)</label>
            <LocationPicker
              value={city}
              onChange={setCity}
              onCoordsChange={setCoords}
              initialCoords={coords}
            />
          </div>

          <div className="lengkapi-profil__field">
            <label className="lengkapi-profil__label">Radius jangkauan pengiriman (km)</label>
            <input
              type="number"
              min="0"
              placeholder="Contoh: 25"
              value={radius}
              onChange={e => setRadius(e.target.value)}
              className="lengkapi-profil__input"
            />
          </div>

          <div className="lengkapi-profil__field">
            <label className="lengkapi-profil__label">Kategori produk</label>
            <div className="lengkapi-profil__kategori">
              {KATEGORI_OPTIONS.map(({ key, label }) => (
                <label key={key} className="lengkapi-profil__kategori-item">
                  <input
                    type="checkbox"
                    checked={kategori.includes(key)}
                    onChange={() => toggleKategori(key)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="lengkapi-profil__field">
            <label className="lengkapi-profil__label">Sejak kapan mulai jualan</label>
            <input
              type="number"
              min="1980"
              max={new Date().getFullYear()}
              placeholder={`Contoh: ${new Date().getFullYear() - 5}`}
              value={mulaiJualan}
              onChange={e => setMulaiJualan(e.target.value)}
              className="lengkapi-profil__input"
            />
          </div>

          <div className="lengkapi-profil__field">
            <label className="lengkapi-profil__label">Deskripsi Toko</label>
            <textarea
              placeholder="Ceritakan tentang toko kamu — jenis produk, cara tanam, dll."
              value={deskripsi}
              onChange={e => setDeskripsi(e.target.value)}
              className="lengkapi-profil__textarea"
              rows={3}
            />
          </div>

          <div className="lengkapi-profil__field">
            <label className="lengkapi-profil__label">
              Foto Ladang / Kebun <span className="lengkapi-profil__required">*</span>
            </label>
            <p className="lengkapi-profil__hint">
              Upload foto nyata kebun atau ladang kamu sebagai bukti keberadaan toko.
            </p>

            <label className="lengkapi-profil__upload-area">
              <input type="file" accept="image/*" onChange={handleFoto} style={{ display: 'none' }} />
              {preview ? (
                <img src={preview} alt="Preview ladang" className="lengkapi-profil__preview" />
              ) : (
                <div className="lengkapi-profil__upload-placeholder">
                  <span className="lengkapi-profil__upload-icon">📸</span>
                  <span className="lengkapi-profil__upload-text">Klik untuk upload foto</span>
                  <span className="lengkapi-profil__upload-sub">JPG, PNG — maks 5MB</span>
                </div>
              )}
            </label>

            {preview && (
              <button type="button" className="lengkapi-profil__change-foto"
                onClick={() => { setFoto(null); setPreview(null) }}>
                Ganti foto
              </button>
            )}
          </div>

          {error && <div className="lengkapi-profil__error">{error}</div>}

          <button type="submit" className="lengkapi-profil__btn-submit" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan & Masuk Dashboard →'}
          </button>
        </form>

        <button type="button" className="lengkapi-profil__btn-skip" onClick={handleSkip}>
          Nanti saja, lengkapi belakangan
        </button>
      </div>
    </div>
  )
}
