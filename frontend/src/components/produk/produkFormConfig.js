export const KATEGORI_OPTIONS = [
  { value: 'buah',    label: 'Buah-buahan' },
  { value: 'sayur',   label: 'Sayuran' },
  { value: 'rempah',  label: 'Rempah & Bumbu' },
  { value: 'lainnya', label: 'Lainnya' },
]

export const STORAGE_OPTIONS = [
  { value: 'suhu_ruang', label: 'Suhu Ruang' },
  { value: 'kulkas',     label: 'Kulkas / Pendingin' },
  { value: 'vakum',      label: 'Vakum / Sealed' },
]

export const INITIAL_FORM = {
  namaProduk:    '',
  kategori:      '',
  deskripsi:     '',
  harga:         '',
  stok:          '',
  minimumOrder:  '',
  lokasiAsal:    '',
  tanggalPanen:  '',
  storageMethod: '',
  hygienic:      true,
  pengiriman:    '',
}
