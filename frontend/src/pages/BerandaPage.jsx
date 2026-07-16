import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader.jsx'
import StatsGrid from '../components/dashboard/StatsGrid.jsx'
import ProductTable from '../components/dashboard/ProductTable.jsx'
import PerformancePanel from '../components/dashboard/PerformancePanel.jsx'
import NotificationPanel from '../components/dashboard/NotificationPanel.jsx'
import '../App.css'

const STATS = [
  { label: 'Pesanan Masuk', value: '10', footnote: 'Pesanan Baru' },
  { label: 'Stok Tersedia', value: '829,5 kg', footnote: 'Total Semua Produk' },
  { label: 'Pesanan Diproses', value: '2', footnote: 'Sedang diproses' },
  {
    label: 'Pendapatan Bulan Ini',
    value: 'Rp. 15.000.000',
    footnoteAccent: '+ 18 %',
    footnote: 'dari bulan lalu.',
  },
]

const PRODUCTS = [
  { emoji: '🥭', name: 'Matoa', stock: '1.250 kg', sold: '850 kg', price: 'Rp. 28.000' },
  { emoji: '🥑', name: 'Alpukat Mentega', stock: '900 kg', sold: '620 kg', price: 'Rp. 22.000' },
  { emoji: '🍍', name: 'Nanas Madu', stock: '750 kg', sold: '410 kg', price: 'Rp. 16.000' },
]

export default function BerandaPage() {
  const navigate = useNavigate()

  return (
    <>
      <PageHeader
        supplierName="CV. Matoa Papua Sentosa"
        onAddProduct={() => navigate('/tambah-produk')}
      />

      <StatsGrid stats={STATS} />

      <div className="app__grid">
        <ProductTable
          products={PRODUCTS}
          onManage={(product) => alert(`Kelola produk: ${product.name}`)}
        />

        <div className="app__side">
          <PerformancePanel rating={4.8} maxRating={5} />
          <NotificationPanel notifications={[]} />
        </div>
      </div>
    </>
  )
}
