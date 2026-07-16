// Data pesanan (mock). Nantinya tinggal diganti dengan hasil fetch dari API.

export const ORDER_STATUS = {
  menunggu: 'Menunggu Konfirmasi',
  diproses: 'Diproses',
  dikirim: 'Dikirim',
  selesai: 'Selesai',
  dibatalkan: 'Dibatalkan',
}

export const ORDERS = [
  {
    id: 'ORD-3021',
    buyer: 'Budi Santoso',
    kota: 'Bandung',
    tanggal: '15 Jul 2026',
    waktu: '09:32',
    status: 'menunggu',
    pembayaran: 'Transfer Bank BCA',
    alamat: 'Jl. Cihampelas No. 45, Coblong, Bandung, Jawa Barat 40131',
    catatan: 'Tolong dikemas rapat, untuk dikirim luar kota.',
    items: [
      { emoji: '🥭', name: 'Matoa', qty: 25, unit: 'kg', harga: 28000 },
      { emoji: '🍍', name: 'Nanas Madu', qty: 10, unit: 'kg', harga: 12000 },
    ],
    ongkir: 45000,
  },
  {
    id: 'ORD-3020',
    buyer: 'Siti Rahma',
    kota: 'Jakarta Selatan',
    tanggal: '15 Jul 2026',
    waktu: '08:10',
    status: 'diproses',
    pembayaran: 'QRIS',
    alamat: 'Jl. Fatmawati Raya No. 12, Cilandak, Jakarta Selatan 12430',
    catatan: '',
    items: [
      { emoji: '🥑', name: 'Alpukat Mentega', qty: 15, unit: 'kg', harga: 22000 },
    ],
    ongkir: 32000,
  },
  {
    id: 'ORD-3019',
    buyer: 'Andi Wijaya',
    kota: 'Surabaya',
    tanggal: '14 Jul 2026',
    waktu: '17:45',
    status: 'dikirim',
    pembayaran: 'Transfer Bank Mandiri',
    alamat: 'Jl. Diponegoro No. 78, Wonokromo, Surabaya, Jawa Timur 60241',
    catatan: 'Kirim pagi hari jika memungkinkan.',
    items: [
      { emoji: '🍫', name: 'Kakao Fermentasi', qty: 20, unit: 'kg', harga: 35000 },
      { emoji: '🌶️', name: 'Cabai Rawit', qty: 8, unit: 'kg', harga: 55000 },
    ],
    ongkir: 58000,
  },
  {
    id: 'ORD-3018',
    buyer: 'Dewi Lestari',
    kota: 'Yogyakarta',
    tanggal: '14 Jul 2026',
    waktu: '14:22',
    status: 'selesai',
    pembayaran: 'QRIS',
    alamat: 'Jl. Kaliurang KM 5, Sleman, Yogyakarta 55281',
    catatan: '',
    items: [
      { emoji: '🟣', name: 'Manggis', qty: 12, unit: 'kg', harga: 30000 },
    ],
    ongkir: 27000,
  },
  {
    id: 'ORD-3017',
    buyer: 'Rudi Hartono',
    kota: 'Semarang',
    tanggal: '13 Jul 2026',
    waktu: '11:05',
    status: 'selesai',
    pembayaran: 'Transfer Bank BNI',
    alamat: 'Jl. Pandanaran No. 20, Semarang Selatan, Jawa Tengah 50241',
    catatan: 'Tolong sertakan nota pembelian.',
    items: [
      { emoji: '🍅', name: 'Tomat', qty: 30, unit: 'kg', harga: 10000 },
      { emoji: '🥬', name: 'Sawi Hijau', qty: 15, unit: 'kg', harga: 8000 },
    ],
    ongkir: 35000,
  },
  {
    id: 'ORD-3016',
    buyer: 'Maya Anggraini',
    kota: 'Malang',
    tanggal: '13 Jul 2026',
    waktu: '09:50',
    status: 'dibatalkan',
    pembayaran: 'QRIS',
    alamat: 'Jl. Ijen No. 33, Klojen, Malang, Jawa Timur 65119',
    catatan: 'Dibatalkan pembeli karena salah pesan jumlah.',
    items: [
      { emoji: '🧄', name: 'Bawang Putih', qty: 5, unit: 'kg', harga: 40000 },
    ],
    ongkir: 22000,
  },
  {
    id: 'ORD-3015',
    buyer: 'Fajar Nugroho',
    kota: 'Bogor',
    tanggal: '12 Jul 2026',
    waktu: '16:15',
    status: 'dikirim',
    pembayaran: 'Transfer Bank BCA',
    alamat: 'Jl. Pajajaran No. 88, Bogor Tengah, Jawa Barat 16143',
    catatan: '',
    items: [
      { emoji: '🥥', name: 'Kelapa Muda', qty: 40, unit: 'kg', harga: 15000 },
    ],
    ongkir: 30000,
  },
  {
    id: 'ORD-3014',
    buyer: 'Rina Marlina',
    kota: 'Depok',
    tanggal: '12 Jul 2026',
    waktu: '10:40',
    status: 'menunggu',
    pembayaran: 'QRIS',
    alamat: 'Jl. Margonda Raya No. 100, Beji, Depok, Jawa Barat 16424',
    catatan: 'Konfirmasi dulu sebelum kirim, stok terbatas.',
    items: [
      { emoji: '🍯', name: 'Madu Hutan', qty: 6, unit: 'kg', harga: 120000 },
      { emoji: '🍋', name: 'Jeruk Nipis', qty: 10, unit: 'kg', harga: 18000 },
    ],
    ongkir: 28000,
  },
  {
    id: 'ORD-3013',
    buyer: 'Eko Prasetyo',
    kota: 'Solo',
    tanggal: '11 Jul 2026',
    waktu: '13:30',
    status: 'selesai',
    pembayaran: 'Transfer Bank Mandiri',
    alamat: 'Jl. Slamet Riyadi No. 210, Laweyan, Surakarta, Jawa Tengah 57141',
    catatan: '',
    items: [
      { emoji: '🥭', name: 'Matoa', qty: 18, unit: 'kg', harga: 28000 },
    ],
    ongkir: 40000,
  },
  {
    id: 'ORD-3012',
    buyer: 'Wulan Sari',
    kota: 'Cirebon',
    tanggal: '11 Jul 2026',
    waktu: '08:05',
    status: 'diproses',
    pembayaran: 'QRIS',
    alamat: 'Jl. Siliwangi No. 55, Kejaksan, Cirebon, Jawa Barat 45123',
    catatan: 'Mohon dikirim bersama pesanan sebelumnya jika ada.',
    items: [
      { emoji: '🍍', name: 'Nanas Madu', qty: 22, unit: 'kg', harga: 12000 },
      { emoji: '🌶️', name: 'Cabai Rawit', qty: 5, unit: 'kg', harga: 55000 },
    ],
    ongkir: 33000,
  },
  {
    id: 'ORD-3011',
    buyer: 'Hendra Gunawan',
    kota: 'Tangerang',
    tanggal: '10 Jul 2026',
    waktu: '15:12',
    status: 'selesai',
    pembayaran: 'Transfer Bank BCA',
    alamat: 'Jl. Sudirman No. 9, Tangerang, Banten 15117',
    catatan: '',
    items: [
      { emoji: '🥑', name: 'Alpukat Mentega', qty: 20, unit: 'kg', harga: 22000 },
    ],
    ongkir: 25000,
  },
  {
    id: 'ORD-3010',
    buyer: 'Nurul Hidayah',
    kota: 'Bekasi',
    tanggal: '9 Jul 2026',
    waktu: '12:48',
    status: 'dibatalkan',
    pembayaran: 'QRIS',
    alamat: 'Jl. Ahmad Yani No. 15, Bekasi Selatan, Jawa Barat 17141',
    catatan: 'Stok habis saat konfirmasi.',
    items: [
      { emoji: '🥬', name: 'Sawi Hijau', qty: 12, unit: 'kg', harga: 8000 },
    ],
    ongkir: 24000,
  },
]

export function getOrderById(id) {
  return ORDERS.find((order) => order.id === id)
}

export function getOrderSubtotal(order) {
  return order.items.reduce((sum, item) => sum + item.qty * item.harga, 0)
}

export function getOrderTotal(order) {
  return getOrderSubtotal(order) + order.ongkir
}

export function formatRupiah(value) {
  return `Rp ${value.toLocaleString('id-ID')}`
}
