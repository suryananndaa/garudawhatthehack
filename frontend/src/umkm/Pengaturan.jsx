import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './Pengaturan.css'

/* ============================================================
   ICONS
   ============================================================ */
const IconHome       = (p) => <svg viewBox="0 0 24 24" fill="none" className="nav__icon" {...p}><path d="M4 11.5 12 4l8 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 20v-5h4v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
const IconOrders     = (p) => <svg viewBox="0 0 24 24" fill="none" className="nav__icon" {...p}><path d="M7 3h8l3 3v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 9h6M9 13h6M9 17h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
const IconHeart      = (p) => <svg viewBox="0 0 24 24" fill="none" className="nav__icon" {...p}><path d="M12 20.5s-7.5-4.6-9.6-9A5.2 5.2 0 0 1 12 6.4 5.2 5.2 0 0 1 21.6 11.5c-2.1 4.4-9.6 9-9.6 9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>
const IconGear       = (p) => <svg viewBox="0 0 24 24" fill="none" className="nav__icon" {...p}><circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8"/><path d="M12 2.6v2.2M12 19.2v2.2M4.5 4.5l1.5 1.5M18 18l1.5 1.5M2.6 12h2.2M19.2 12h2.2M4.5 19.5 6 18M18 6l1.5-1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
const IconSearch     = (p) => <svg viewBox="0 0 24 24" fill="none" width="18" height="18" {...p}><circle cx="11" cy="11" r="6.5" stroke="white" strokeWidth="2"/><path d="m20 20-3.4-3.4" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
const IconBell       = (p) => <svg viewBox="0 0 24 24" fill="none" width="19" height="19" {...p}><path d="M6 9a6 6 0 0 1 12 0c0 4.2 1.2 5.6 2 6.5H4c.8-.9 2-2.3 2-6.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
const IconCart       = (p) => <svg viewBox="0 0 24 24" fill="none" width="19" height="19" {...p}><path d="M4 6h2l1.6 10.2A2 2 0 0 0 9.6 18H18a2 2 0 0 0 2-1.6L21.5 9H6.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><circle cx="10" cy="21" r="1.3" fill="currentColor"/><circle cx="18" cy="21" r="1.3" fill="currentColor"/></svg>
const IconBadge      = (p) => <svg viewBox="0 0 24 24" width="15" height="15" fill="#2fae60" {...p}><path d="M12 2 14.4 4.3 17.6 3.6 18.4 6.8 21.5 8.1 20 11 21.5 13.9 18.4 15.2 17.6 18.4 14.4 17.7 12 20 9.6 17.7 6.4 18.4 5.6 15.2 2.5 13.9 4 11 2.5 8.1 5.6 6.8 6.4 3.6 9.6 4.3Z"/><path d="m8.5 12 2.3 2.3L15.5 9.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
const IconClose      = (p) => <svg viewBox="0 0 24 24" fill="none" width="14" height="14" {...p}><path d="M5 5l14 14M19 5 5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
const IconMapPin     = (p) => <svg viewBox="0 0 24 24" fill="none" width="13" height="13" {...p}><path d="M12 21s7-6.4 7-11.5a7 7 0 1 0-14 0C5 14.6 12 21 12 21Z" stroke="currentColor" strokeWidth="1.7"/><circle cx="12" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="1.7"/></svg>
const IconPhone      = (p) => <svg viewBox="0 0 24 24" fill="none" width="13" height="13" {...p}><path d="M6.6 10.8c1.3 2.6 3.4 4.7 6 6l2-2a1.2 1.2 0 0 1 1.3-.3c1 .3 2.1.5 3.2.5.7 0 1.2.5 1.2 1.2V19a1.2 1.2 0 0 1-1.2 1.2C10.3 20.2 3.8 13.7 3.8 6a1.2 1.2 0 0 1 1.2-1.2h2.8c.7 0 1.2.5 1.2 1.2 0 1.1.2 2.2.5 3.2.1.5 0 1-.3 1.3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
const IconUpload     = (p) => <svg viewBox="0 0 24 24" fill="none" width="18" height="18" {...p}><path d="M12 15V4M8 8l4-4 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
const IconPlus       = (p) => <svg viewBox="0 0 24 24" fill="none" width="14" height="14" {...p}><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
const IconCrown      = (p) => <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" {...p}><path d="M3 8.5 7 11l5-6 5 6 4-2.5-2 9.5H5L3 8.5Z" strokeLinejoin="round"/><rect x="5" y="18" width="14" height="2.4" rx="1"/></svg>
const IconCheckCircle= (p) => <svg viewBox="0 0 24 24" fill="none" width="16" height="16" {...p}><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.7"/><path d="m8 12.3 2.6 2.6L16 9.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></svg>
const IconLogout     = (p) => <svg viewBox="0 0 24 24" fill="none" className="nav__icon" {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>

/* ============================================================
   REUSABLE PIECES
   ============================================================ */
function Toggle({ on, onChange }) {
  return (
    <button type="button" className={`switch ${on ? 'is-on' : ''}`} onClick={() => onChange(!on)} aria-pressed={on}>
      <span className="switch__knob" />
    </button>
  )
}

function ToggleRow({ title, desc, on, onChange }) {
  return (
    <div className="toggle-row">
      <div className="toggle-row__text">
        <strong>{title}</strong>
        <p>{desc}</p>
      </div>
      <Toggle on={on} onChange={onChange} />
    </div>
  )
}

function Toast({ message, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2600); return () => clearTimeout(t) }, [message])
  return (
    <div className="toast">
      <IconCheckCircle />
      <span>{message}</span>
    </div>
  )
}

/* ============================================================
   TAB 1 — PROFIL BISNIS
   ============================================================ */
function ProfilBisnisPanel({ showToast }) {
  const [form, setForm] = useState({
    nama: 'Resto Segar', jenis: 'Restoran',
    telepon: '+62 812-3456-7890', email: 'resto.segar@gmail.com',
    deskripsi: 'Restoran masakan Sunda dengan bahan segar langsung dari petani lokal Bandung.',
  })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  return (
    <div className="settings-panel">
      <div className="settings-panel__head"><h2>Profil Bisnis</h2><p>Informasi ini akan ditampilkan kepada produsen saat bertransaksi</p></div>
      <div className="avatar-row">
        <div className="avatar-square" />
        <button type="button" className="btn btn--outline-green">Ganti Foto</button>
      </div>
      <hr className="divider" />
      <div className="form-grid">
        <div className="field"><label htmlFor="nama">Nama Bisnis</label><input id="nama" type="text" value={form.nama} onChange={set('nama')} /></div>
        <div className="field"><label htmlFor="jenis">Jenis Bisnis</label>
          <select id="jenis" value={form.jenis} onChange={set('jenis')}>
            <option>Restoran</option><option>Katering</option><option>Warung</option><option>Hotel</option><option>Lainnya</option>
          </select>
        </div>
        <div className="field"><label htmlFor="telepon">Nomor Telepon</label><input id="telepon" type="text" value={form.telepon} onChange={set('telepon')} /></div>
        <div className="field"><label htmlFor="email">Email</label><input id="email" type="email" value={form.email} onChange={set('email')} /></div>
      </div>
      <div className="field" style={{ marginBottom: 0 }}>
        <label htmlFor="deskripsi">Deskripsi Bisnis</label>
        <textarea id="deskripsi" value={form.deskripsi} onChange={set('deskripsi')} />
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn--ghost">Batal</button>
        <button type="button" className="btn btn--primary" onClick={() => showToast('Profil bisnis berhasil disimpan.')}>Simpan Perubahan</button>
      </div>
    </div>
  )
}

/* ============================================================
   TAB 2 — AKUN & KEAMANAN
   ============================================================ */
