import { useState } from 'react'
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

  const [profil, setProfil] = useState({
    namaToko: 'Taniku Farm',
    kategori: 'buah',
    lokasi: 'Jayapura, Papua',
    deskripsi: 'Menjual hasil panen buah segar langsung dari kebun.',
  })
  const [logo, setLogo] = useState(null)

  const [akun, setAkun] = useState({
    namaPemilik: '',
    email: '',
    telepon: '',
    passwordSaatIni: '',
    passwordBaru: '',
    konfirmasiPassword: '',
  })

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

  const handleSave = () => {
    console.log('Pengaturan disimpan:', { profil, logo, akun, notifikasi, pembayaran, operasional })
    alert('Perubahan pengaturan berhasil disimpan!')
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

                  <FormGroup label="Kategori utama" htmlFor="kategoriUtama">
                    <SelectInput
                      id="kategoriUtama"
                      placeholder="Pilih Kategori"
                      options={KATEGORI_OPTIONS}
                      value={profil.kategori}
                      onChange={(e) => setProfil((p) => ({ ...p, kategori: e.target.value }))}
                    />
                  </FormGroup>

                  <FormGroup label="Lokasi toko" htmlFor="lokasiToko">
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

          <FormActions cancelLabel="Batalkan Perubahan" submitLabel="Simpan Perubahan" onCancel={handleReset} onSubmit={handleSave} />
        </div>
      </div>
    </div>
  )
}
