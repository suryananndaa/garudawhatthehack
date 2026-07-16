import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageIntro from '../components/layout/PageIntro.jsx'
import FormGroup from '../components/form/FormGroup.jsx'
import TextInput from '../components/form/TextInput.jsx'
import TextArea from '../components/form/TextArea.jsx'
import SelectInput from '../components/form/SelectInput.jsx'
import DateInput from '../components/form/DateInput.jsx'
import FileDropzone from '../components/form/FileDropzone.jsx'
import FormActions from '../components/form/FormActions.jsx'
import './TambahProdukPage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const KATEGORI_OPTIONS = [
  { value: 'buah',    label: 'Buah-buahan' },
  { value: 'sayur',   label: 'Sayuran' },
  { value: 'rempah',  label: 'Rempah & Bumbu' },
  { value: 'lainnya', label: 'Lainnya' },
]

const STORAGE_OPTIONS = [
  { value: 'suhu_ruang', label: 'Suhu Ruang' },
  { value: 'kulkas',     label: 'Kulkas / Pendingin' },
  { value: 'vakum',      label: 'Vakum / Sealed' },
]

const INITIAL_FORM = {
  namaProduk:    '',
  kategori:      '',
  deskripsi:     '',
  harga:         '',
  stok:          '',
  minimumOrder:  '',
  lokasiAsal:    '',
  tanggalPanen:  '',
  storageMethod: '',
  hygienic:      true,
  pengiriman:    '',
}

