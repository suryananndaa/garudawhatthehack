import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageIntro from '../components/layout/PageIntro.jsx'
import ProdukFormFields from '../components/produk/ProdukFormFields.jsx'
import { INITIAL_FORM } from '../components/produk/produkFormConfig.js'
import './TambahProdukPage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function toFormValues(p) {
  return {
    ...INITIAL_FORM,
    namaProduk:    p.name ?? '',
    harga:         String(p.pricePerKg ?? ''),
    stok:          String(p.quantityKg ?? ''),
    tanggalPanen:  p.harvestDate ? p.harvestDate.slice(0, 10) : '',
    storageMethod: p.storageMethod ?? '',
    hygienic:      p.hygienic ?? true,
  }
}

export default function EditProdukPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)
  const [foto, setFoto] = useState(null)
  const [fetching, setFetching] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleCancel = () => navigate('/petani/produk-saya')

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (!token) { navigate('/login'); return }

    fetch(`${API_URL}/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.product) setForm(toFormValues(data.product))
        else setError(data.message || 'Produk tidak ditemukan.')
      })
      .catch(() => setError('Tidak dapat terhubung ke server.'))
      .finally(() => setFetching(false))
  }, [id])

  const handleSubmit = async () => {
    setError('')

    if (!form.namaProduk || !form.harga || !form.stok || !form.tanggalPanen || !form.storageMethod) {
      setError('Nama produk, harga, stok, tanggal panen, dan cara simpan wajib diisi.')
      return
    }

    if (new Date(form.tanggalPanen) > new Date()) {
      setError('Tanggal panen tidak boleh di masa depan.')
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'PUT',
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
        setError(data.message || 'Gagal memperbarui produk.')
        setLoading(false)
        return
      }

      navigate('/petani/produk-saya')
    } catch {
      setError('Tidak dapat terhubung ke server.')
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="tambah-produk">
        <PageIntro title="Edit Produk" subtitle="Memuat data produk..." />
      </div>
    )
  }

  return (
    <div className="tambah-produk">
      <PageIntro title="Edit Produk" subtitle="Perbarui detail produk kamu." />

      <ProdukFormFields
        form={form}
        updateField={updateField}
        setForm={setForm}
        foto={foto}
        setFoto={setFoto}
        error={error}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        submitLabel={loading ? 'Menyimpan...' : 'Simpan Perubahan'}
      />
    </div>
  )
}