function AkunKeamananPanel({ showToast }) {
  const [newPassword, setNewPassword] = useState('')
  const [twoStep, setTwoStep] = useState(true)
  const [loginAlert, setLoginAlert] = useState(true)
  return (
    <div className="settings-panel">
      <div className="settings-panel__head"><h2>Akun &amp; Keamanan</h2><p>Kelola kata sandi dan keamanan akun Anda</p></div>
      <div className="form-grid" style={{ marginTop: 22 }}>
        <div className="field"><label>Kata Sandi Saat Ini</label><div className="password-value">•••••••</div></div>
        <div className="field"><label htmlFor="newPass">Kata Sandi Baru</label><input id="newPass" type="password" placeholder="Masukkan kata sandi baru" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
      </div>
      <hr className="divider" />
      <ToggleRow title="Verifikasi Dua Langkah" desc="Tambahkan lapisan keamanan ekstra saat masuk" on={twoStep} onChange={setTwoStep} />
      <ToggleRow title="Notifikasi Login Baru" desc="Dapatkan peringatan saat akun diakses dari perangkat baru" on={loginAlert} onChange={setLoginAlert} />
      <div className="form-actions">
        <button type="button" className="btn btn--primary" onClick={() => showToast('Kata sandi berhasil diperbarui.')}>Perbarui Kata Sandi</button>
      </div>
    </div>
  )
}

/* ============================================================
   TAB 3 — ALAMAT PENGIRIMAN
   ============================================================ */
const INITIAL_ADDRESSES = [
  { id:1, storeName:'Segar Mania Dago',   receiver:'Suranti', phone:'+62 084-5589-236', city:'Bandung', province:'Jawa Barat', fullAddress:'Jl. Bandera Bangsa, Dago, Bandung, Jawa Barat', postalCode:'12345', isPrimary:true,  color:'#7a3a34' },
  { id:2, storeName:'Segar Mania Subang', receiver:'Suranti', phone:'+62 089-1455-088', city:'Subang',  province:'Jawa Barat', fullAddress:'Jl. Raya Subang No. 21, Subang, Jawa Barat',  postalCode:'41211', isPrimary:false, color:'#33456e' },
]
const BLANK_FORM = { storeName:'', receiver:'', phone:'', fullAddress:'', city:'', postalCode:'', makePrimary:false }

