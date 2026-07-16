import { useState, useEffect } from 'react'
import { Store, ShieldCheck, Bell, Wallet, Clock3 } from 'lucide-react'
import PageIntro from '../components/layout/PageIntro.jsx'
import SettingsNav from '../components/settings/SettingsNav.jsx'
import SettingsCard from '../components/settings/SettingsCard.jsx'
import ToggleSwitch from '../components/settings/ToggleSwitch.jsx'
import DayPicker from '../components/settings/DayPicker.jsx'
import CheckOption from '../components/settings/CheckOption.jsx'
import FormGroup from '../components/form/FormGroup.jsx'
import TextInput from '../components/form/TextInput.jsx'
import TextArea from '../components/form/TextArea.jsx'
import SelectInput from '../components/form/SelectInput.jsx'
import FileDropzone from '../components/form/FileDropzone.jsx'
import FormActions from '../components/form/FormActions.jsx'
import './PengaturanPage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token')
}

const NAV_ITEMS = [
  { key: 'profil', label: 'Profil Toko', icon: Store },
  { key: 'akun', label: 'Akun & Keamanan', icon: ShieldCheck },
  { key: 'notifikasi', label: 'Notifikasi', icon: Bell },
  { key: 'pembayaran', label: 'Pembayaran', icon: Wallet },
  { key: 'operasional', label: 'Operasional', icon: Clock3 },
]

const KATEGORI_OPTIONS = [
  { value: 'buah', label: 'Buah-buahan' },
  { value: 'sayur', label: 'Sayuran' },
  { value: 'rempah', label: 'Rempah & Bumbu' },
  { value: 'lainnya', label: 'Lainnya' },
]

const BANK_OPTIONS = [
  { value: 'bca', label: 'BCA' },
  { value: 'bni', label: 'BNI' },
  { value: 'bri', label: 'BRI' },
  { value: 'mandiri', label: 'Mandiri' },
]

const SHIPPING_METHODS = [
  { key: 'ekspedisi', label: 'Ekspedisi (JNE, J&T, SiCepat)', description: 'Pengiriman antar kota / pulau' },
  { key: 'kurirToko', label: 'Kurir Toko Sendiri', description: 'Untuk area dekat lokasi toko' },
  { key: 'ambilSendiri', label: 'Ambil di Tempat', description: 'Pembeli mengambil langsung ke lokasi' },
]

