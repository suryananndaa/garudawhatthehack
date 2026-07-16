import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader.jsx'
import StatsGrid from '../components/dashboard/StatsGrid.jsx'
import Tabs from '../components/shared/Tabs.jsx'
import Pagination from '../components/shared/Pagination.jsx'
import OrdersToolbar from '../components/orders/OrdersToolbar.jsx'
import OrdersTable from '../components/orders/OrdersTable.jsx'
import { ORDERS, getOrderTotal, formatRupiah } from '../data/orders.js'
import './PesananPage.css'

const PAGE_SIZE = 6

const SORTERS = {
  terbaru: (a, b) => new Date(b.tanggal) - new Date(a.tanggal) || b.id.localeCompare(a.id),
  terlama: (a, b) => new Date(a.tanggal) - new Date(b.tanggal) || a.id.localeCompare(b.id),
  'total-tertinggi': (a, b) => getOrderTotal(b) - getOrderTotal(a),
  'total-terendah': (a, b) => getOrderTotal(a) - getOrderTotal(b),
}

export default function PesananPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('terbaru')
  const [activeTab, setActiveTab] = useState('semua')
  const [page, setPage] = useState(1)

  const counts = useMemo(() => {
    return ORDERS.reduce(
      (acc, order) => {
        acc.semua += 1
        acc[order.status] = (acc[order.status] ?? 0) + 1
        return acc
      },
      { semua: 0 }
    )
  }, [])

  const tabs = [
    { key: 'semua', label: 'Semua', count: counts.semua },
    { key: 'menunggu', label: 'Menunggu Konfirmasi', count: counts.menunggu ?? 0 },
    { key: 'diproses', label: 'Diproses', count: counts.diproses ?? 0 },
    { key: 'dikirim', label: 'Dikirim', count: counts.dikirim ?? 0 },
    { key: 'selesai', label: 'Selesai', count: counts.selesai ?? 0 },
    { key: 'dibatalkan', label: 'Dibatalkan', count: counts.dibatalkan ?? 0 },
  ]

  const stats = useMemo(() => {
    const pendapatanSelesai = ORDERS.filter((o) => o.status === 'selesai').reduce(
      (sum, o) => sum + getOrderTotal(o),
      0
    )
    return [
      {
        label: 'Total Pesanan',
        value: ORDERS.length,
        footnote: 'sepanjang bulan ini',
      },
      {
        label: 'Menunggu Konfirmasi',
        value: counts.menunggu ?? 0,
        footnote: 'perlu direspon segera',
        footnoteAccent: counts.menunggu ? '●' : undefined,
      },
      {
        label: 'Sedang Diproses',
        value: (counts.diproses ?? 0) + (counts.dikirim ?? 0),
        footnote: 'diproses & dikirim',
      },
      {
        label: 'Pendapatan Selesai',
        value: formatRupiah(pendapatanSelesai),
        footnote: `dari ${counts.selesai ?? 0} pesanan selesai`,
      },
    ]
  }, [counts])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return ORDERS.filter((order) => {
      const matchesSearch =
        !query || order.id.toLowerCase().includes(query) || order.buyer.toLowerCase().includes(query)
      const matchesTab = activeTab === 'semua' || order.status === activeTab
      return matchesSearch && matchesTab
    }).sort(SORTERS[sort])
  }, [search, activeTab, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const updateSearch = (value) => {
    setSearch(value)
    setPage(1)
  }

  const updateTab = (key) => {
    setActiveTab(key)
    setPage(1)
  }

  return (
    <div className="pesanan">
      <PageHeader
        title="Pesanan"
        subtitle="Pantau dan kelola pesanan yang masuk dari pembeli."
        ctaLabel="Ekspor Data"
        ctaIcon={Download}
        onAddProduct={() => alert('Ekspor data pesanan (belum terhubung ke backend).')}
      />

      <StatsGrid stats={stats} />

      <section className="pesanan__card">
        <OrdersToolbar search={search} onSearchChange={updateSearch} sort={sort} onSortChange={setSort} />

        <Tabs tabs={tabs} active={activeTab} onChange={updateTab} ariaLabel="Filter status pesanan" />

        <OrdersTable orders={paginated} onView={(order) => navigate(`/pesanan/${order.id}`)} />

        <Pagination
          page={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          itemLabel="pesanan"
        />
      </section>
    </div>
  )
}