function AlamatPengirimanPanel({ showToast }) {
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES)
  const [selectedId, setSelectedId] = useState(INITIAL_ADDRESSES[0].id)
  const [mode, setMode] = useState('detail')
  const [editForm, setEditForm] = useState(null)
  const [addForm, setAddForm] = useState(BLANK_FORM)
  const [confirmTarget, setConfirmTarget] = useState(null)
  const selected = addresses.find((a) => a.id === selectedId) || null

  useEffect(() => { if (selected) setEditForm({ ...selected }) }, [selectedId]) // eslint-disable-line

  const setEdit = (k) => (e) => setEditForm((f) => ({ ...f, [k]: e.target.value }))
  const setAdd  = (k) => (e) => setAddForm((f) => ({ ...f, [k]: e.target.value }))

  const saveEdit = () => { setAddresses((p) => p.map((a) => a.id === editForm.id ? { ...a, ...editForm } : a)); showToast('Alamat toko berhasil diperbarui.') }
  const deleteAddress = () => { setAddresses((p) => p.filter((a) => a.id !== editForm.id)); setSelectedId(null); showToast('Alamat toko dihapus.') }
  const saveNewAddress = () => {
    const newAddr = { id:Date.now(), storeName:addForm.storeName||'Toko Baru', receiver:addForm.receiver, phone:addForm.phone, city:addForm.city, province:'', fullAddress:addForm.fullAddress, postalCode:addForm.postalCode, isPrimary:false, color:'#3f7a4c' }
    setAddresses((p) => { const next = addForm.makePrimary ? p.map((a) => ({ ...a, isPrimary:false })) : p; return [...next, { ...newAddr, isPrimary:addForm.makePrimary }] })
    setSelectedId(newAddr.id); setMode('detail'); showToast('Toko baru berhasil ditambahkan.')
  }
  const confirmMakePrimary = () => { setAddresses((p) => p.map((a) => ({ ...a, isPrimary: a.id === confirmTarget.id }))); showToast(`${confirmTarget.storeName} kini menjadi Toko Utama.`); setConfirmTarget(null) }

  return (
    <>
      <div className="address-grid">
        <div className="settings-panel">
          <div className="address-list-head">
            <div className="settings-panel__head"><h2>Alamat Pengiriman</h2><p>Kelola alamat toko anda untuk pengiriman pesanan</p></div>
            <button type="button" className="btn btn--outline-green btn--sm" onClick={() => { setMode('add'); setAddForm(BLANK_FORM); setSelectedId(null) }}>
              <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}><IconPlus /> Tambah Toko</span>
            </button>
          </div>
          {addresses.map((a) => (
            <div key={a.id} className={`address-card ${mode==='detail' && selectedId===a.id ? 'address-card--selected' : ''}`} onClick={() => { setSelectedId(a.id); setMode('detail') }}>
              <div className="avatar-circle" style={{ background:a.color }} />
              <div className="address-card__body">
                <p className="address-card__name">{a.storeName}{a.isPrimary && <span className="address-card__badge"><IconCheckCircle width="11" height="11" /> Toko Utama</span>}</p>
                <p className="address-card__meta"><IconMapPin /> {a.city}, {a.province}</p>
                <p className="address-card__meta"><IconPhone /> {a.phone}</p>
              </div>
              {!a.isPrimary && (
                <div className="address-card__action">
                  <button type="button" className="btn btn--ghost btn--sm" onClick={(e) => { e.stopPropagation(); setConfirmTarget(a) }}>Jadikan Toko Utama</button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="settings-panel">
          {mode==='add' ? (
            <>
              <div className="settings-panel__head"><h2>Tambah Toko</h2><p>Tambahkan toko atau alamat baru untuk pengiriman</p></div>
              <p className="field-label" style={{ fontSize:12, fontWeight:700, margin:'20px 0 8px' }}>Logo/Gambar Toko (Opsional)</p>
              <div className="upload-box"><IconUpload /><span><strong>Upload Foto</strong> — PNG atau JPG, maks 2MB</span></div>
              <div className="form-grid form-grid--full">
                <div className="field"><label>Nama Toko</label><input type="text" value={addForm.storeName} onChange={setAdd('storeName')} placeholder="Contoh: Segar Mania Cianjur" /></div>
                <div className="field"><label>Nama Penerima</label><input type="text" value={addForm.receiver} onChange={setAdd('receiver')} placeholder="Nama lengkap penerima" /></div>
                <div className="field"><label>Nomor Telepon</label><input type="text" value={addForm.phone} onChange={setAdd('phone')} placeholder="+62 8xx-xxxx-xxxx" /></div>
                <div className="field"><label>Alamat Lengkap</label><textarea value={addForm.fullAddress} onChange={setAdd('fullAddress')} placeholder="Jalan, nomor, kecamatan, kabupaten/kota" /></div>
              </div>
              <div className="form-grid">
                <div className="field"><label>Kota</label><input type="text" value={addForm.city} onChange={setAdd('city')} /></div>
                <div className="field"><label>Kode Pos</label><input type="text" value={addForm.postalCode} onChange={setAdd('postalCode')} /></div>
              </div>
              <label className="field-check"><input type="checkbox" checked={addForm.makePrimary} onChange={(e) => setAddForm((f) => ({ ...f, makePrimary:e.target.checked }))} />Jadikan sebagai Toko Utama</label>
              <div className="form-actions">
                <button type="button" className="btn btn--ghost" onClick={() => setMode('detail')}>Batal</button>
                <button type="button" className="btn btn--primary" onClick={saveNewAddress}>Simpan</button>
              </div>
            </>
          ) : selected && editForm ? (
            <>
              <div className="settings-panel__head"><h2>Detail Alamat Toko</h2><p>Informasi lengkap alamat toko</p></div>
              <div className="detail-head" style={{ marginTop:20 }}>
                <div className="detail-head__id"><div className="avatar-circle" style={{ background:selected.color }} /><span className="detail-head__name">{selected.storeName}</span></div>
                <button type="button" className="detail-head__link">Edit Foto</button>
              </div>
              <div className="form-grid form-grid--full">
                <div className="field"><label>Nama Toko</label><input type="text" value={editForm.storeName} onChange={setEdit('storeName')} /></div>
                <div className="field"><label>Nama Penerima</label><input type="text" value={editForm.receiver} onChange={setEdit('receiver')} /></div>
                <div className="field"><label>Nomor Telepon</label><input type="text" value={editForm.phone} onChange={setEdit('phone')} /></div>
                <div className="field"><label>Alamat Lengkap</label><textarea value={editForm.fullAddress} onChange={setEdit('fullAddress')} /></div>
              </div>
              <div className="form-grid">
                <div className="field"><label>Kota</label><input type="text" value={editForm.city} onChange={setEdit('city')} /></div>
                <div className="field"><label>Kode Pos</label><input type="text" value={editForm.postalCode} onChange={setEdit('postalCode')} /></div>
              </div>
              <div className="form-actions" style={{ justifyContent:'space-between' }}>
                <button type="button" className="btn btn--danger" onClick={deleteAddress}>Hapus</button>
                <div style={{ display:'flex', gap:10 }}>
                  <button type="button" className="btn btn--ghost" onClick={() => setEditForm({ ...selected })}>Batal</button>
                  <button type="button" className="btn btn--primary" onClick={saveEdit}>Simpan</button>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-detail"><p>📍</p><p>Pilih salah satu toko di sebelah kiri<br />untuk melihat detailnya.</p></div>
          )}
        </div>
      </div>

      {confirmTarget && (
        <div className="modal-overlay" onClick={() => setConfirmTarget(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal__close" onClick={() => setConfirmTarget(null)}><IconClose /></button>
            <div className="crown-badge"><IconCrown /></div>
            <h3>Jadikan {confirmTarget.storeName} sebagai Toko Utama?</h3>
            <p className="modal-desc">Toko ini akan digunakan sebagai alamat default untuk pemilihan produk, rekomendasi supplier, dan aktivitas pemesanan Anda.</p>
            <div className="modal__actions">
              <button type="button" className="btn btn--ghost" onClick={() => setConfirmTarget(null)}>Batal</button>
              <button type="button" className="btn btn--primary" onClick={confirmMakePrimary}>Ya, Jadikan Toko Utama</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ============================================================
   TAB 4 — NOTIFIKASI
   ============================================================ */
function NotifikasiPanel({ showToast }) {
  const [statusPesanan, setStatusPesanan] = useState(true)
  const [chatBaru, setChatBaru] = useState(true)
  const [rekomendasiAI, setRekomendasiAI] = useState(true)
  const [promo, setPromo] = useState(false)
  return (
    <div className="settings-panel">
      <div className="settings-panel__head"><h2>Notifikasi</h2><p>Pilih notifikasi yang ingin Anda terima</p></div>
      <div style={{ marginTop:20 }}>
        <ToggleRow title="Status Pesanan"   desc="Update saat pesanan diproses, dikirim, dan tiba"           on={statusPesanan}   onChange={setStatusPesanan} />
        <ToggleRow title="Pesan Chat Baru"  desc="Notifikasi saat produsen membalas pesan Anda"              on={chatBaru}        onChange={setChatBaru} />
        <ToggleRow title="Rekomendasi AI"   desc="Saran produk berdasarkan lokasi dan riwayat belanja"       on={rekomendasiAI}   onChange={setRekomendasiAI} />
        <ToggleRow title="Promo & Penawaran" desc="Info diskon dan promo dari Taniku"                        on={promo}           onChange={setPromo} />
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn--primary" onClick={() => showToast('Preferensi notifikasi disimpan.')}>Simpan Preferensi</button>
      </div>
    </div>
  )
}

/* ============================================================
   MAIN PAGE
   ============================================================ */
const TABS = [
  { key:'profil',     label:'Profil Bisnis'       },
  { key:'akun',       label:'Akun & Keamanan'     },
  { key:'alamat',     label:'Alamat Pengiriman'   },
  { key:'notifikasi', label:'Notifikasi'          },
]

const NAV_ITEMS = [
  { to:'/pembeli/dashboard',  icon:<IconHome />,   label:'Beranda'       },
  { to:'/pembeli/pesanan',    icon:<IconOrders />, label:'Pesanan Saya'  },
  { to:'/pembeli/favorit',    icon:<IconHeart />,  label:'Favorit'       },
  { to:'/pembeli/pengaturan', icon:<IconGear />,   label:'Pengaturan'    },
]

export default function Pengaturan() {
  const navigate = useNavigate()
  const rawUser = localStorage.getItem('user') || sessionStorage.getItem('user')
  const user = rawUser ? JSON.parse(rawUser) : null
  const userName = user?.name || user?.email || 'Konsumen'

  const [activeTab, setActiveTab] = useState('profil')
  const [toast, setToast] = useState(null)

  function handleLogout() {
    localStorage.removeItem('token'); localStorage.removeItem('user')
    sessionStorage.removeItem('token'); sessionStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="pengaturan-app">

      {/* ===== SIDEBAR ===== */}
      <aside className="umkm-sidebar">
        <div className="brand">
          <span className="brand__mark">🌿</span>
          <span className="brand__name">Tani<span className="brand__accent">ku</span></span>
        </div>

        <nav className="nav" aria-label="Navigasi utama">
          {NAV_ITEMS.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} end className={({ isActive }) => `nav__item${isActive ? ' nav__item--active' : ''}`}>
              {icon}<span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__bottom">
          <div className="promo-card">
            <p className="promo-card__title">Bergabung jadi<br />Konsumen Premium</p>
            <p className="promo-card__sub">Dapatkan harga spesial dan rekomendasi terbaik dari AI kami.</p>
            <button className="promo-card__btn" type="button">Upgrade Sekarang</button>
          </div>
          <button className="help-pill" type="button" onClick={handleLogout}>
            <IconLogout />
            <span>Keluar<br /><small>dari akun Taniku</small></span>
          </button>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <main className="main">
        <header className="topbar">
          <div className="topbar__search" style={{ cursor:'pointer' }} onClick={() => navigate('/pembeli/search')}>
            <input type="text" placeholder="Cari produk segar (tomat, cabai, beras, ikan..)" readOnly style={{ cursor:'pointer' }} />
            <button type="button" aria-label="Cari" onClick={e => { e.stopPropagation(); navigate('/pembeli/search') }}><IconSearch /></button>
          </div>
          <div className="topbar__actions">
            <button className="icon-btn" aria-label="Notifikasi"><IconBell /><span className="icon-btn__dot" /></button>
            <button className="icon-btn" aria-label="Keranjang"><IconCart /></button>
            <button className="profile-chip">
              <img src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=100&h=100&fit=crop" alt="" />
              <span>{userName}</span>
              <IconBadge />
            </button>
          </div>
        </header>

        <div className="page-head">
          <h1>Pengaturan</h1>
          <p>Kelola profil, akun, dan preferensi Anda</p>
        </div>

        <div className="settings-layout">
          <nav className="settings-tabs">
            {TABS.map((t) => (
              <button key={t.key} className={`settings-tab${activeTab===t.key?' settings-tab--active':''}`} onClick={() => setActiveTab(t.key)}>
                {t.label}
              </button>
            ))}
          </nav>

          {activeTab==='profil'     && <ProfilBisnisPanel     showToast={setToast} />}
          {activeTab==='akun'       && <AkunKeamananPanel     showToast={setToast} />}
          {activeTab==='alamat'     && <AlamatPengirimanPanel showToast={setToast} />}
          {activeTab==='notifikasi' && <NotifikasiPanel       showToast={setToast} />}
        </div>
      </main>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}
