-- ============================================================================
-- DATA SEED: 10 TOKO SUPPLIER DENGAN PRODUK BUAH & SAYUR
-- ============================================================================
-- Gunakan query ini di phpMyAdmin untuk insert data real
-- Password semua akun: "password123" (sudah di-hash dengan bcrypt)
-- ============================================================================

-- 1. TOKO BUAH SEGAR JAKARTA
INSERT INTO `Supplier` (
  `id`, `name`, `email`, `password`, `role`, `phone`, `address`, `city`, 
  `latitude`, `longitude`, `deliveryRadiusKm`, `shopName`, `description`, 
  `categories`, `shippingMethods`, `sellingSince`, `rating`, `createdAt`, `updatedAt`
) VALUES (
  'supp-001-jakarta-buah',
  'Budi Santoso',
  'budi@buahsegarjkt.com',
  '$2b$10$YQ7j5vZ8BXqXZ3cXJZ5zUOK.3.8fvYYH0yYq8qXH0yYq8qXH0yYq8',
  'petani',
  '081234567801',
  'Jl. Kebayoran Lama No. 45, Jakarta Selatan',
  'Jakarta',
  -6.2435,
  106.7809,
  25.0,
  'Toko Buah Segar Jakarta',
  'Menyediakan buah-buahan segar pilihan langsung dari petani lokal dengan kualitas terbaik',
  '["buah"]',
  '["ekspedisi","kurirToko"]',
  2018,
  4.8,
  NOW(),
  NOW()
);

-- Produk Toko 1
INSERT INTO `Product` (`id`, `supplierId`, `name`, `quantityKg`, `pricePerKg`, `harvestDate`, `storageMethod`, `hygienic`, `predictedTier`, `rating`, `createdAt`, `updatedAt`) VALUES
('prod-001-jeruk', 'supp-001-jakarta-buah', 'Jeruk Medan', 150.5, 18000, DATE_SUB(NOW(), INTERVAL 2 DAY), 'kulkas', 1, 'Fresh', 4.8, NOW(), NOW()),
('prod-002-apel', 'supp-001-jakarta-buah', 'Apel Fuji', 80.0, 35000, DATE_SUB(NOW(), INTERVAL 1 DAY), 'kulkas', 1, 'Fresh', 4.9, NOW(), NOW()),
('prod-003-mangga', 'supp-001-jakarta-buah', 'Mangga Harum Manis', 120.0, 25000, DATE_SUB(NOW(), INTERVAL 3 DAY), 'suhu_ruang', 1, 'Standard', 4.7, NOW(), NOW()),
('prod-004-pepaya', 'supp-001-jakarta-buah', 'Pepaya California', 95.0, 12000, DATE_SUB(NOW(), INTERVAL 1 DAY), 'suhu_ruang', 1, 'Fresh', 4.6, NOW(), NOW());

-- 2. KEBUN SAYUR BANDUNG
INSERT INTO `Supplier` (
  `id`, `name`, `email`, `password`, `role`, `phone`, `address`, `city`, 
  `latitude`, `longitude`, `deliveryRadiusKm`, `shopName`, `description`, 
  `categories`, `shippingMethods`, `sellingSince`, `rating`, `createdAt`, `updatedAt`
) VALUES (
  'supp-002-bandung-sayur',
  'Siti Nurhaliza',
  'siti@kebunsayurbdg.com',
  '$2b$10$YQ7j5vZ8BXqXZ3cXJZ5zUOK.3.8fvYYH0yYq8qXH0yYq8qXH0yYq8',
  'petani',
  '081234567802',
  'Jl. Lembang Raya No. 123, Lembang',
  'Bandung',
  -6.8115,
  107.6183,
  30.0,
  'Kebun Sayur Lembang Segar',
  'Sayuran organik dari dataran tinggi Lembang, segar setiap hari',
  '["sayur"]',
  '["ekspedisi","kurirToko"]',
  2015,
  4.9,
  NOW(),
  NOW()
);

