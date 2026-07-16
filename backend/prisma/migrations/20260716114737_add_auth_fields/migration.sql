/*
  Warnings:

  - Added the required column `password` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable: tambah password dengan default sementara, lalu hapus default-nya
ALTER TABLE `supplier`
    ADD COLUMN `password` VARCHAR(191) NOT NULL DEFAULT 'CHANGE_ME',
    ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'petani';

-- Hapus default value dari password (field ini wajib diisi saat register)
ALTER TABLE `supplier` ALTER COLUMN `password` DROP DEFAULT;
