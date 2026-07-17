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
  await prisma.umkmSearchLog.deleteMany();
  await prisma.umkmWishlistItem.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.supplier.deleteMany();

  const supplier = await prisma.supplier.create({
    data: {
      name: "Budi Santoso",
      shopName: "Kebun Apel Kelapa Dua",
      email: "matoa.papua@example.com",
      password: "$2b$10$placeholderhashforseedonly",
      role: "petani",
      phone: "0812-3456-7890",
      address: "Jl. Kelapa Dua Raya, Depok",
      city: "Kelapa Dua, Depok",
      latitude: -6.2394,
      longitude: 106.9633,
      rating: 4.8,
    },
  });

  const [matoa, alpukat, nanas, apel] = await Promise.all([
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
    prisma.product.create({
      data: {
        supplierId: supplier.id,
        name: "Apel",
        iconUrl: "🍎",
        quantityKg: 120,
        pricePerKg: 5000,
        harvestDate: daysAgo(12),
        storageMethod: "suhu_ruang",
        hygienic: true,
        predictedTier: "Rescue",
        tierProbabilities: { Fresh: 0.05, Standard: 0.15, Rescue: 0.8 },
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

  // --- Akun UMKM (pembeli) buat fitur cari toko & saran pelanggan ---
  const umkmSeed = [
    { shopName: "UMKM Berkah Jaya", name: "Andi Wijaya", city: "Jakarta Selatan", phone: "0812-1111-2222", latitude: -6.2615, longitude: 106.8106 },
    { shopName: "UMKM Sari Rasa", name: "Siti Aminah", city: "Bandung", phone: "0813-2222-3333", latitude: -6.9175, longitude: 107.6191 },
    { shopName: "UMKM Segar Alami", name: "Rudi Hartono", city: "Surabaya", phone: "0814-3333-4444", latitude: -7.2575, longitude: 112.7521 },
    { shopName: "UMKM Rejeki Barokah", name: "Dewi Lestari", city: "Makassar", phone: "0815-4444-5555", latitude: -5.1477, longitude: 119.4327 },
    { shopName: "UMKM Cita Rasa Nusantara", name: "Agus Pratama", city: "Yogyakarta", phone: "0816-5555-6666", latitude: -7.7956, longitude: 110.3695 },
    { shopName: "UMKM Tani Makmur", name: "Fitri Handayani", city: "Semarang", phone: "0817-6666-7777", latitude: -6.9667, longitude: 110.4167 },
    { shopName: "UMKM Makmur Jaya", name: "Hendra Wijaya", city: "Depok", phone: "0811-1234-5678", latitude: -6.4025, longitude: 106.7942 },
    { shopName: "UMKM Sari Bumi", name: "Maya Sari", city: "Bogor", phone: "0812-2345-6789", latitude: -6.5971, longitude: 106.8060 },
    { shopName: "UMKM Dapur Nusantara", name: "Yanto Kusuma", city: "Tangerang", phone: "0813-3456-7890", latitude: -6.1783, longitude: 106.6319 },
  ];

  const umkmAccounts: Record<string, string> = {};

  for (const umkm of umkmSeed) {
    const created = await prisma.supplier.create({
      data: {
        ...umkm,
        email: `${umkm.shopName.toLowerCase().replace(/\s+/g, ".")}@umkm.example.com`,
        password: "$2b$10$placeholderhashforseedonly",
        role: "pembeli",
        address: `Jl. Contoh No. 1, ${umkm.city}`,
        description: "UMKM pencari bahan baku segar lokal.",
      },
    });
    umkmAccounts[umkm.shopName] = created.id;
  }

  // --- Permintaan UMKM (wishlist) buat fitur Saran Pelanggan ---
  await prisma.umkmWishlistItem.createMany({
    data: [
      {
        buyerId: umkmAccounts["UMKM Makmur Jaya"],
        productName: "Apel",
        quantityKg: 50,
        maxPricePerKg: 6000,
        preferredTier: "Rescue",
        acceptsRescue: true,
        city: "Depok",
        latitude: -6.4025,
        longitude: 106.7942,
        maxDistanceKm: 25,
        note: "Butuh apel murah buat olahan jus — near-expiry OK",
      },
      {
        buyerId: umkmAccounts["UMKM Sari Bumi"],
        productName: "Apel",
        quantityKg: 30,
        maxPricePerKg: 7000,
        preferredTier: "Rescue",
        acceptsRescue: true,
        city: "Bogor",
        latitude: -6.5971,
        longitude: 106.8060,
        maxDistanceKm: 35,
        note: "Cari apel rescue harga bersahabat",
      },
      {
        buyerId: umkmAccounts["UMKM Dapur Nusantara"],
        productName: "Apel",
        quantityKg: 20,
        maxPricePerKg: 5500,
        preferredTier: "Rescue",
        acceptsRescue: true,
        city: "Tangerang",
        latitude: -6.1783,
        longitude: 106.6319,
        maxDistanceKm: 40,
        note: "Untuk selai dan filling pastry",
      },
      {
        buyerId: umkmAccounts["UMKM Berkah Jaya"],
        productName: "Apel",
        quantityKg: 15,
        maxPricePerKg: 4500,
        preferredTier: "Rescue",
        acceptsRescue: true,
        city: "Jakarta Selatan",
        latitude: -6.2615,
        longitude: 106.8106,
        maxDistanceKm: 30,
        note: "Budget ketat, rescue tier preferred",
      },
      {
        buyerId: umkmAccounts["UMKM Segar Alami"],
        productName: "Apel",
        quantityKg: 100,
        maxPricePerKg: 3000,
        preferredTier: "Fresh",
        acceptsRescue: false,
        city: "Surabaya",
        latitude: -7.2575,
        longitude: 112.7521,
        maxDistanceKm: 20,
        note: "Hanya apel fresh grade A — jauh dari Kelapa Dua",
      },
      {
        buyerId: umkmAccounts["UMKM Makmur Jaya"],
        productName: "Matoa",
        quantityKg: 40,
        maxPricePerKg: 30000,
        preferredTier: "Fresh",
        acceptsRescue: false,
        city: "Depok",
        latitude: -6.4025,
        longitude: 106.7942,
        maxDistanceKm: 50,
        note: "Butuh matoa premium",
      },
    ],
  });

  // --- Riwayat search UMKM (sinyal tambahan) ---
  await prisma.umkmSearchLog.createMany({
    data: [
      {
        buyerId: umkmAccounts["UMKM Makmur Jaya"],
        productName: "Apel",
        quantityKg: 50,
        city: "Depok",
        latitude: -6.4025,
        longitude: 106.7942,
        preset: "termurah",
      },
      {
        buyerId: umkmAccounts["UMKM Sari Bumi"],
        productName: "Apel",
        quantityKg: 30,
        city: "Bogor",
        preset: "terdekat",
      },
    ],
  });

  console.log("Seed selesai:");
  console.log(`- 1 petani: ${supplier.shopName} (${supplier.city})`);
  console.log(`- ${umkmSeed.length} UMKM (pembeli)`);
  console.log("- 4 produk: Matoa, Alpukat Mentega, Nanas Madu, Apel (Rescue Rp5.000/kg)");
  console.log("- 6 wishlist UMKM + 2 riwayat search");
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