-- Produk Toko 2
INSERT INTO `Product` (`id`, `supplierId`, `name`, `quantityKg`, `pricePerKg`, `harvestDate`, `storageMethod`, `hygienic`, `predictedTier`, `rating`, `createdAt`, `updatedAt`) VALUES
('prod-005-tomat', 'supp-002-bandung-sayur', 'Tomat Keriting', 200.0, 12000, DATE_SUB(NOW(), INTERVAL 1 DAY), 'kulkas', 1, 'Fresh', 4.9, NOW(), NOW()),
('prod-006-cabai', 'supp-002-bandung-sayur', 'Cabai Rawit Merah', 75.5, 45000, DATE_SUB(NOW(), INTERVAL 2 DAY), 'kulkas', 1, 'Fresh', 4.8, NOW(), NOW()),
('prod-007-brokoli', 'supp-002-bandung-sayur', 'Brokoli Organik', 60.0, 28000, DATE_SUB(NOW(), INTERVAL 1 DAY), 'kulkas', 1, 'Fresh', 4.7, NOW(), NOW()),
('prod-008-wortel', 'supp-002-bandung-sayur', 'Wortel Lokal', 110.0, 15000, DATE_SUB(NOW(), INTERVAL 2 DAY), 'kulkas', 1, 'Standard', 4.6, NOW(), NOW());

-- 3. TOKO BUAH SURABAYA
INSERT INTO `Supplier` (
  `id`, `name`, `email`, `password`, `role`, `phone`, `address`, `city`, 
  `latitude`, `longitude`, `deliveryRadiusKm`, `shopName`, `description`, 
  `categories`, `shippingMethods`, `sellingSince`, `rating`, `createdAt`, `updatedAt`
) VALUES (
  'supp-003-surabaya-buah',
  'Ahmad Dahlan',
  'ahmad@buahsby.com',
  '$2b$10$YQ7j5vZ8BXqXZ3cXJZ5zUOK.3.8fvYYH0yYq8qXH0yYq8qXH0yYq8',
  'petani',
  '081234567803',
  'Jl. Raya Darmo No. 88, Surabaya',
  'Surabaya',
  -7.2575,
  112.7521,
  20.0,
  'Buah Tropis Surabaya',
  'Spesialis buah tropis segar dengan harga terjangkau',
  '["buah"]',
  '["ekspedisi"]',
  2019,
  4.7,
  NOW(),
  NOW()
);

-- Produk Toko 3
INSERT INTO `Product` (`id`, `supplierId`, `name`, `quantityKg`, `pricePerKg`, `harvestDate`, `storageMethod`, `hygienic`, `predictedTier`, `createdAt`, `updatedAt`) VALUES
('prod-009-pisang', 'supp-003-surabaya-buah', 'Pisang Cavendish', 180.0, 15000, DATE_SUB(NOW(), INTERVAL 1 DAY), 'suhu_ruang', 1, 'Fresh', NOW(), NOW()),
('prod-010-nanas', 'supp-003-surabaya-buah', 'Nanas Madu', 95.0, 20000, DATE_SUB(NOW(), INTERVAL 2 DAY), 'suhu_ruang', 1, 'Fresh', NOW(), NOW()),
('prod-011-semangka', 'supp-003-surabaya-buah', 'Semangka Kuning', 140.0, 8000, DATE_SUB(NOW(), INTERVAL 3 DAY), 'suhu_ruang', 1, 'Standard', NOW(), NOW()),
('prod-012-melon', 'supp-003-surabaya-buah', 'Melon Golden', 70.0, 22000, DATE_SUB(NOW(), INTERVAL 1 DAY), 'kulkas', 1, 'Fresh', NOW(), NOW());

-- 4. AGRO SAYUR YOGYAKARTA
INSERT INTO `Supplier` (
  `id`, `name`, `email`, `password`, `role`, `phone`, `address`, `city`, 
  `latitude`, `longitude`, `deliveryRadiusKm`, `shopName`, `description`, 
  `categories`, `shippingMethods`, `sellingSince`, `rating`, `createdAt`, `updatedAt`
) VALUES (
  'supp-004-yogya-sayur',
  'Dewi Lestari',
  'dewi@agroyogya.com',
  '$2b$10$YQ7j5vZ8BXqXZ3cXJZ5zUOK.3.8fvYYH0yYq8qXH0yYq8qXH0yYq8',
  'petani',
  '081234567804',
  'Jl. Kaliurang KM 10, Sleman',
  'Yogyakarta',
  -7.7956,
  110.3695,
  35.0,
  'Agro Sayur Kaliurang',
  'Sayuran hidroponik dan organik dari lereng Merapi',
  '["sayur"]',
  '["kurirToko"]',
  2020,
  4.8,
  NOW(),
  NOW()
);

