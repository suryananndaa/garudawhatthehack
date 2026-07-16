// Seed data dummy buat testing dashboard supplier (Tanaku).
// Angka-angka disusun biar hasil agregat (pendapatan bulan ini, dst) konsisten
// dan gampang diverifikasi manual — bukan sekadar random.
//
// Cara pakai:
//   npx prisma db seed
// (seed command dikonfigurasi di prisma.config.ts sebagai "tsx prisma/seed.ts",
//  karena Prisma 7 generate Client dalam bentuk TypeScript, jadi butuh tsx
//  buat nge-run file ini — bukan node biasa)
//
// PENTING: Prisma 7 wajib pakai driver adapter buat konek ke database,
// makanya di sini pakai @prisma/adapter-mariadb (bukan cuma @prisma/client).

import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";

// @prisma/adapter-mariadb gak nerima { url: "..." } begitu aja — connection
// string-nya harus di-parse jadi field terpisah (host/user/password/database).
const dbUrl = new URL(process.env.DATABASE_URL);
const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: dbUrl.port ? parseInt(dbUrl.port, 10) : 3306,
  user: decodeURIComponent(dbUrl.username),
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.slice(1),
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.notification.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.supplier.deleteMany();

  const supplier = await prisma.supplier.create({
    data: {
      name: "CV. Matoa Papua Sentosa",
      email: "matoa.papua@example.com",
      phone: "0812-3456-7890",
      address: "Jayapura, Papua",
      rating: 4.8,
    },
  });

  const [matoa, alpukat, nanas] = await Promise.all([
    prisma.product.create({
      data: {
        supplierId: supplier.id,
        name: "Matoa",
        iconUrl: "🟠",
        quantityKg: 1250,
        pricePerKg: 28000,
        harvestDate: daysAgo(3),
        storageMethod: "suhu_ruang",
        hygienic: true,
        predictedTier: "Fresh",
        tierProbabilities: { Fresh: 0.91, Standard: 0.08, Rescue: 0.01 },
      },
    }),
    prisma.product.create({
      data: {
        supplierId: supplier.id,
        name: "Alpukat Mentega",
        iconUrl: "🥑",
        quantityKg: 900,
        pricePerKg: 22000,
        harvestDate: daysAgo(6),
        storageMethod: "kulkas",
        hygienic: true,
        predictedTier: "Standard",
        tierProbabilities: { Fresh: 0.32, Standard: 0.6, Rescue: 0.08 },
      },
    }),
    prisma.product.create({
      data: {
        supplierId: supplier.id,
        name: "Nanas Madu",
        iconUrl: "🍍",
        quantityKg: 750,
        pricePerKg: 16000,
        harvestDate: daysAgo(2),
        storageMethod: "suhu_ruang",
        hygienic: true,
        predictedTier: "Fresh",
        tierProbabilities: { Fresh: 0.95, Standard: 0.05, Rescue: 0.0 },
      },
    }),
  ]);

  // --- Pesanan "selesai" bulan ini, totalnya sengaja dijumlah pas Rp15.000.000 ---
  await createOrder(supplier.id, "selesai", "UMKM Berkah Jaya", [
    { product: matoa, quantityKg: 300 }, // 300 x 28.000 = 8.400.000
  ]);
  await createOrder(supplier.id, "selesai", "UMKM Sari Rasa", [
    { product: alpukat, quantityKg: 200 }, // 200 x 22.000 = 4.400.000
  ]);
  await createOrder(supplier.id, "selesai", "UMKM Segar Alami", [
    { product: nanas, quantityKg: 137.5 }, // 137.5 x 16.000 = 2.200.000
  ]);
  // total: 8.400.000 + 4.400.000 + 2.200.000 = 15.000.000

  // --- Pesanan "diproses" (2, sesuai mockup) ---
  await createOrder(supplier.id, "diproses", "UMKM Rejeki Barokah", [
    { product: matoa, quantityKg: 50 },
  ]);
  await createOrder(supplier.id, "diproses", "UMKM Cita Rasa Nusantara", [
    { product: alpukat, quantityKg: 30 },
  ]);

  // --- Pesanan "masuk" (10, sesuai mockup) ---
  const buyerNames = [
    "UMKM Tani Makmur", "UMKM Sumber Segar", "UMKM Panen Raya", "UMKM Buah Nusantara",
    "UMKM Alam Subur", "UMKM Hasil Bumi", "UMKM Rasa Kampung", "UMKM Berkah Tani",
    "UMKM Sejahtera", "UMKM Maju Bersama",
  ];
  for (const name of buyerNames) {
    const product = [matoa, alpukat, nanas][Math.floor(Math.random() * 3)];
    const qty = Math.round((10 + Math.random() * 40) * 10) / 10;
    await createOrder(supplier.id, "masuk", name, [{ product, quantityKg: qty }]);
  }

  console.log("Seed selesai:");
  console.log(`- 1 supplier: ${supplier.name}`);
  console.log("- 3 produk: Matoa, Alpukat Mentega, Nanas Madu");
  console.log("- 15 pesanan (10 masuk, 2 diproses, 3 selesai)");
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

async function createOrder(supplierId, status, buyerName, items) {
  const itemsWithSubtotal = items.map(({ product, quantityKg }) => ({
    productId: product.id,
    quantityKg,
    pricePerKgAtOrder: product.pricePerKg,
    subtotal: quantityKg * product.pricePerKg,
  }));
  const totalPrice = itemsWithSubtotal.reduce((sum, i) => sum + i.subtotal, 0);

  return prisma.order.create({
    data: {
      supplierId,
      buyerName,
      status,
      totalPrice,
      items: { create: itemsWithSubtotal },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });