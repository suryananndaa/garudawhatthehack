import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './Pesanan.css'

/* ============================================================
   ICONS
   ============================================================ */
const IconHome    = (p) => <svg viewBox="0 0 24 24" fill="none" className="nav__icon" {...p}><path d="M4 11.5 12 4l8 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 20v-5h4v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
const IconOrders  = (p) => <svg viewBox="0 0 24 24" fill="none" className="nav__icon" {...p}><path d="M7 3h8l3 3v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 9h6M9 13h6M9 17h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
const IconHeart   = (p) => <svg viewBox="0 0 24 24" fill="none" className="nav__icon" {...p}><path d="M12 20.5s-7.5-4.6-9.6-9A5.2 5.2 0 0 1 12 6.4 5.2 5.2 0 0 1 21.6 11.5c-2.1 4.4-9.6 9-9.6 9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>
const IconGear    = (p) => <svg viewBox="0 0 24 24" fill="none" className="nav__icon" {...p}><circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8"/><path d="M12 2.6v2.2M12 19.2v2.2M4.5 4.5l1.5 1.5M18 18l1.5 1.5M2.6 12h2.2M19.2 12h2.2M4.5 19.5 6 18M18 6l1.5-1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
const IconHelp    = (p) => <svg viewBox="0 0 24 24" fill="none" width="18" height="18" {...p}><path d="M4 15v-3a8 8 0 0 1 16 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M4 15a2 2 0 0 1 2-2h1v5H6a2 2 0 0 1-2-2Zm16 0a2 2 0 0 0-2-2h-1v5h1a2 2 0 0 0 2-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>
const IconSearch  = (p) => <svg viewBox="0 0 24 24" fill="none" width="18" height="18" {...p}><circle cx="11" cy="11" r="6.5" stroke="white" strokeWidth="2"/><path d="m20 20-3.4-3.4" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
const IconBell    = (p) => <svg viewBox="0 0 24 24" fill="none" width="19" height="19" {...p}><path d="M6 9a6 6 0 0 1 12 0c0 4.2 1.2 5.6 2 6.5H4c.8-.9 2-2.3 2-6.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
const IconCart    = (p) => <svg viewBox="0 0 24 24" fill="none" width="19" height="19" {...p}><path d="M4 6h2l1.6 10.2A2 2 0 0 0 9.6 18H18a2 2 0 0 0 2-1.6L21.5 9H6.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><circle cx="10" cy="21" r="1.3" fill="currentColor"/><circle cx="18" cy="21" r="1.3" fill="currentColor"/></svg>
const IconBadge   = (p) => <svg viewBox="0 0 24 24" width="15" height="15" fill="#2fae60" {...p}><path d="M12 2 14.4 4.3 17.6 3.6 18.4 6.8 21.5 8.1 20 11 21.5 13.9 18.4 15.2 17.6 18.4 14.4 17.7 12 20 9.6 17.7 6.4 18.4 5.6 15.2 2.5 13.9 4 11 2.5 8.1 5.6 6.8 6.4 3.6 9.6 4.3Z"/><path d="m8.5 12 2.3 2.3L15.5 9.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
const IconClose   = (p) => <svg viewBox="0 0 24 24" fill="none" width="15" height="15" {...p}><path d="M5 5l14 14M19 5 5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
const IconMapPin  = (p) => <svg viewBox="0 0 24 24" fill="none" width="14" height="14" {...p}><path d="M12 21s7-6.4 7-11.5a7 7 0 1 0-14 0C5 14.6 12 21 12 21Z" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="1.6"/></svg>
const IconStore   = (p) => <svg viewBox="0 0 24 24" fill="none" width="14" height="14" {...p}><path d="M4 9.5 5 4h14l1 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M4 9.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M5 9.5V20h14V9.5" stroke="currentColor" strokeWidth="1.6"/><path d="M10 20v-6h4v6" stroke="currentColor" strokeWidth="1.6"/></svg>
const IconCalendar= (p) => <svg viewBox="0 0 24 24" fill="none" width="14" height="14" {...p}><rect x="3" y="4.5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M3 9.5h18M8 3v3M16 3v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
const IconReceipt = (p) => <svg viewBox="0 0 24 24" fill="none" width="14" height="14" {...p}><path d="M6 3h12v18l-2.5-1.5L13 21l-1.5-1.5L10 21l-2.5-1.5L6 21V3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M9 8h6M9 12h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
const IconStar    = ({ filled, ...p }) => <svg viewBox="0 0 24 24" width="26" height="26" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" {...p}><path d="M12 2.5l2.9 6.1 6.6.7-4.9 4.6 1.3 6.6L12 17l-5.9 3.5 1.3-6.6L2.5 9.3l6.6-.7Z" strokeLinejoin="round"/></svg>
const IconCheck   = (p) => <svg viewBox="0 0 24 24" fill="none" width="26" height="26" {...p}><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.7"/><path d="m8 12.3 2.6 2.6L16 9.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></svg>
const IconAlert   = (p) => <svg viewBox="0 0 24 24" fill="none" width="26" height="26" {...p}><path d="M12 9v4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="16.7" r="1" fill="currentColor"/><path d="M10.3 3.7 2.7 17a1.7 1.7 0 0 0 1.5 2.6h15.6a1.7 1.7 0 0 0 1.5-2.6L13.7 3.7a1.7 1.7 0 0 0-3.4 0Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>
const IconLogout  = (p) => <svg viewBox="0 0 24 24" fill="none" className="nav__icon" {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>

/* ============================================================
   DATA
   ============================================================ */
const INITIAL_ORDERS = [
  { id:'TMAK-20388', status:'Dikirim',    productName:'Tomat Keriting', qty:8,  unit:'kg', pricePerUnit:23000, ongkosKirim:35000, biayaLayanan:15000, total:234000, supplierName:'Sumber Rejeki Makmur', supplierType:'Petani', location:'Indramayu', orderedDate:'16 Juli 2026', deliveryAddress:'Jl. Akasia Tree No. 96, Semarang' },
  { id:'TMAK-20389', status:'Diproses',   productName:'Cabai Kering',   qty:5,  unit:'kg', pricePerUnit:28000, ongkosKirim:40000, biayaLayanan:14000, total:194000, supplierName:'Bhumi Jaya Kusuma',   supplierType:'Petani', location:'Reban',     orderedDate:'16 Juli 2026', deliveryAddress:'Jl. Akasia Tree No. 96, Semarang' },
  { id:'TMAK-20390', status:'Selesai',    productName:'Jamur Kancing',  qty:10, unit:'kg', pricePerUnit:15000, ongkosKirim:40000, biayaLayanan:20000, total:210000, supplierName:'Sugih Arto',          supplierType:'Petani', location:'Sleman',    orderedDate:'16 Juli 2026', deliveryAddress:'Jl. Akasia Tree No. 96, Semarang' },
  { id:'TMAK-20391', status:'Dibatalkan', productName:'Baby Carrot',    qty:10, unit:'kg', pricePerUnit:20000, ongkosKirim:50000, biayaLayanan:26000, total:276000, supplierName:'Toko Adriyani',       supplierType:'Toko',   location:'Kopeng',    orderedDate:'16 Juli 2026', deliveryAddress:'Jl. Akasia Tree No. 96, Semarang' },
]

const FILTERS = ['Semua','Diproses','Dibatalkan','Selesai','Dikirim']

function formatRupiah(n) { return 'Rp ' + n.toLocaleString('id-ID') }

function getTrackSteps(order) {
  const base = [
    { key:'diterima', label:'Permintaan Diterima Petani',        time:'16 Juli 2026 · 08:45' },
    { key:'diproses', label:'Diproses oleh ' + order.supplierType, time: order.status==='Diproses'||order.status==='Dibatalkan' ? 'Sedang berlangsung' : '16 Juli 2026 · 09:15' },
    { key:'dikirim',  label:'Dikirim',  time: order.status==='Dikirim' ? 'Sedang dalam perjalanan' : order.status==='Selesai' ? '16 Juli 2026 · 13:00' : 'Menunggu' },
    { key:'selesai',  label:'Selesai',  time: order.status==='Selesai' ? '16 Juli 2026 · 14:00' : 'Menunggu' },
  ]
  if (order.status === 'Dibatalkan') {
    return base.slice(0,1).map(s=>({...s,state:'done'})).concat([{ key:'dibatalkan', label:'Pesanan Dibatalkan', time:'16 Juli 2026 · 09:00', state:'cancelled' }])
  }
  const idx = { Diproses:1, Dikirim:2, Selesai:3 }[order.status] ?? 0
  return base.map((s,i) => ({ ...s, state: i < idx ? 'done' : i === idx ? (order.status==='Selesai'?'done':'current') : 'pending' }))
}

/* ============================================================
   SMALL COMPONENTS
   ============================================================ */
function StatusBadge({ status }) {
  return <span className={`status-badge status-badge--${status}`}>{status}</span>
}

function StarPicker({ value, onChange }) {
  return (
    <div className="star-picker">
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button" className={n<=value?'is-filled':''} onClick={()=>onChange(n)} aria-label={`Beri ${n} bintang`}>
          <IconStar filled={n<=value} />
        </button>
      ))}
    </div>
  )
}