export default function PengaturanPage() {
  const [activeTab, setActiveTab] = useState('profil')
  const [saveStatus, setSaveStatus] = useState('') // 'saving' | 'success' | 'error'

  // Load user dari localStorage/sessionStorage
  const storedUser = JSON.parse(
    localStorage.getItem('user') || sessionStorage.getItem('user') || '{}'
  )

  const [profil, setProfil] = useState({
    namaToko: storedUser.name ?? '',
    lokasi:   storedUser.city ?? '',
    deskripsi: '',
  })

  const [akun, setAkun] = useState({
    namaPemilik:       storedUser.name ?? '',
    email:             storedUser.email ?? '',
    telepon:           storedUser.phone ?? '',
    passwordSaatIni:   '',
    passwordBaru:      '',
    konfirmasiPassword: '',
  })

  const [logo, setLogo] = useState(null)
  const [notifikasi, setNotifikasi] = useState({
    pesananBaru: true,
    stokMenipis: true,
    promo: false,
    ringkasanMingguan: true,
    pengingatPengiriman: true,
  })

  const [pembayaran, setPembayaran] = useState({
    bank: '',
    nomorRekening: '',
    namaPemilikRekening: '',
  })

  const [operasional, setOperasional] = useState({
    jamBuka: '08:00',
    jamTutup: '17:00',
    hariAktif: ['sen', 'sel', 'rab', 'kam', 'jum'],
    metodePengiriman: ['ekspedisi', 'kurirToko'],
  })

  const toggleDay = (day) => {
    setOperasional((prev) => ({
      ...prev,
      hariAktif: prev.hariAktif.includes(day)
        ? prev.hariAktif.filter((d) => d !== day)
        : [...prev.hariAktif, day],
    }))
  }

  const toggleShipping = (key, checked) => {
    setOperasional((prev) => ({
      ...prev,
      metodePengiriman: checked
        ? [...prev.metodePengiriman, key]
        : prev.metodePengiriman.filter((m) => m !== key),
    }))
  }

  const handleReset = () => window.location.reload()

  const handleSave = async () => {
    setSaveStatus('saving')
    try {
      const body: Record<string, string> = {}

      if (activeTab === 'profil') {
        if (profil.namaToko) body.name    = profil.namaToko
        if (profil.lokasi)   body.city    = profil.lokasi
        if (profil.deskripsi) body.address = profil.deskripsi
      }

      if (activeTab === 'akun') {
        if (akun.namaPemilik) body.name  = akun.namaPemilik
        if (akun.telepon)     body.phone = akun.telepon
        if (akun.passwordBaru) {
          if (akun.passwordBaru !== akun.konfirmasiPassword) {
            setSaveStatus('error')
            alert('Password baru dan konfirmasi tidak cocok')
            return
          }
          body.passwordSaatIni = akun.passwordSaatIni
          body.passwordBaru    = akun.passwordBaru
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

      // Update localStorage/sessionStorage dengan data terbaru
      const storage = localStorage.getItem('token') ? localStorage : sessionStorage
      storage.setItem('user', JSON.stringify(data.user))

      setSaveStatus('success')
      setTimeout(() => setSaveStatus(''), 3000)
    } catch {
      setSaveStatus('error')
      alert('Tidak dapat terhubung ke server')
    }
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
                      value={profil.namaToko}
                      onChange={(e) => setProfil((p) => ({ ...p, namaToko: e.target.value }))}
                    />
                  </FormGroup>

                  <FormGroup label="Lokasi toko (kota)" htmlFor="lokasiToko">
                    <TextInput
                      id="lokasiToko"
                      placeholder="Contoh: Jayapura, Papua"
                      value={profil.lokasi}
                      onChange={(e) => setProfil((p) => ({ ...p, lokasi: e.target.value }))}
                    />
                  </FormGroup>
                </div>

                <div className="pengaturan__col">
                  <FormGroup label="Logo toko">
                    <FileDropzone onFileSelect={setLogo} />
                  </FormGroup>
                </div>
              </div>

              <FormGroup label="Deskripsi toko" htmlFor="deskripsiToko">
                <TextArea
                  id="deskripsiToko"
                  placeholder="Ceritakan sedikit tentang toko kamu"
                  value={profil.deskripsi}
                  onChange={(e) => setProfil((p) => ({ ...p, deskripsi: e.target.value }))}
                />
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
                    onChange={(e) => setAkun((a) => ({ ...a, namaPemilik: e.target.value }))}
                  />
                </FormGroup>

                <FormGroup label="Email" htmlFor="email">
                  <TextInput
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={akun.email}
                    onChange={(e) => setAkun((a) => ({ ...a, email: e.target.value }))}
                  />
                </FormGroup>
              </div>

              <FormGroup label="Nomor telepon" htmlFor="telepon">
                <TextInput
                  id="telepon"
                  placeholder="Contoh: 0812xxxxxxx"
                  value={akun.telepon}
                  onChange={(e) => setAkun((a) => ({ ...a, telepon: e.target.value }))}
                />
              </FormGroup>

              <hr className="pengaturan__divider" />
              <h4 className="pengaturan__subheading">Ganti Password</h4>

              <FormGroup label="Password saat ini" htmlFor="passwordSaatIni">
                <TextInput
                  id="passwordSaatIni"
                  type="password"
                  placeholder="••••••••"
                  value={akun.passwordSaatIni}
                  onChange={(e) => setAkun((a) => ({ ...a, passwordSaatIni: e.target.value }))}
                />
              </FormGroup>

              <div className="pengaturan__grid">
                <FormGroup label="Password baru" htmlFor="passwordBaru">
                  <TextInput
                    id="passwordBaru"
                    type="password"
                    placeholder="••••••••"
                    value={akun.passwordBaru}
                    onChange={(e) => setAkun((a) => ({ ...a, passwordBaru: e.target.value }))}
                  />
                </FormGroup>

                <FormGroup label="Konfirmasi password baru" htmlFor="konfirmasiPassword">
                  <TextInput
                    id="konfirmasiPassword"
                    type="password"
                    placeholder="••••••••"
                    value={akun.konfirmasiPassword}
                    onChange={(e) => setAkun((a) => ({ ...a, konfirmasiPassword: e.target.value }))}
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
                onChange={(v) => setNotifikasi((n) => ({ ...n, pesananBaru: v }))}
              />
              <ToggleSwitch
                id="notifStok"
                label="Stok Menipis"
                description="Diingatkan saat stok produk hampir habis."
                checked={notifikasi.stokMenipis}
                onChange={(v) => setNotifikasi((n) => ({ ...n, stokMenipis: v }))}
              />
              <ToggleSwitch
                id="notifPromo"
                label="Promo & Update Aplikasi"
                description="Info fitur baru dan penawaran dari Taniku."
                checked={notifikasi.promo}
                onChange={(v) => setNotifikasi((n) => ({ ...n, promo: v }))}
              />
              <ToggleSwitch
                id="notifRingkasan"
                label="Ringkasan Mingguan via Email"
                description="Rekap penjualan dan performa toko tiap minggu."
                checked={notifikasi.ringkasanMingguan}
                onChange={(v) => setNotifikasi((n) => ({ ...n, ringkasanMingguan: v }))}
              />
              <ToggleSwitch
                id="notifPengiriman"
                label="Pengingat Pengiriman"
                description="Pengingat saat pesanan harus segera dikirim."
                checked={notifikasi.pengingatPengiriman}
                onChange={(v) => setNotifikasi((n) => ({ ...n, pengingatPengiriman: v }))}
              />
            </SettingsCard>
          )}

          {activeTab === 'pembayaran' && (
            <SettingsCard
              title="Pembayaran & Rekening"
              subtitle="Rekening ini digunakan untuk pencairan dana hasil penjualan."
            >
              <div className="pengaturan__grid">
                <FormGroup label="Bank" htmlFor="bank">
                  <SelectInput
                    id="bank"
                    placeholder="Pilih Bank"
                    options={BANK_OPTIONS}
                    value={pembayaran.bank}
                    onChange={(e) => setPembayaran((p) => ({ ...p, bank: e.target.value }))}
                  />
                </FormGroup>

                <FormGroup label="Nomor rekening" htmlFor="nomorRekening">
                  <TextInput
                    id="nomorRekening"
                    placeholder="Contoh: 1234567890"
                    value={pembayaran.nomorRekening}
                    onChange={(e) => setPembayaran((p) => ({ ...p, nomorRekening: e.target.value }))}
                  />
                </FormGroup>
              </div>

              <FormGroup label="Nama pemilik rekening" htmlFor="namaPemilikRekening">
                <TextInput
                  id="namaPemilikRekening"
                  placeholder="Sesuai buku tabungan"
                  value={pembayaran.namaPemilikRekening}
                  onChange={(e) => setPembayaran((p) => ({ ...p, namaPemilikRekening: e.target.value }))}
                />
              </FormGroup>

              <p className="pengaturan__note">
                Pastikan nama pemilik rekening sesuai dengan data akun agar pencairan dana tidak tertunda.
              </p>
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
                    onChange={(e) => setOperasional((o) => ({ ...o, jamBuka: e.target.value }))}
                  />
                </FormGroup>

                <FormGroup label="Jam tutup" htmlFor="jamTutup">
                  <TextInput
                    id="jamTutup"
                    type="time"
                    value={operasional.jamTutup}
                    onChange={(e) => setOperasional((o) => ({ ...o, jamTutup: e.target.value }))}
                  />
                </FormGroup>
              </div>

              <FormGroup label="Hari operasional">
                <DayPicker selectedDays={operasional.hariAktif} onToggleDay={toggleDay} />
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
