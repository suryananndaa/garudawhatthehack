// Data tawaran dari pembeli — petani bisa terima atau tolak
export const TAWARAN = [
  { id: 'TAW-001', pembeli: 'UMKM Makmur Jaya', kontak: '0811-1234-5678', produk: 'Matoa', jumlah: '150 kg', hargaTawar: 'Rp 25.000/kg', total: 'Rp 3.750.000', tanggal: '2026-07-16', jarak: '12 km', catatan: 'Butuh pengiriman sebelum tanggal 20 Juli.', status: 'menunggu' },
  { id: 'TAW-002', pembeli: 'UMKM Sari Bumi', kontak: '0812-2345-6789', produk: 'Alpukat Mentega', jumlah: '80 kg', hargaTawar: 'Rp 20.000/kg', total: 'Rp 1.600.000', tanggal: '2026-07-16', jarak: '35 km', catatan: '', status: 'menunggu' },
  { id: 'TAW-003', pembeli: 'UMKM Dapur Nusantara', kontak: '0813-3456-7890', produk: 'Nanas Madu', jumlah: '200 kg', hargaTawar: 'Rp 14.000/kg', total: 'Rp 2.800.000', tanggal: '2026-07-15', jarak: '8 km', catatan: 'Stok harus fresh, panen max 3 hari lalu.', status: 'menunggu' },
  { id: 'TAW-004', pembeli: 'UMKM Berkah Tani', kontak: '0814-4567-8901', produk: 'Matoa', jumlah: '500 kg', hargaTawar: 'Rp 26.000/kg', total: 'Rp 13.000.000', tanggal: '2026-07-15', jarak: '62 km', catatan: 'Jumlah besar, bisa negosiasi harga.', status: 'menunggu' },
  { id: 'TAW-005', pembeli: 'UMKM Rasa Kampung', kontak: '0815-5678-9012', produk: 'Alpukat Mentega', jumlah: '50 kg', hargaTawar: 'Rp 21.000/kg', total: 'Rp 1.050.000', tanggal: '2026-07-14', jarak: '5 km', catatan: '', status: 'ditolak' },
  { id: 'TAW-006', pembeli: 'UMKM Hijau Lestari', kontak: '0816-6789-0123', produk: 'Nanas Madu', jumlah: '120 kg', hargaTawar: 'Rp 15.000/kg', total: 'Rp 1.800.000', tanggal: '2026-07-14', jarak: '18 km', catatan: '', status: 'diterima' },
]

// Data pengiriman (pesanan yang sudah diterima petani)
export const PENGIRIMAN = [
  { id: 'ORD-001', pembeli: 'UMKM Berkah Jaya', kontak: '0812-1111-2222', produk: 'Matoa', jumlah: '300 kg', harga: 'Rp 28.000/kg', total: 'Rp 8.400.000', tanggal: '2026-07-14', alamat: 'Jl. Merdeka No. 12, Jakarta Selatan', tracking: 'selesai' },
  { id: 'ORD-002', pembeli: 'UMKM Sari Rasa', kontak: '0813-2222-3333', produk: 'Alpukat Mentega', jumlah: '200 kg', harga: 'Rp 22.000/kg', total: 'Rp 4.400.000', tanggal: '2026-07-13', alamat: 'Jl. Sudirman No. 45, Bandung', tracking: 'selesai' },
  { id: 'ORD-003', pembeli: 'UMKM Segar Alami', kontak: '0814-3333-4444', produk: 'Nanas Madu', jumlah: '137.5 kg', harga: 'Rp 16.000/kg', total: 'Rp 2.200.000', tanggal: '2026-07-12', alamat: 'Jl. Gatot Subroto No. 7, Surabaya', tracking: 'selesai' },
  { id: 'ORD-004', pembeli: 'UMKM Rejeki Barokah', kontak: '0815-4444-5555', produk: 'Matoa', jumlah: '50 kg', harga: 'Rp 28.000/kg', total: 'Rp 1.400.000', tanggal: '2026-07-15', alamat: 'Jl. Ahmad Yani No. 3, Makassar', tracking: 'dalam_pengiriman' },
  { id: 'ORD-005', pembeli: 'UMKM Cita Rasa Nusantara', kontak: '0816-5555-6666', produk: 'Alpukat Mentega', jumlah: '30 kg', harga: 'Rp 22.000/kg', total: 'Rp 660.000', tanggal: '2026-07-15', alamat: 'Jl. Diponegoro No. 88, Yogyakarta', tracking: 'diproses' },
  { id: 'ORD-006', pembeli: 'UMKM Tani Makmur', kontak: '0817-6666-7777', produk: 'Nanas Madu', jumlah: '25 kg', harga: 'Rp 16.000/kg', total: 'Rp 400.000', tanggal: '2026-07-16', alamat: 'Jl. Pemuda No. 21, Semarang', tracking: 'diterima' },
]

// Urutan tracking
export const TRACKING_STEPS = [
  { key: 'diterima',          label: 'Pesanan Diterima',   desc: 'Petani telah menerima pesanan' },
  { key: 'diproses',          label: 'Sedang Diproses',    desc: 'Produk sedang disiapkan' },
  { key: 'dalam_pengiriman',  label: 'Dalam Pengiriman',   desc: 'Produk sedang dalam perjalanan' },
  { key: 'selesai',           label: 'Selesai',            desc: 'Pesanan telah diterima pembeli' },
]

export const TRACKING_NEXT = {
  diterima:         'diproses',
  diproses:         'dalam_pengiriman',
  dalam_pengiriman: 'selesai',
  selesai:          null,
}