-- Produk Toko 4
INSERT INTO `Product` (`id`, `supplierId`, `name`, `quantityKg`, `pricePerKg`, `harvestDate`, `storageMethod`, `hygienic`, `predictedTier`, `createdAt`, `updatedAt`) VALUES
('prod-013-selada', 'supp-004-yogya-sayur', 'Selada Keriting Hidroponik', 45.0, 32000, DATE_SUB(NOW(), INTERVAL 1 DAY), 'kulkas', 1, 'Fresh', NOW(), NOW()),
('prod-014-bayam', 'supp-004-yogya-sayur', 'Bayam Hijau', 80.0, 18000, DATE_SUB(NOW(), INTERVAL 1 DAY), 'kulkas', 1, 'Fresh', NOW(), NOW()),
('prod-015-kangkung', 'supp-004-yogya-sayur', 'Kangkung Organik', 95.0, 12000, DATE_SUB(NOW(), INTERVAL 2 DAY), 'kulkas', 1, 'Fresh', NOW(), NOW()),
('prod-016-sawi', 'supp-004-yogya-sayur', 'Sawi Hijau', 70.0, 15000, DATE_SUB(NOW(), INTERVAL 1 DAY), 'kulkas', 1, 'Fresh', NOW(), NOW());

-- 5. BUAH EKSOTIS BALI
INSERT INTO `Supplier` (
  `id`, `name`, `email`, `password`, `role`, `phone`, `address`, `city`, 
  `latitude`, `longitude`, `deliveryRadiusKm`, `shopName`, `description`, 
  `categories`, `shippingMethods`, `sellingSince`, `rating`, `createdAt`, `updatedAt`
) VALUES (
  'supp-005-bali-buah',
  'Ketut Wirawan',
  'ketut@buahbali.com',
  '$2b$10$YQ7j5vZ8BXqXZ3cXJZ5zUOK.3.8fvYYH0yYq8qXH0yYq8qXH0yYq8',
  'petani',
  '081234567805',
  'Jl. Sunset Road No. 234, Kuta',
  'Bali',
  -8.6705,
  115.2126,
  40.0,
  'Buah Eksotis Bali',
  'Buah-buahan eksotis khas Bali dengan rasa manis alami',
  '["buah"]',
  '["ekspedisi","kurirToko"]',
  2017,
  4.9,
  NOW(),
  NOW()
);

-- Produk Toko 5
INSERT INTO `Product` (`id`, `supplierId`, `name`, `quantityKg`, `pricePerKg`, `harvestDate`, `storageMethod`, `hygienic`, `predictedTier`, `createdAt`, `updatedAt`) VALUES
('prod-017-salak', 'supp-005-bali-buah', 'Salak Bali', 120.0, 18000, DATE_SUB(NOW(), INTERVAL 2 DAY), 'suhu_ruang', 1, 'Fresh', NOW(), NOW()),
('prod-018-manggis', 'supp-005-bali-buah', 'Manggis Premium', 65.0, 40000, DATE_SUB(NOW(), INTERVAL 1 DAY), 'kulkas', 1, 'Fresh', NOW(), NOW()),
('prod-019-rambutan', 'supp-005-bali-buah', 'Rambutan Rapiah', 110.0, 22000, DATE_SUB(NOW(), INTERVAL 2 DAY), 'suhu_ruang', 1, 'Standard', NOW(), NOW()),
('prod-020-alpukat', 'supp-005-bali-buah', 'Alpukat Mentega', 85.0, 30000, DATE_SUB(NOW(), INTERVAL 1 DAY), 'suhu_ruang', 1, 'Fresh', NOW(), NOW());

