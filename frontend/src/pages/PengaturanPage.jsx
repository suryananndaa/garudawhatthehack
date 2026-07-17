import { useState, useEffect } from 'react'
import { Store, ShieldCheck, Bell, Clock3 } from 'lucide-react'
import PageIntro from '../components/layout/PageIntro.jsx'
import SettingsNav from '../components/settings/SettingsNav.jsx'
import SettingsCard from '../components/settings/SettingsCard.jsx'
import ToggleSwitch from '../components/settings/ToggleSwitch.jsx'
import DayPicker from '../components/settings/DayPicker.jsx'
import CheckOption from '../components/settings/CheckOption.jsx'
import FormGroup from '../components/form/FormGroup.jsx'
import TextInput from '../components/form/TextInput.jsx'
import TextArea from '../components/form/TextArea.jsx'
import FileDropzone from '../components/form/FileDropzone.jsx'
import LocationPicker from '../components/form/LocationPicker.jsx'
import FormActions from '../components/form/FormActions.jsx'
import './PengaturanPage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token')
}

function imageUrl(path) {
  if (!path) return null
  if (path.startsWith('http') || path.startsWith('data:')) return path
  return `${API_URL}${path}`
}

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const NAV_ITEMS = [
  { key: 'profil', label: 'Profil Toko', icon: Store },
  { key: 'akun', label: 'Akun & Keamanan', icon: ShieldCheck },
  { key: 'notifikasi', label: 'Notifikasi', icon: Bell },
  { key: 'operasional', label: 'Operasional', icon: Clock3 },
]

const KATEGORI_OPTIONS = [
  { key: 'buah', label: 'Buah-buahan' },
  { key: 'sayur', label: 'Sayuran' },
  { key: 'rempah', label: 'Rempah & Bumbu' },
  { key: 'lainnya', label: 'Lainnya' },
]


const SHIPPING_METHODS = [
  { key: 'ekspedisi', label: 'Ekspedisi (JNE, J&T, SiCepat)', description: 'Pengiriman antar kota / pulau' },
  { key: 'kurirToko', label: 'Kurir Toko Sendiri', description: 'Untuk area dekat lokasi toko' },
  { key: 'ambilSendiri', label: 'Ambil di Tempat', description: 'Pembeli mengambil langsung ke lokasi' },
]


const CURRENT_YEAR = new Date().getFullYear()

