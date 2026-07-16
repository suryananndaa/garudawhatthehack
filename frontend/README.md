# Taniku - Dashboard Supplier

Halaman "Beranda" dashboard supplier Taniku, dibuat dengan Vite + React.
CSS dipisah per komponen (setiap komponen punya file `.css` sendiri di `src/components/`).

## Struktur folder

```
taniku-dashboard/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── leaf.svg
└── src/
    ├── main.jsx
    ├── index.css          # reset + design tokens (warna, font, radius)
    ├── App.jsx            # menyusun layout halaman
    ├── App.css
    └── components/
        ├── Sidebar.jsx / .css
        ├── PageHeader.jsx / .css      (judul "Halo, ..." + tombol Tambah Produk)
        ├── StatsGrid.jsx / .css       (grid 4 kartu ringkasan)
        ├── StatCard.jsx / .css        (satu kartu ringkasan)
        ├── ProductTable.jsx / .css    (tabel Produk Terlaris)
        ├── PerformancePanel.jsx / .css (Performa Toko / rating bintang)
        └── NotificationPanel.jsx / .css
```

## Cara menjalankan

```bash
npm install
npm run dev
```

Lalu buka URL yang muncul di terminal (biasanya `http://localhost:5173`).

Untuk build production:

```bash
npm run build
npm run preview
```

## Kustomisasi

- Data statis (angka statistik, daftar produk, dsb) ada di `src/App.jsx` — tinggal
  ganti array `STATS` dan `PRODUCTS`, atau sambungkan ke API/backend sungguhan.
- Warna & font utama diatur lewat CSS variable di `src/index.css` (`--color-forest-*`,
  `--font-display`, dll) supaya gampang diganti tanpa menyentuh tiap komponen.