// Badge tier kesegaran
const TIER_CONFIG = {
  Fresh:    { label: '🟢 Fresh',    bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
  Standard: { label: '🟡 Standard', bg: '#fefce8', color: '#854d0e', border: '#fef08a' },
  Rescue:   { label: '🔴 Rescue',   bg: '#fff5f5', color: '#991b1b', border: '#fecaca' },
}

export default function TambahProdukPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)
  const [foto, setFoto] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [prediction, setPrediction] = useState(null) // hasil prediksi tier

  const updateField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleCancel = () => navigate('/petani/produk-saya')

  const handleSubmit = async () => {
    setError('')
    setPrediction(null)

    // Validasi field wajib
    if (!form.namaProduk || !form.harga || !form.stok || !form.tanggalPanen || !form.storageMethod) {
      setError('Nama produk, harga, stok, tanggal panen, dan cara simpan wajib diisi.')
      return
    }

    // Tanggal panen tidak boleh di masa depan
    if (new Date(form.tanggalPanen) > new Date()) {
      setError('Tanggal panen tidak boleh di masa depan.')
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name:          form.namaProduk,
          storageMethod: form.storageMethod,
          harvestDate:   form.tanggalPanen,
          hygienic:      form.hygienic,
          pricePerKg:    parseFloat(form.harga),
          quantityKg:    parseFloat(form.stok),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Gagal menyimpan produk.')
        setLoading(false)
        return
      }

      // Tampilkan hasil prediksi sebelum redirect
      setPrediction(data.prediction)
      setLoading(false)
    } catch {
      setError('Tidak dapat terhubung ke server.')
      setLoading(false)
    }
  }

  // Kalau sudah ada prediksi, tampilkan hasil dulu
  if (prediction) {
    const tier = TIER_CONFIG[prediction.tier] ?? TIER_CONFIG.Standard

    return (
      <div className="tambah-produk">
        <PageIntro title="Produk Berhasil Disimpan" subtitle="Tier kesegaran produk kamu sudah diprediksi oleh AI." />
        <div className="tier-result">
          <div className="tier-result__badge" style={{ background: tier.bg, color: tier.color, borderColor: tier.border }}>
            <span className="tier-result__label">{tier.label}</span>
            <span className="tier-result__name">{form.namaProduk}</span>
          </div>

          {prediction.warning && (
            <p className="tier-result__warning">⚠️ {prediction.warning}</p>
          )}

          <div className="tier-result__actions">
            <button type="button" className="tier-result__btn-add" onClick={() => { setPrediction(null); setForm(INITIAL_FORM) }}>
              + Tambah Produk Lain
            </button>
            <button type="button" className="tier-result__btn-back" onClick={() => navigate('/petani/produk-saya')}>
              Lihat Semua Produk
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="tambah-produk">
      <PageIntro title="Tambah Produk" subtitle="Tambahkan produk baru hasil panen anda." />

      <div className="tambah-produk__body">
        <div className="tambah-produk__main">
          <section className="form-card">
            <div className="form-card__top-grid">
              <div className="form-card__col">
                <h3 className="form-card__heading">Informasi Produk</h3>

                <FormGroup label="Nama produk" htmlFor="namaProduk">
                  <TextInput
                    id="namaProduk"
                    placeholder="Contoh: tomat"
                    value={form.namaProduk}
                    onChange={updateField('namaProduk')}
                  />
                </FormGroup>

                <FormGroup label="Kategori" htmlFor="kategori">
                  <SelectInput
                    id="kategori"
                    placeholder="Pilih Kategori"
                    options={KATEGORI_OPTIONS}
                    value={form.kategori}
                    onChange={updateField('kategori')}
                  />
                </FormGroup>

                <FormGroup label="Cara penyimpanan" htmlFor="storageMethod">
                  <SelectInput
                    id="storageMethod"
                    placeholder="Pilih cara simpan"
                    options={STORAGE_OPTIONS}
                    value={form.storageMethod}
                    onChange={updateField('storageMethod')}
                  />
                </FormGroup>

                <FormGroup label="Tanggal panen" htmlFor="tanggalPanen">
                  <DateInput
                    id="tanggalPanen"
                    value={form.tanggalPanen}
                    onChange={updateField('tanggalPanen')}
                  />
                </FormGroup>

                <FormGroup label="">
                  <label className="tambah-produk__checkbox">
                    <input
                      type="checkbox"
                      checked={form.hygienic}
                      onChange={(e) => setForm((prev) => ({ ...prev, hygienic: e.target.checked }))}
                    />
                    <span>Produk ditangani secara higienis</span>
                  </label>
                </FormGroup>
              </div>

              <div className="form-card__col">
                <h3 className="form-card__heading">Deskripsi Produk</h3>
                <FormGroup>
                  <TextArea
                    placeholder="Jelaskan tentang produk Anda (asal, daerah, kualitas, dll.)"
                    className="tambah-produk__deskripsi"
                    value={form.deskripsi}
                    onChange={updateField('deskripsi')}
                  />
                </FormGroup>
              </div>
            </div>

            <hr className="form-card__divider" />

            <div className="form-card__foto">
              <h3 className="form-card__heading">Foto Produk</h3>
              <FileDropzone onFileSelect={setFoto} />
            </div>
          </section>

          {error && <div className="tambah-produk__error">{error}</div>}

          <FormActions
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            submitLabel={loading ? 'Menyimpan...' : 'Simpan & Prediksi Tier'}
          />
        </div>

        <aside className="tambah-produk__side">
          <section className="form-card form-card--detail">
            <h3 className="form-card__heading">Detail Produk</h3>

            <FormGroup label="Harga / kg (Rp)" htmlFor="harga">
              <TextInput
                id="harga"
                placeholder="Contoh: 28000"
                value={form.harga}
                onChange={updateField('harga')}
              />
            </FormGroup>

            <FormGroup label="Stok tersedia (kg)" htmlFor="stok">
              <TextInput
                id="stok"
                placeholder="Contoh: 20"
                value={form.stok}
                onChange={updateField('stok')}
              />
            </FormGroup>

            <FormGroup label="Minimum Order (kg)" htmlFor="minimumOrder">
              <TextInput
                id="minimumOrder"
                placeholder="Contoh: 10"
                value={form.minimumOrder}
                onChange={updateField('minimumOrder')}
              />
            </FormGroup>

            <FormGroup label="Lokasi Asal" htmlFor="lokasiAsal">
              <TextInput
                id="lokasiAsal"
                placeholder="Contoh: Jayapura, Papua"
                value={form.lokasiAsal}
                onChange={updateField('lokasiAsal')}
              />
            </FormGroup>

            <FormGroup label="Pengiriman" htmlFor="pengiriman">
              <TextArea
                id="pengiriman"
                placeholder="Contoh: Dikirim via ekspedisi, ongkir ditanggung pembeli"
                className="tambah-produk__pengiriman"
                value={form.pengiriman}
                onChange={updateField('pengiriman')}
              />
            </FormGroup>
          </section>

          {/* Info AI */}
          <div className="tambah-produk__ai-info">
            <div className="tambah-produk__ai-icon">🤖</div>
            <div>
              <p className="tambah-produk__ai-title">Prediksi AI Otomatis</p>
              <p className="tambah-produk__ai-desc">
                Setelah disimpan, AI kami akan memprediksi tier kesegaran produk kamu
                (Fresh / Standard / Rescue) berdasarkan jenis produk, cara simpan,
                hari sejak panen, dan higienitas.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