export default function PengaturanPage() {
  const [activeTab, setActiveTab] = useState('profil')
  const [saveStatus, setSaveStatus] = useState('')
  const [loadingProfile, setLoadingProfile] = useState(true)

  const [profil, setProfil] = useState({
    namaToko: '',
    alamat: '',
    lokasi: '',
    deskripsi: '',
    radiusPengiriman: '',
    kategori: [],
    legalitas: '',
    mulaiJualan: '',
  })
  const [lokasiCoords, setLokasiCoords] = useState(null)

  const [akun, setAkun] = useState({
    namaPemilik: '',
    email: '',
    telepon: '',
    kontakAlternatif: '',
    passwordSaatIni: '',
    passwordBaru: '',
    konfirmasiPassword: '',
  })

  const [logo, setLogo] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [fotoLadang, setFotoLadang] = useState(null)
  const [fotoLadangPreview, setFotoLadangPreview] = useState(null)
  const [galeriBaru, setGaleriBaru] = useState([])
  const [galeriExisting, setGaleriExisting] = useState([])

  const [notifikasi, setNotifikasi] = useState({
    pesananBaru: true,
    stokMenipis: true,
    promo: false,
    ringkasanMingguan: true,
    pengingatPengiriman: true,
  })

  const [operasional, setOperasional] = useState({
    jamBuka: '08:00',
    jamTutup: '17:00',
    hariAktif: ['sen', 'sel', 'rab', 'kam', 'jum'],
    metodePengiriman: ['ekspedisi', 'kurirToko'],
    kapasitasProduksi: '',
  })

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        })
        if (!res.ok) return
        const { user } = await res.json()

        setProfil({
          namaToko: user.shopName ?? '',
          alamat: user.address ?? '',
          lokasi: user.city ?? '',
          deskripsi: user.description ?? '',
          radiusPengiriman: user.deliveryRadiusKm ?? '',
          kategori: Array.isArray(user.categories) ? user.categories : [],
          legalitas: user.legalInfo ?? '',
          mulaiJualan: user.sellingSince ?? '',
        })

        if (user.latitude && user.longitude) {
          setLokasiCoords({ lat: user.latitude, lon: user.longitude })
        }

        setAkun({
          namaPemilik: user.name ?? '',
          email: user.email ?? '',
          telepon: user.phone ?? '',
          kontakAlternatif: user.altContact ?? '',
          passwordSaatIni: '',
          passwordBaru: '',
          konfirmasiPassword: '',
        })

        if (user.logoUrl) setLogoPreview(imageUrl(user.logoUrl))
        if (user.fieldPhotoUrl) setFotoLadangPreview(imageUrl(user.fieldPhotoUrl))
        if (Array.isArray(user.galleryPhotos)) {
          setGaleriExisting(user.galleryPhotos.map(p => imageUrl(p)))
        }

        const oh = user.operatingHours ?? {}
        setOperasional({
          jamBuka: oh.jamBuka ?? '08:00',
          jamTutup: oh.jamTutup ?? '17:00',
          hariAktif: oh.hariAktif ?? ['sen', 'sel', 'rab', 'kam', 'jum'],
          metodePengiriman: Array.isArray(user.shippingMethods) ? user.shippingMethods : ['ekspedisi'],
          kapasitasProduksi: user.productionCapacity ?? '',
        })
      } catch { /* ignore */ }
      finally { setLoadingProfile(false) }
    }
    loadProfile()
  }, [])

  const toggleKategori = (key, checked) => {
    setProfil(prev => ({
      ...prev,
      kategori: checked ? [...prev.kategori, key] : prev.kategori.filter(k => k !== key),
    }))
  }

  const toggleDay = (day) => {
    setOperasional(prev => ({
      ...prev,
      hariAktif: prev.hariAktif.includes(day)
        ? prev.hariAktif.filter(d => d !== day)
        : [...prev.hariAktif, day],
    }))
  }

  const toggleShipping = (key, checked) => {
    setOperasional(prev => ({
      ...prev,
      metodePengiriman: checked
        ? [...prev.metodePengiriman, key]
        : prev.metodePengiriman.filter(m => m !== key),
    }))
  }

  const handleLogoSelect = async (file) => {
    setLogo(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  const handleFotoLadangSelect = async (file) => {
    setFotoLadang(file)
    setFotoLadangPreview(URL.createObjectURL(file))
  }

  const handleGaleriSelect = async (files) => {
    const list = Array.from(files)
    setGaleriBaru(prev => [...prev, ...list])
  }

  const handleReset = () => window.location.reload()

  const handleSave = async () => {
    setSaveStatus('saving')
    try {
      const body = {}

      if (activeTab === 'profil') {
        body.shopName = profil.namaToko
        body.address = profil.alamat
        body.city = profil.lokasi
        body.description = profil.deskripsi
        body.deliveryRadiusKm = profil.radiusPengiriman
        body.categories = profil.kategori
        body.legalInfo = profil.legalitas
        body.sellingSince = profil.mulaiJualan
        if (lokasiCoords) {
          body.latitude = lokasiCoords.lat
          body.longitude = lokasiCoords.lon
        }
        if (logo) body.logoBase64 = await fileToBase64(logo)
        if (fotoLadang) body.fieldPhotoBase64 = await fileToBase64(fotoLadang)
        if (galeriBaru.length > 0) {
          body.galleryBase64 = await Promise.all(galeriBaru.map(fileToBase64))
        }
      }

      if (activeTab === 'akun') {
        body.name = akun.namaPemilik
        body.phone = akun.telepon
        body.altContact = akun.kontakAlternatif
        if (akun.passwordBaru) {
          if (akun.passwordBaru !== akun.konfirmasiPassword) {
            setSaveStatus('error')
            alert('Password baru dan konfirmasi tidak cocok')
            return
          }
          body.passwordSaatIni = akun.passwordSaatIni
          body.passwordBaru = akun.passwordBaru
        }
      }

      if (activeTab === 'operasional') {
        body.shippingMethods = operasional.metodePengiriman
        body.productionCapacity = operasional.kapasitasProduksi
        body.operatingHours = {
          jamBuka: operasional.jamBuka,
          jamTutup: operasional.jamTutup,
          hariAktif: operasional.hariAktif,
        }
      }

      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        setSaveStatus('error')
        alert(data.message || 'Gagal menyimpan perubahan')
        return
      }

      const storage = localStorage.getItem('token') ? localStorage : sessionStorage
      storage.setItem('user', JSON.stringify(data.user))

      if (galeriBaru.length > 0 && Array.isArray(data.user.galleryPhotos)) {
        setGaleriExisting(data.user.galleryPhotos.map(p => imageUrl(p)))
        setGaleriBaru([])
      }

      setSaveStatus('success')
      setTimeout(() => setSaveStatus(''), 3000)
    } catch {
      setSaveStatus('error')
      alert('Tidak dapat terhubung ke server')
    }
  }

  if (loadingProfile) {
    return (
      <div className="pengaturan">
        <PageIntro title="Pengaturan" subtitle="Memuat profil toko..." />
      </div>
    )
  }

  return (
    <div className="pengaturan">
      <PageIntro title="Pengaturan" subtitle="Kelola profil toko, akun, notifikasi, dan preferensi lainnya." />

      <div className="pengaturan__body">
        <SettingsNav items={NAV_ITEMS} activeKey={activeTab} onChange={setActiveTab} />

        <div className="pengaturan__content">
          {activeTab === 'profil' && (
            <SettingsCard
              title="Profil Toko"
              subtitle="Informasi ini akan ditampilkan ke pembeli di halaman toko kamu."
            >
              <div className="pengaturan__grid">
                <div className="pengaturan__col">
                  <FormGroup label="Nama toko" htmlFor="namaToko">
                    <TextInput
                      id="namaToko"
                      placeholder="Contoh: Kebun Matoa Papua"
                      value={profil.namaToko}
                      onChange={(e) => setProfil(p => ({ ...p, namaToko: e.target.value }))}
                    />
                  </FormGroup>

                  <FormGroup label="Alamat lengkap" htmlFor="alamatToko">
                    <TextInput
                      id="alamatToko"
                      placeholder="Jl. Kebun Raya No. 5, Bogor"
                      value={profil.alamat}
                      onChange={(e) => setProfil(p => ({ ...p, alamat: e.target.value }))}
                    />
                  </FormGroup>

                  <FormGroup label="Lokasi toko (kota/desa)" htmlFor="lokasiToko">
                    <LocationPicker
                      value={profil.lokasi}
                      onChange={(val) => setProfil(p => ({ ...p, lokasi: val }))}
                      onCoordsChange={setLokasiCoords}
                      initialCoords={lokasiCoords}
                    />
                  </FormGroup>

                  <FormGroup label="Radius jangkauan pengiriman (km)" htmlFor="radiusPengiriman">
                    <TextInput
                      id="radiusPengiriman"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="Contoh: 25"
                      value={profil.radiusPengiriman}
                      onChange={(e) => setProfil(p => ({ ...p, radiusPengiriman: e.target.value }))}
                    />
                  </FormGroup>
                </div>

                <div className="pengaturan__col">
                  <FormGroup label="Logo toko">
                    {logoPreview && (
                      <img src={logoPreview} alt="Logo toko" className="pengaturan__img-preview" />
                    )}
                    <FileDropzone onFileSelect={handleLogoSelect} />
                  </FormGroup>

                  <FormGroup label="Foto ladang / kebun">
                    {fotoLadangPreview && (
                      <img src={fotoLadangPreview} alt="Foto ladang" className="pengaturan__img-preview" />
                    )}
                    <FileDropzone onFileSelect={handleFotoLadangSelect} />
                  </FormGroup>
                </div>
              </div>

              <FormGroup label="Deskripsi toko" htmlFor="deskripsiToko">
                <TextArea
                  id="deskripsiToko"
                  placeholder="Ceritakan sedikit tentang toko kamu"
                  value={profil.deskripsi}
                  onChange={(e) => setProfil(p => ({ ...p, deskripsi: e.target.value }))}
                />
              </FormGroup>

              <hr className="pengaturan__divider" />
              <h4 className="pengaturan__subheading">Kepercayaan UMKM</h4>

              <div className="pengaturan__grid">
                <FormGroup label="Kategori / spesialisasi produk">
                  <div className="pengaturan__checklist">
                    {KATEGORI_OPTIONS.map(({ key, label }) => (
                      <CheckOption
                        key={key}
                        id={`kat-${key}`}
                        label={label}
                        checked={profil.kategori.includes(key)}
                        onChange={(checked) => toggleKategori(key, checked)}
                      />
                    ))}
                  </div>
                </FormGroup>

                <div className="pengaturan__col">
                  <FormGroup label="Sejak kapan mulai jualan" htmlFor="mulaiJualan">
                    <TextInput
                      id="mulaiJualan"
                      type="number"
                      min="1980"
                      max={CURRENT_YEAR}
                      placeholder={`Contoh: ${CURRENT_YEAR - 5}`}
                      value={profil.mulaiJualan}
                      onChange={(e) => setProfil(p => ({ ...p, mulaiJualan: e.target.value }))}
                    />
                  </FormGroup>

                  <FormGroup label="Legalitas usaha (opsional)" htmlFor="legalitas">
                    <TextInput
                      id="legalitas"
                      placeholder="NIB, SIUP, atau nomor legal lainnya"
                      value={profil.legalitas}
                      onChange={(e) => setProfil(p => ({ ...p, legalitas: e.target.value }))}
                    />
                  </FormGroup>
                </div>
              </div>

              <FormGroup label="Galeri foto (tambahan)">
                {galeriExisting.length > 0 && (
                  <div className="pengaturan__gallery">
                    {galeriExisting.map((src, i) => (
                      <img key={i} src={src} alt={`Galeri ${i + 1}`} className="pengaturan__gallery-item" />
                    ))}
                  </div>
                )}
                {galeriBaru.length > 0 && (
                  <div className="pengaturan__gallery">
                    {galeriBaru.map((file, i) => (
                      <img key={i} src={URL.createObjectURL(file)} alt={`Baru ${i + 1}`} className="pengaturan__gallery-item" />
                    ))}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="pengaturan__gallery-input"
                  onChange={(e) => handleGaleriSelect(e.target.files)}
                />
                <p className="pengaturan__note">Upload foto tambahan kebun, produk, atau proses panen.</p>
              </FormGroup>
            </SettingsCard>
          )}

          {activeTab === 'akun' && (
            <SettingsCard title="Akun & Keamanan" subtitle="Kelola informasi akun dan kredensial login kamu.">
              <div className="pengaturan__grid">
                <FormGroup label="Nama pemilik" htmlFor="namaPemilik">
                  <TextInput
                    id="namaPemilik"
                    placeholder="Nama lengkap"
                    value={akun.namaPemilik}
                    onChange={(e) => setAkun(a => ({ ...a, namaPemilik: e.target.value }))}
                  />
                </FormGroup>

                <FormGroup label="Email" htmlFor="email">
                  <TextInput
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={akun.email}
                    disabled
                  />
                </FormGroup>
              </div>

              <div className="pengaturan__grid">
                <FormGroup label="Nomor telepon" htmlFor="telepon">
                  <TextInput
                    id="telepon"
                    placeholder="Contoh: 0812xxxxxxx"
                    value={akun.telepon}
                    onChange={(e) => setAkun(a => ({ ...a, telepon: e.target.value }))}
                  />
                </FormGroup>

                <FormGroup label="Kontak alternatif (WhatsApp Business, dll)" htmlFor="kontakAlternatif">
                  <TextInput
                    id="kontakAlternatif"
                    placeholder="Contoh: 0813-xxxx-xxxx"
                    value={akun.kontakAlternatif}
                    onChange={(e) => setAkun(a => ({ ...a, kontakAlternatif: e.target.value }))}
                  />
                </FormGroup>
              </div>

              <hr className="pengaturan__divider" />
              <h4 className="pengaturan__subheading">Ganti Password</h4>

              <FormGroup label="Password saat ini" htmlFor="passwordSaatIni">
                <TextInput
                  id="passwordSaatIni"
                  type="password"
                  placeholder="••••••••"
                  value={akun.passwordSaatIni}
                  onChange={(e) => setAkun(a => ({ ...a, passwordSaatIni: e.target.value }))}
                />
              </FormGroup>

              <div className="pengaturan__grid">
                <FormGroup label="Password baru" htmlFor="passwordBaru">
                  <TextInput
                    id="passwordBaru"
                    type="password"
                    placeholder="••••••••"
                    value={akun.passwordBaru}
                    onChange={(e) => setAkun(a => ({ ...a, passwordBaru: e.target.value }))}
                  />
                </FormGroup>

                <FormGroup label="Konfirmasi password baru" htmlFor="konfirmasiPassword">
                  <TextInput
                    id="konfirmasiPassword"
                    type="password"
                    placeholder="••••••••"
                    value={akun.konfirmasiPassword}
                    onChange={(e) => setAkun(a => ({ ...a, konfirmasiPassword: e.target.value }))}
                  />
                </FormGroup>
              </div>
            </SettingsCard>
          )}

          {activeTab === 'notifikasi' && (
            <SettingsCard title="Preferensi Notifikasi" subtitle="Atur notifikasi apa saja yang ingin kamu terima.">
              <ToggleSwitch
                id="notifPesanan"
                label="Pesanan Baru"
                description="Dapatkan notifikasi setiap ada pesanan masuk."
                checked={notifikasi.pesananBaru}
                onChange={(v) => setNotifikasi(n => ({ ...n, pesananBaru: v }))}
              />
              <ToggleSwitch
                id="notifStok"
                label="Stok Menipis"
                description="Diingatkan saat stok produk hampir habis."
                checked={notifikasi.stokMenipis}
                onChange={(v) => setNotifikasi(n => ({ ...n, stokMenipis: v }))}
              />
              <ToggleSwitch
                id="notifPromo"
                label="Promo & Update Aplikasi"
                description="Info fitur baru dan penawaran dari Taniku."
                checked={notifikasi.promo}
                onChange={(v) => setNotifikasi(n => ({ ...n, promo: v }))}
              />
              <ToggleSwitch
                id="notifRingkasan"
                label="Ringkasan Mingguan via Email"
                description="Rekap penjualan dan performa toko tiap minggu."
                checked={notifikasi.ringkasanMingguan}
                onChange={(v) => setNotifikasi(n => ({ ...n, ringkasanMingguan: v }))}
              />
              <ToggleSwitch
                id="notifPengiriman"
                label="Pengingat Pengiriman"
                description="Pengingat saat pesanan harus segera dikirim."
                checked={notifikasi.pengingatPengiriman}
                onChange={(v) => setNotifikasi(n => ({ ...n, pengingatPengiriman: v }))}
              />
            </SettingsCard>
          )}

          {activeTab === 'operasional' && (
            <SettingsCard title="Jam Operasional & Pengiriman" subtitle="Atur jadwal toko buka dan metode pengiriman.">
              <div className="pengaturan__grid">
                <FormGroup label="Jam buka" htmlFor="jamBuka">
                  <TextInput
                    id="jamBuka"
                    type="time"
                    value={operasional.jamBuka}
                    onChange={(e) => setOperasional(o => ({ ...o, jamBuka: e.target.value }))}
                  />
                </FormGroup>

                <FormGroup label="Jam tutup" htmlFor="jamTutup">
                  <TextInput
                    id="jamTutup"
                    type="time"
                    value={operasional.jamTutup}
                    onChange={(e) => setOperasional(o => ({ ...o, jamTutup: e.target.value }))}
                  />
                </FormGroup>
              </div>

              <FormGroup label="Hari operasional">
                <DayPicker selectedDays={operasional.hariAktif} onToggleDay={toggleDay} />
              </FormGroup>

              <FormGroup label="Kapasitas produksi rutin" htmlFor="kapasitasProduksi">
                <TextInput
                  id="kapasitasProduksi"
                  placeholder="Contoh: 200 kg/minggu"
                  value={operasional.kapasitasProduksi}
                  onChange={(e) => setOperasional(o => ({ ...o, kapasitasProduksi: e.target.value }))}
                />
              </FormGroup>

              <hr className="pengaturan__divider" />

              <FormGroup label="Metode pengiriman yang tersedia">
                <div className="pengaturan__checklist">
                  {SHIPPING_METHODS.map(({ key, label, description }) => (
                    <CheckOption
                      key={key}
                      id={`ship-${key}`}
                      label={label}
                      description={description}
                      checked={operasional.metodePengiriman.includes(key)}
                      onChange={(checked) => toggleShipping(key, checked)}
                    />
                  ))}
                </div>
              </FormGroup>
            </SettingsCard>
          )}

          <FormActions
            cancelLabel="Batalkan Perubahan"
            submitLabel={saveStatus === 'saving' ? 'Menyimpan...' : saveStatus === 'success' ? '✓ Tersimpan' : 'Simpan Perubahan'}
            onCancel={handleReset}
            onSubmit={handleSave}
          />
        </div>
      </div>
    </div>
  )
}