function OrderCard({ order, onDetail, onTrack, onCancel, onReorder, onReview }) {
  return (
    <div className="order-card">
      <div className="order-card__img" />
      <div className="order-card__mid">
        <div className="order-card__top">
          <span className="order-card__id">#{order.id}</span>
          <StatusBadge status={order.status} />
        </div>
        <p className="order-card__name">{order.productName} ({order.qty} {order.unit})</p>
        <p className="order-card__meta">Dari {order.supplierName} · {order.location} · Dipesan {order.orderedDate}</p>
      </div>
      <div className="order-card__right">
        <p className="order-card__price">{formatRupiah(order.total)}</p>
        <div className="order-card__actions">
          {order.status==='Dikirim'    && <><button className="btn btn--ghost" onClick={()=>onTrack(order)}>Lacak</button><button className="btn btn--ghost" onClick={()=>onDetail(order)}>Detail</button></>}
          {order.status==='Diproses'   && <><button className="btn btn--ghost" onClick={()=>onTrack(order)}>Lacak</button><button className="btn btn--danger" onClick={()=>onCancel(order)}>Batalkan</button><button className="btn btn--ghost" onClick={()=>onDetail(order)}>Detail</button></>}
          {order.status==='Selesai'    && <><button className="btn btn--primary" onClick={()=>onReorder(order)}>Beli Lagi</button><button className="btn btn--ghost" onClick={()=>onReview(order)}>Beri Ulasan</button></>}
          {order.status==='Dibatalkan' && <button className="btn btn--primary" onClick={()=>onReorder(order)}>Pesan Lagi</button>}
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   MODAL: DETAIL
   ============================================================ */
function DetailModal({ order, onClose }) {
  const subtotal = order.qty * order.pricePerUnit
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal__head">
          <div><h2>Detail Pesanan</h2><span>#{order.id}</span></div>
          <button className="modal__close" onClick={onClose}><IconClose /></button>
        </div>
        <div className="modal__body">
          <div className="detail-hero">
            <div className="detail-hero__img" />
            <div>
              <p className="detail-hero__name">{order.productName}</p>
              <p className="detail-hero__qty">{order.qty} {order.unit} · <StatusBadge status={order.status} /></p>
            </div>
          </div>
          <div className="info-box">
            <div className="info-box__row"><IconStore /><span>Dibeli dari <strong>{order.supplierName}</strong> ({order.supplierType})</span></div>
            <div className="info-box__row"><IconMapPin /><span>Lokasi {order.supplierType.toLowerCase()}: <strong>{order.location}</strong></span></div>
            <div className="info-box__row"><IconCalendar /><span>Dipesan pada <strong>{order.orderedDate}</strong></span></div>
            <div className="info-box__row"><IconMapPin /><span>Dikirim ke <strong>{order.deliveryAddress}</strong></span></div>
          </div>
          <p className="field-label" style={{display:'flex',alignItems:'center',gap:6}}><IconReceipt /> Rincian Biaya</p>
          <div className="breakdown">
            <div className="breakdown__row"><span>Harga bahan ({order.qty} {order.unit} × {formatRupiah(order.pricePerUnit)})</span><span>{formatRupiah(subtotal)}</span></div>
            <div className="breakdown__row"><span>Ongkos kirim dari {order.location}</span><span>{formatRupiah(order.ongkosKirim)}</span></div>
            <div className="breakdown__row"><span>Biaya layanan platform</span><span>{formatRupiah(order.biayaLayanan)}</span></div>
            <div className="breakdown__row breakdown__row--total"><span>Total Pembayaran</span><span>{formatRupiah(order.total)}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   MODAL: TRACK
   ============================================================ */
function TrackModal({ order, onClose }) {
  const steps = getTrackSteps(order)
  const cancelled = order.status === 'Dibatalkan'
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal__head">
          <div><h2>Lacak Pesanan</h2><span>#{order.id} · {order.productName}</span></div>
          <button className="modal__close" onClick={onClose}><IconClose /></button>
        </div>
        <div className="modal__body">
          <div className={`track-status-note${cancelled?' track-status-note--cancelled':''}`}>
            {cancelled ? <IconAlert width={18} height={18} /> : <IconCheck width={18} height={18} />}
            <span>{cancelled ? 'Pesanan ini telah dibatalkan sebelum diproses lebih lanjut.' : order.status==='Selesai' ? 'Pesanan sudah sampai dan diterima dengan baik.' : `Permintaan bahan sudah diterima oleh ${order.supplierName}, dan sedang berjalan menuju langkah berikutnya.`}</span>
          </div>
          <ol className="timeline">
            {steps.map(s => (
              <li key={s.key} className={`timeline__step timeline__step--${s.state}`}>
                <span className="timeline__dot" />
                <div><p>{s.label}</p><span>{s.time}</span></div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   MODAL: CANCEL
   ============================================================ */
function CancelModal({ order, onClose, onConfirm }) {
  const [reason, setReason] = useState('Berubah pikiran')
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal__head">
          <div><h2>Batalkan Pesanan</h2><span>#{order.id}</span></div>
          <button className="modal__close" onClick={onClose}><IconClose /></button>
        </div>
        <div className="modal__body">
          <div className="cancel-icon"><IconAlert /></div>
          <p className="cancel-text">Bahan <strong>{order.productName}</strong> belum diproses lebih lanjut oleh {order.supplierName}, jadi pesanan ini masih bisa dibatalkan tanpa biaya.</p>
          <label className="field-label" htmlFor="cancelReason">Alasan pembatalan</label>
          <select id="cancelReason" className="reason-select" value={reason} onChange={e=>setReason(e.target.value)}>
            <option>Berubah pikiran</option>
            <option>Salah pesan jumlah / produk</option>
            <option>Menemukan harga lebih baik</option>
            <option>Butuh mengubah alamat pengiriman</option>
            <option>Lainnya</option>
          </select>
        </div>
        <div className="modal__foot">
          <button className="btn btn--ghost" onClick={onClose}>Kembali</button>
          <button className="btn btn--danger" onClick={()=>onConfirm(order,reason)}>Ya, Batalkan</button>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   MODAL: REORDER
   ============================================================ */
function ReorderModal({ order, onClose, onConfirm }) {
  const [qty, setQty] = useState(order.qty)
  const [done, setDone] = useState(false)
  const subtotal = qty * order.pricePerUnit
  if (done) return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal__body success-view">
          <div className="success-view__icon"><IconCheck /></div>
          <h3>Ditambahkan ke keranjang!</h3>
          <p>{qty} {order.unit} {order.productName} dari {order.supplierName} siap untuk checkout.</p>
        </div>
        <div className="modal__foot">
          <button className="btn btn--ghost" onClick={onClose}>Lanjut Belanja</button>
          <button className="btn btn--primary" onClick={onClose}>Lihat Keranjang</button>
        </div>
      </div>
    </div>
  )
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal__head">
          <div><h2>{order.status==='Dibatalkan'?'Pesan Lagi':'Beli Lagi'}</h2><span>Dari {order.supplierName}</span></div>
          <button className="modal__close" onClick={onClose}><IconClose /></button>
        </div>
        <div className="modal__body">
          <div className="reorder-row">
            <div className="reorder-row__img" />
            <div><p className="reorder-row__name">{order.productName}</p><p className="reorder-row__price">{formatRupiah(order.pricePerUnit)} / {order.unit}</p></div>
          </div>
          <p className="field-label" style={{textAlign:'center'}}>Jumlah pesanan</p>
          <div className="stepper">
            <button className="stepper__btn" onClick={()=>setQty(q=>Math.max(1,q-1))}>−</button>
            <span className="stepper__val">{qty} {order.unit}</span>
            <button className="stepper__btn" onClick={()=>setQty(q=>q+1)}>+</button>
          </div>
          <div className="reorder-total"><span>Perkiraan subtotal</span><span>{formatRupiah(subtotal)}</span></div>
          <p className="reorder-hint">Ongkos kirim &amp; biaya layanan dihitung otomatis saat checkout.</p>
        </div>
        <div className="modal__foot">
          <button className="btn btn--ghost" onClick={onClose}>Batal</button>
          <button className="btn btn--primary" onClick={()=>{setDone(true);onConfirm&&onConfirm(order,qty)}}>Tambah ke Keranjang</button>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   MODAL: REVIEW
   ============================================================ */
function ReviewModal({ order, onClose, onSubmitted }) {
  const [step, setStep] = useState(1)
  const [productRating, setProductRating] = useState(0)
  const [productNote, setProductNote] = useState('')
  const [storeRating, setStoreRating] = useState(0)
  const [storeNote, setStoreNote] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (submitted) return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal__body success-view">
          <div className="success-view__icon"><IconCheck /></div>
          <h3>Terima kasih atas ulasanmu!</h3>
          <p>Penilaianmu membantu petani &amp; konsumen lain di Taniku.</p>
        </div>
        <div className="modal__foot"><button className="btn btn--primary" onClick={onClose} style={{flex:'unset',width:'100%'}}>Tutup</button></div>
      </div>
    </div>
  )
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal__head">
          <div><h2>Beri Ulasan</h2><span>Langkah {step} dari 2</span></div>
          <button className="modal__close" onClick={onClose}><IconClose /></button>
        </div>
        <div className="modal__body">
          <div className="review-steps"><span className="is-active" /><span className={step===2?'is-active':''} /></div>
          {step===1 ? (
            <>
              <div className="review-target"><div className="review-target__img" /><div><p className="review-target__label">Nilai Bahan</p><p className="review-target__name">{order.productName}</p></div></div>
              <StarPicker value={productRating} onChange={setProductRating} />
              <textarea className="review-textarea" placeholder="Bagaimana kualitas & kesegaran bahannya?" value={productNote} onChange={e=>setProductNote(e.target.value)} />
            </>
          ) : (
            <>
              <div className="review-target"><div className="review-target__img review-target__img--store" /><div><p className="review-target__label">Nilai {order.supplierType}</p><p className="review-target__name">{order.supplierName}</p></div></div>
              <StarPicker value={storeRating} onChange={setStoreRating} />
              <textarea className="review-textarea" placeholder="Bagaimana pengalamanmu dengan penjualnya?" value={storeNote} onChange={e=>setStoreNote(e.target.value)} />
            </>
          )}
        </div>
        <div className="modal__foot">
          {step===1 ? (
            <><button className="btn btn--ghost" onClick={onClose}>Nanti Saja</button><button className="btn btn--primary" disabled={productRating===0} onClick={()=>setStep(2)}>Lanjut ke Ulasan {order.supplierType}</button></>
          ) : (
            <><button className="btn btn--ghost" onClick={()=>setStep(1)}>Kembali</button><button className="btn btn--primary" disabled={storeRating===0} onClick={()=>{setSubmitted(true);onSubmitted&&onSubmitted(order)}}>Kirim Ulasan</button></>
          )}
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   TOAST
   ============================================================ */
function Toast({ message, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2600); return ()=>clearTimeout(t) }, [message])
  return <div className="toast"><IconCheck width={16} height={16} /><span>{message}</span></div>
}

/* ============================================================
   MAIN PAGE — proper React component, no ReactDOM.createRoot
   ============================================================ */
export default function PesananSaya() {
  const navigate = useNavigate()
  const rawUser = localStorage.getItem('user') || sessionStorage.getItem('user')
  const user = rawUser ? JSON.parse(rawUser) : null
  const userName = user?.name || user?.email || 'Konsumen'

  const [orders, setOrders] = useState(INITIAL_ORDERS)
  const [filter, setFilter] = useState('Semua')
  const [modal, setModal] = useState({ type: null, order: null })
  const [toast, setToast] = useState(null)

  const filtered = filter === 'Semua' ? orders : orders.filter(o => o.status === filter)
  const closeModal = () => setModal({ type: null, order: null })

  const handleCancelConfirm = (order) => {
    setOrders(prev => prev.map(o => o === order ? { ...o, status:'Dibatalkan' } : o))
    closeModal()
    setToast(`Pesanan #${order.id} berhasil dibatalkan.`)
  }

  function handleLogout() {
    localStorage.removeItem('token'); localStorage.removeItem('user')
    sessionStorage.removeItem('token'); sessionStorage.removeItem('user')
    navigate('/login')
  }

  const NAV = [
    { to:'/pembeli/dashboard', icon:<IconHome />,   label:'Beranda'      },
    { to:'/pembeli/pesanan',   icon:<IconOrders />,  label:'Pesanan Saya' },
    { to:'/pembeli/favorit',   icon:<IconHeart />,   label:'Favorit'      },
    { to:'/pembeli/pengaturan',icon:<IconGear />,    label:'Pengaturan'   },
  ]

  return (
    <div className="pesanan-app">

      {/* ===== SIDEBAR ===== */}
      <aside className="umkm-sidebar">
        <div className="brand">
          <span className="brand__mark">🌿</span>
          <span className="brand__name">Tani<span className="brand__accent">ku</span></span>
        </div>

        <nav className="nav" aria-label="Navigasi utama">
          {NAV.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} end className={({ isActive }) => `nav__item${isActive?' nav__item--active':''}`}>
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
          <h1>Pesanan Saya</h1>
          <div className="filter-pills">
            {FILTERS.map(f => (
              <button key={f} className={`filter-pill${filter===f?' filter-pill--active':''}`} onClick={()=>setFilter(f)}>{f}</button>
            ))}
          </div>
        </div>

        <div className="order-list">
          {filtered.length === 0 ? (
            <div className="empty-state"><p>🗂️</p><p>Belum ada pesanan dengan status "{filter}".</p></div>
          ) : filtered.map((order, i) => (
            <OrderCard key={i} order={order}
              onDetail={o=>setModal({type:'detail',order:o})}
              onTrack={o=>setModal({type:'track',order:o})}
              onCancel={o=>setModal({type:'cancel',order:o})}
              onReorder={o=>setModal({type:'reorder',order:o})}
              onReview={o=>setModal({type:'review',order:o})}
            />
          ))}
        </div>
      </main>

      {/* ===== MODALS ===== */}
      {modal.type==='detail'  && <DetailModal  order={modal.order} onClose={closeModal} />}
      {modal.type==='track'   && <TrackModal   order={modal.order} onClose={closeModal} />}
      {modal.type==='cancel'  && <CancelModal  order={modal.order} onClose={closeModal} onConfirm={handleCancelConfirm} />}
      {modal.type==='reorder' && <ReorderModal order={modal.order} onClose={closeModal} onConfirm={()=>setToast('Berhasil ditambahkan ke keranjang.')} />}
      {modal.type==='review'  && <ReviewModal  order={modal.order} onClose={closeModal} onSubmitted={()=>setToast('Ulasan berhasil dikirim, terima kasih!')} />}

      {toast && <Toast message={toast} onDone={()=>setToast(null)} />}
    </div>
  )
}
