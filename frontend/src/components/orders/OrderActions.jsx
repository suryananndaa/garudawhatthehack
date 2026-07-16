import { Check, X, Truck, PackageCheck } from 'lucide-react'
import './OrderActions.css'

export default function OrderActions({ status, onAdvance, onCancel }) {
  if (status === 'menunggu') {
    return (
      <div className="order-actions">
        <button className="order-actions__primary" onClick={() => onAdvance('diproses')}>
          <Check size={16} strokeWidth={2.5} />
          Terima &amp; Proses Pesanan
        </button>
        <button className="order-actions__danger" onClick={() => onCancel()}>
          <X size={16} strokeWidth={2.5} />
          Tolak Pesanan
        </button>
      </div>
    )
  }

  if (status === 'diproses') {
    return (
      <div className="order-actions">
        <button className="order-actions__primary" onClick={() => onAdvance('dikirim')}>
          <Truck size={16} strokeWidth={2.5} />
          Tandai Sudah Dikirim
        </button>
      </div>
    )
  }

  if (status === 'dikirim') {
    return (
      <div className="order-actions">
        <button className="order-actions__primary" onClick={() => onAdvance('selesai')}>
          <PackageCheck size={16} strokeWidth={2.5} />
          Tandai Selesai
        </button>
      </div>
    )
  }

  return (
    <p className="order-actions__done">
      {status === 'selesai'
        ? 'Pesanan ini sudah selesai. Tidak ada aksi lebih lanjut.'
        : 'Pesanan ini telah dibatalkan.'}
    </p>
  )
}