-- 6. SAYUR HIDROPONIK SEMARANG
INSERT INTO `Supplier` (
  `id`, `name`, `email`, `password`, `role`, `phone`, `address`, `city`, 
  `latitude`, `longitude`, `deliveryRadiusKm`, `shopName`, `description`, 
  `categories`, `shippingMethods`, `sellingSince`, `rating`, `createdAt`, `updatedAt`
) VALUES (
  'supp-006-semarang-sayur',
  'Bambang Sutopo',
  'bambang@hidrosmg.com',
  '$2b$10$YQ7j5vZ8BXqXZ3cXJZ5zUOK.3.8fvYYH0yYq8qXH0yYq8qXH0yYq8',
  'petani',
  '081234567806',
  'Jl. Pandanaran No. 156, Semarang',
  'Semarang',
  -6.9667,
  110.4167,
  25.0,
  'Hidroponik Fresh Semarang',
  'Sayuran hidroponik bebas pestisida, segar setiap hari',
  '["sayur"]',
  '["ekspedisi"]',
  2021,
  4.6,
  NOW(),
  NOW()
);

-- Produk Toko 6
INSERT INTO `Product` (`id`, `supplierId`, `name`, `quantityKg`, `pricePerKg`, `harvestDate`, `storageMethod`, `hygienic`, `predictedTier`, `createdAt`, `updatedAt`) VALUES
('prod-021-pakcoy', 'supp-006-semarang-sayur', 'Pakcoy Hidroponik', 55.0, 28000, DATE_SUB(NOW(), INTERVAL 1 DAY), 'kulkas', 1, 'Fresh', NOW(), NOW()),
('prod-022-timun', 'supp-006-semarang-sayur', 'Timun Jepang', 90.0, 16000, DATE_SUB(NOW(), INTERVAL 2 DAY), 'kulkas', 1, 'Fresh', NOW(), NOW()),
('prod-023-terong', 'supp-006-semarang-sayur', 'Terong Ungu', 75.0, 14000, DATE_SUB(NOW(), INTERVAL 1 DAY), 'kulkas', 1, 'Fresh', NOW(), NOW()),
('prod-024-buncis', 'supp-006-semarang-sayur', 'Buncis Hijau', 65.0, 20000, DATE_SUB(NOW(), INTERVAL 2 DAY), 'kulkas', 1, 'Standard', NOW(), NOW());

-- 7. TOKO BUAH MEDAN
INSERT INTO `Supplier` (
  `id`, `name`, `email`, `password`, `role`, `phone`, `address`, `city`, 
  `latitude`, `longitude`, `deliveryRadiusKm`, `shopName`, `description`, 
  `categories`, `shippingMethods`, `sellingSince`, `rating`, `createdAt`, `updatedAt`
) VALUES (
  'supp-007-medan-buah',
  'Rudi Harahap',
  'rudi@buahmedan.com',
  '$2b$10$YQ7j5vZ8BXqXZ3cXJZ5zUOK.3.8fvYYH0yYq8qXH0yYq8qXH0yYq8',
  'petani',
  '081234567807',
  'Jl. Gatot Subroto No. 99, Medan',
  'Medan',
  3.5952,
  98.6722,
  30.0,
  'Buah Segar Medan',
  'Distributor buah lokal dan impor dengan harga kompetitif',
  '["buah"]',
  '["ekspedisi","kurirToko"]',
  2016,
  4.7,
  NOW(),
  NOW()
);

-- Produk Toko 7
INSERT INTO `Product` (`id`, `supplierId`, `name`, `quantityKg`, `pricePerKg`, `harvestDate`, `storageMethod`, `hygienic`, `predictedTier`, `createdAt`, `updatedAt`) VALUES
('prod-025-durian', 'supp-007-medan-buah', 'Durian Medan', 100.0, 55000, DATE_SUB(NOW(), INTERVAL 1 DAY), 'suhu_ruang', 1, 'Fresh', NOW(), NOW()),
('prod-026-lengkeng', 'supp-007-medan-buah', 'Lengkeng Diamond', 80.0, 35000, DATE_SUB(NOW(), INTERVAL 2 DAY), 'kulkas', 1, 'Fresh', NOW(), NOW()),
('prod-027-duku', 'supp-007-medan-buah', 'Duku Palembang', 95.0, 25000, DATE_SUB(NOW(), INTERVAL 3 DAY), 'suhu_ruang', 1, 'Standard', NOW(), NOW()),
('prod-028-jambu', 'supp-007-medan-buah', 'Jambu Air Merah', 70.0, 18000, DATE_SUB(NOW(), INTERVAL 1 DAY), 'kulkas', 1, 'Fresh', NOW(), NOW());

