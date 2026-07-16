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

const KATEGORI_OPTIONS = [
  { value: 'buah', label: 'Buah-buahan' },
  { value: 'sayur', label: 'Sayuran' },
  { value: 'rempah', label: 'Rempah & Bumbu' },
  { value: 'lainnya', label: 'Lainnya' },
]

const KUALITAS_OPTIONS = [
  { value: 'grade-a', label: 'Grade A - Premium' },
  { value: 'grade-b', label: 'Grade B - Standar' },
  { value: 'grade-c', label: 'Grade C - Ekonomis' },
]

const INITIAL_FORM = {
  namaProduk: '',
  kategori: '',
  deskripsi: '',
  harga: '',
  stok: '',
  minimumOrder: '',
  lokasiAsal: '',
  estimasiPanen: '',
  kualitas: '',
  pengiriman: '',
}

export default function TambahProdukPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)
  const [foto, setFoto] = useState(null)

  const updateField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleCancel = () => navigate('/')

  const handleSubmit = () => {
    console.log('Produk baru:', { ...form, foto })
    alert('Produk berhasil disimpan!')
    navigate('/')
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
                    placeholder="Contoh: Matoa"
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

          <FormActions onCancel={handleCancel} onSubmit={handleSubmit} />
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

            <FormGroup label="Estimasi Panen" htmlFor="estimasiPanen">
              <DateInput
                id="estimasiPanen"
                placeholder="Pilih tanggal panen"
                value={form.estimasiPanen}
                onChange={updateField('estimasiPanen')}
              />
            </FormGroup>

            <FormGroup label="Kualitas" htmlFor="kualitas">
              <SelectInput
                id="kualitas"
                placeholder="Kualitas"
                options={KUALITAS_OPTIONS}
                value={form.kualitas}
                onChange={updateField('kualitas')}
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
        </aside>
      </div>
    </div>
  )
}
