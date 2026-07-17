-- ============================================================================
-- MIGRATION: Tambah field rating ke Product
-- ============================================================================
-- Jalankan ini SETELAH seed_data.sql
-- ============================================================================

-- Tambah kolom rating ke tabel Product (jika belum ada)
ALTER TABLE `Product` ADD COLUMN IF NOT EXISTS `rating` FLOAT NOT NULL DEFAULT 4.5;

-- Update rating untuk produk yang sudah ada (sesuai SQL seed_data.sql)
UPDATE `Product` SET `rating` = 4.8 WHERE `id` = 'prod-001-jeruk';
UPDATE `Product` SET `rating` = 4.9 WHERE `id` = 'prod-002-apel';
UPDATE `Product` SET `rating` = 4.7 WHERE `id` = 'prod-003-mangga';
UPDATE `Product` SET `rating` = 4.6 WHERE `id` = 'prod-004-pepaya';

UPDATE `Product` SET `rating` = 4.9 WHERE `id` = 'prod-005-tomat';
UPDATE `Product` SET `rating` = 4.8 WHERE `id` = 'prod-006-cabai';
UPDATE `Product` SET `rating` = 4.7 WHERE `id` = 'prod-007-brokoli';
UPDATE `Product` SET `rating` = 4.6 WHERE `id` = 'prod-008-wortel';

UPDATE `Product` SET `rating` = 4.7 WHERE `id` = 'prod-009-pisang';
UPDATE `Product` SET `rating` = 4.8 WHERE `id` = 'prod-010-nanas';
UPDATE `Product` SET `rating` = 4.6 WHERE `id` = 'prod-011-semangka';
UPDATE `Product` SET `rating` = 4.9 WHERE `id` = 'prod-012-melon';

UPDATE `Product` SET `rating` = 4.9 WHERE `id` = 'prod-013-selada';
UPDATE `Product` SET `rating` = 4.7 WHERE `id` = 'prod-014-bayam';
UPDATE `Product` SET `rating` = 4.8 WHERE `id` = 'prod-015-kangkung';
UPDATE `Product` SET `rating` = 4.6 WHERE `id` = 'prod-016-sawi';

UPDATE `Product` SET `rating` = 4.8 WHERE `id` = 'prod-017-salak';
UPDATE `Product` SET `rating` = 4.9 WHERE `id` = 'prod-018-manggis';
UPDATE `Product` SET `rating` = 4.7 WHERE `id` = 'prod-019-rambutan';
UPDATE `Product` SET `rating` = 4.8 WHERE `id` = 'prod-020-alpukat';

UPDATE `Product` SET `rating` = 4.7 WHERE `id` = 'prod-021-pakcoy';
UPDATE `Product` SET `rating` = 4.6 WHERE `id` = 'prod-022-timun';
UPDATE `Product` SET `rating` = 4.8 WHERE `id` = 'prod-023-terong';
UPDATE `Product` SET `rating` = 4.5 WHERE `id` = 'prod-024-buncis';

UPDATE `Product` SET `rating` = 4.9 WHERE `id` = 'prod-025-durian';
UPDATE `Product` SET `rating` = 4.8 WHERE `id` = 'prod-026-lengkeng';
UPDATE `Product` SET `rating` = 4.6 WHERE `id` = 'prod-027-duku';
UPDATE `Product` SET `rating` = 4.7 WHERE `id` = 'prod-028-jambu';

UPDATE `Product` SET `rating` = 4.8 WHERE `id` = 'prod-029-kentang';
UPDATE `Product` SET `rating` = 4.6 WHERE `id` = 'prod-030-kol';
UPDATE `Product` SET `rating` = 4.9 WHERE `id` = 'prod-031-paprika';
UPDATE `Product` SET `rating` = 4.5 WHERE `id` = 'prod-032-jagung';

UPDATE `Product` SET `rating` = 4.9 WHERE `id` = 'prod-033-anggur';
UPDATE `Product` SET `rating` = 4.7 WHERE `id` = 'prod-034-kelengkeng';
UPDATE `Product` SET `rating` = 4.6 WHERE `id` = 'prod-035-belimbing';
UPDATE `Product` SET `rating` = 4.9 WHERE `id` = 'prod-036-strawberry';

UPDATE `Product` SET `rating` = 4.7 WHERE `id` = 'prod-037-kacang';
UPDATE `Product` SET `rating` = 4.6 WHERE `id` = 'prod-038-labu';
UPDATE `Product` SET `rating` = 4.8 WHERE `id` = 'prod-039-daun-bawang';
UPDATE `Product` SET `rating` = 4.9 WHERE `id` = 'prod-040-seledri';