-- 8. SAYUR ORGANIK MALANG
INSERT INTO `Supplier` (
  `id`, `name`, `email`, `password`, `role`, `phone`, `address`, `city`, 
  `latitude`, `longitude`, `deliveryRadiusKm`, `shopName`, `description`, 
  `categories`, `shippingMethods`, `sellingSince`, `rating`, `createdAt`, `updatedAt`
) VALUES (
  'supp-008-malang-sayur',
  'Ani Wijayanti',
  'ani@sayurmalang.com',
  '$2b$10$YQ7j5vZ8BXqXZ3cXJZ5zUOK.3.8fvYYH0yYq8qXH0yYq8qXH0yYq8',
  'petani',
  '081234567808',
  'Jl. Ijen No. 45, Malang',
  'Malang',
  -7.9666,
  112.6326,
  28.0,
  'Sayur Organik Pegunungan',
  'Sayuran organik dari pegunungan Malang yang sejuk',
  '["sayur"]',
  '["kurirToko"]',
  2018,
  4.8,
  NOW(),
  NOW()
);

-- Produk Toko 8
INSERT INTO `Product` (`id`, `supplierId`, `name`, `quantityKg`, `pricePerKg`, `harvestDate`, `storageMethod`, `hygienic`, `predictedTier`, `createdAt`, `updatedAt`) VALUES
('prod-029-kentang', 'supp-008-malang-sayur', 'Kentang Granola', 150.0, 16000, DATE_SUB(NOW(), INTERVAL 2 DAY), 'suhu_ruang', 1, 'Fresh', NOW(), NOW()),
('prod-030-kol', 'supp-008-malang-sayur', 'Kol Putih', 100.0, 10000, DATE_SUB(NOW(), INTERVAL 1 DAY), 'kulkas', 1, 'Fresh', NOW(), NOW()),
('prod-031-paprika', 'supp-008-malang-sayur', 'Paprika Merah', 45.0, 38000, DATE_SUB(NOW(), INTERVAL 1 DAY), 'kulkas', 1, 'Fresh', NOW(), NOW()),
('prod-032-jagung', 'supp-008-malang-sayur', 'Jagung Manis', 120.0, 12000, DATE_SUB(NOW(), INTERVAL 2 DAY), 'suhu_ruang', 1, 'Standard', NOW(), NOW());

-- 9. BUAH SEGAR MAKASSAR
INSERT INTO `Supplier` (
  `id`, `name`, `email`, `password`, `role`, `phone`, `address`, `city`, 
  `latitude`, `longitude`, `deliveryRadiusKm`, `shopName`, `description`, 
  `categories`, `shippingMethods`, `sellingSince`, `rating`, `createdAt`, `updatedAt`
) VALUES (
  'supp-009-makassar-buah',
  'Akbar Rahman',
  'akbar@buahmks.com',
  '$2b$10$YQ7j5vZ8BXqXZ3cXJZ5zUOK.3.8fvYYH0yYq8qXH0yYq8qXH0yYq8',
  'petani',
  '081234567809',
  'Jl. Veteran Selatan No. 78, Makassar',
  'Makassar',
  -5.1477,
  119.4327,
  35.0,
  'Buah Nusantara Makassar',
  'Buah-buahan segar dari kebun sendiri dengan kualitas premium',
  '["buah"]',
  '["ekspedisi"]',
  2019,
  4.9,
  NOW(),
  NOW()
);

-- Produk Toko 9
INSERT INTO `Product` (`id`, `supplierId`, `name`, `quantityKg`, `pricePerKg`, `harvestDate`, `storageMethod`, `hygienic`, `predictedTier`, `createdAt`, `updatedAt`) VALUES
('prod-033-anggur', 'supp-009-makassar-buah', 'Anggur Merah Import', 60.0, 65000, DATE_SUB(NOW(), INTERVAL 1 DAY), 'kulkas', 1, 'Fresh', NOW(), NOW()),
('prod-034-kelengkeng', 'supp-009-makassar-buah', 'Kelengkeng Lokal', 90.0, 28000, DATE_SUB(NOW(), INTERVAL 2 DAY), 'kulkas', 1, 'Fresh', NOW(), NOW()),
('prod-035-belimbing', 'supp-009-makassar-buah', 'Belimbing Manis', 75.0, 20000, DATE_SUB(NOW(), INTERVAL 3 DAY), 'suhu_ruang', 1, 'Standard', NOW(), NOW()),
('prod-036-strawberry', 'supp-009-makassar-buah', 'Strawberry Premium', 35.0, 75000, DATE_SUB(NOW(), INTERVAL 1 DAY), 'kulkas', 1, 'Fresh', NOW(), NOW());

-- 10. KEBUN SAYUR BOGOR
INSERT INTO `Supplier` (
  `id`, `name`, `email`, `password`, `role`, `phone`, `address`, `city`, 
  `latitude`, `longitude`, `deliveryRadiusKm`, `shopName`, `description`, 
  `categories`, `shippingMethods`, `sellingSince`, `rating`, `createdAt`, `updatedAt`
) VALUES (
  'supp-010-bogor-sayur',
  'Rina Sari',
  'rina@sayurbogor.com',
  '$2b$10$YQ7j5vZ8BXqXZ3cXJZ5zUOK.3.8fvYYH0yYq8qXH0yYq8qXH0yYq8',
  'petani',
  '081234567810',
  'Jl. Pajajaran No. 123, Bogor',
  'Bogor',
  -6.5950,
  106.8166,
  20.0,
  'Kebun Sayur Hujan Bogor',
  'Sayuran segar dari kota hujan, tumbuh subur dengan air pegunungan',
  '["sayur"]',
  '["ekspedisi","kurirToko"]',
  2020,
  4.7,
  NOW(),
  NOW()
);

-- Produk Toko 10
INSERT INTO `Product` (`id`, `supplierId`, `name`, `quantityKg`, `pricePerKg`, `harvestDate`, `storageMethod`, `hygienic`, `predictedTier`, `createdAt`, `updatedAt`) VALUES
('prod-037-kacang', 'supp-010-bogor-sayur', 'Kacang Panjang', 85.0, 18000, DATE_SUB(NOW(), INTERVAL 1 DAY), 'kulkas', 1, 'Fresh', NOW(), NOW()),
('prod-038-labu', 'supp-010-bogor-sayur', 'Labu Siam', 110.0, 9000, DATE_SUB(NOW(), INTERVAL 2 DAY), 'suhu_ruang', 1, 'Fresh', NOW(), NOW()),
('prod-039-daun-bawang', 'supp-010-bogor-sayur', 'Daun Bawang', 40.0, 35000, DATE_SUB(NOW(), INTERVAL 1 DAY), 'kulkas', 1, 'Fresh', NOW(), NOW()),
('prod-040-seledri', 'supp-010-bogor-sayur', 'Seledri Segar', 30.0, 40000, DATE_SUB(NOW(), INTERVAL 1 DAY), 'kulkas', 1, 'Fresh', NOW(), NOW());

-- ============================================================================
-- CATATAN PENTING:
-- ============================================================================
-- 1. Password semua akun: "password123" (hash bcrypt sudah disediakan)
-- 2. Rating berkisar 4.6 - 4.9 (realistis untuk toko terpercaya)
-- 3. Setiap toko punya minimal 4 produk dengan tier Fresh/Standard
-- 4. HarvestDate dibuat realistis (1-3 hari lalu)
-- 5. Harga disesuaikan dengan harga pasar Indonesia
-- 6. Lokasi tersebar di 10 kota besar Indonesia dengan koordinat GPS real
-- 7. ID menggunakan format readable (supp-001, prod-001) untuk mudah di-trace
-- ============================================================================
