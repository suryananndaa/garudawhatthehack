import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from './generated/prisma/client.ts'

// ── Prisma setup ────────────────────────────────────────────────────────────
const dbUrl = new URL(process.env.DATABASE_URL)
const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: dbUrl.port ? parseInt(dbUrl.port, 10) : 3306,
  user: decodeURIComponent(dbUrl.username),
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.slice(1),
})
const prisma = new PrismaClient({ adapter })

// ── Express setup ────────────────────────────────────────────────────────────
const app = express()
const PORT = process.env.PORT || 3000
const JWT_SECRET = process.env.JWT_SECRET || 'ganti-ini-dengan-secret-yang-kuat'
const SALT_ROUNDS = 10

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

// ── Middleware: verifikasi JWT ────────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token tidak ditemukan' })
  }
  const token = authHeader.slice(7)
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ message: 'Token tidak valid atau sudah expired' })
  }
}

// ── Helper: geocode kota via Nominatim (OpenStreetMap) ───────────────────────
async function geocodeCity(city: string): Promise<{ lat: number; lon: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1&countrycodes=id`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Taniku-App/1.0' }, // Nominatim wajib User-Agent
    })
    const data = await res.json()
    if (!data || data.length === 0) return null
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) }
  } catch {
    return null
  }
}

// ── POST /api/auth/register ───────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role, phone, address, city } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email, dan password wajib diisi' })
  }

  const validRoles = ['petani', 'pembeli']
  const userRole = validRoles.includes(role) ? role : 'petani'

  try {
    const existing = await prisma.supplier.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ message: 'Email sudah terdaftar' })
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    // Geocode kota kalau diisi
    let latitude: number | null = null
    let longitude: number | null = null
    if (city) {
      const coords = await geocodeCity(city)
      if (coords) {
        latitude  = coords.lat
        longitude = coords.lon
      }
    }

    const supplier = await prisma.supplier.create({
      data: { name, email, password: hashedPassword, role: userRole, phone, address, city, latitude, longitude },
    })

    const token = jwt.sign(
      { id: supplier.id, email: supplier.email, role: supplier.role, name: supplier.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(201).json({
      message: 'Registrasi berhasil',
      token,
      user: { id: supplier.id, name: supplier.name, email: supplier.email, role: supplier.role, city: supplier.city },
    })
  } catch (err) {
    console.error('[register]', err)
    return res.status(500).json({ message: 'Terjadi kesalahan server' })
  }
})

// ── POST /api/auth/login ──────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  const { email, password, role } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi' })
  }

  try {
    const supplier = await prisma.supplier.findUnique({ where: { email } })
    if (!supplier) {
      return res.status(401).json({ message: 'Email atau password salah' })
    }

    const passwordMatch = await bcrypt.compare(password, supplier.password)
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Email atau password salah' })
    }

    // Kalau role dikirim dari frontend, validasi cocok atau tidak
    if (role && supplier.role !== role) {
      return res.status(403).json({
        message: `Akun ini terdaftar sebagai ${supplier.role}. Pilih peran yang sesuai.`,
      })
    }

    const token = jwt.sign(
      { id: supplier.id, email: supplier.email, role: supplier.role, name: supplier.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.json({
      message: 'Login berhasil',
      token,
      user: { id: supplier.id, name: supplier.name, email: supplier.email, role: supplier.role },
    })
  } catch (err) {
    console.error('[login]', err)
    return res.status(500).json({ message: 'Terjadi kesalahan server' })
  }
})

// ── GET /api/auth/me ─────────────────────────────────────────────────────────
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, phone: true, address: true, rating: true },
    })
    if (!supplier) return res.status(404).json({ message: 'User tidak ditemukan' })
    return res.json({ user: supplier })
  } catch (err) {
    console.error('[me]', err)
    return res.status(500).json({ message: 'Terjadi kesalahan server' })
  }
})

// ── Helper: panggil FastAPI ML service ───────────────────────────────────────
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000'

async function predictTier(product: string, storageMethod: string, harvestDate: string, hygienic: boolean) {
  try {
    const res = await fetch(`${ML_SERVICE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product:        product.toLowerCase(),
        storage_method: storageMethod,
        harvest_date:   harvestDate,   // format: "YYYY-MM-DD"
        hygienic,
      }),
    })
    if (!res.ok) return { tier: 'Standard', confidence: null, warning: 'ML service error' }
    return await res.json()
  } catch {
    // ML service mati → fallback, jangan blokir simpan produk
    return { tier: 'Standard', confidence: null, warning: 'ML service tidak tersedia' }
  }
}

// ── POST /api/products ────────────────────────────────────────────────────────
app.post('/api/products', authMiddleware, async (req, res) => {
  const {
    name, storageMethod, harvestDate, hygienic,
    pricePerKg, quantityKg, iconUrl,
  } = req.body

  if (!name || !storageMethod || !harvestDate || pricePerKg == null || quantityKg == null) {
    return res.status(400).json({ message: 'name, storageMethod, harvestDate, pricePerKg, quantityKg wajib diisi' })
  }

  try {
    // 1. Panggil ML service untuk prediksi tier
    const ml = await predictTier(name, storageMethod, harvestDate, hygienic ?? true)

    // 2. Simpan produk ke DB beserta hasil prediksi
    const product = await prisma.product.create({
      data: {
        supplierId:        req.user.id,
        name,
        iconUrl:           iconUrl ?? null,
        quantityKg:        parseFloat(quantityKg),
        pricePerKg:        parseFloat(pricePerKg),
        harvestDate:       new Date(harvestDate),
        storageMethod,
        hygienic:          Boolean(hygienic ?? true),
        predictedTier:     ml.tier,
        tierProbabilities: ml.confidence ?? undefined,
      },
    })

    return res.status(201).json({
      message:  'Produk berhasil disimpan',
      product,
      prediction: {
        tier:       ml.tier,
        confidence: ml.confidence,
        warning:    ml.warning ?? null,
      },
    })
  } catch (err) {
    console.error('[products/create]', err)
    return res.status(500).json({ message: 'Terjadi kesalahan server' })
  }
})

// ── GET /api/products ─────────────────────────────────────────────────────────
app.get('/api/products', authMiddleware, async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where:   { supplierId: req.user.id },
      orderBy: { createdAt: 'desc' },
    })
    return res.json({ products })
  } catch (err) {
    console.error('[products/list]', err)
    return res.status(500).json({ message: 'Terjadi kesalahan server' })
  }
})



// ── GET /api/dashboard/stats ──────────────────────────────────────────────────
app.get('/api/dashboard/stats', authMiddleware, async (req, res) => {
  try {
    const supplierId = req.user.id

    const [products, orders, notifications] = await Promise.all([
      prisma.product.findMany({ where: { supplierId } }),
      prisma.order.findMany({ where: { supplierId }, include: { items: true } }),
      prisma.notification.findMany({
        where: { supplierId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ])

    const now = new Date()
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const pesananMasuk    = orders.filter(o => o.status === 'masuk').length
    const pesananDiproses = orders.filter(o => o.status === 'diproses').length
    const stokTotal       = products.reduce((sum, p) => sum + p.quantityKg, 0)
    const pendapatanBulanIni = orders
      .filter(o => o.status === 'selesai' && new Date(o.updatedAt) >= firstOfMonth)
      .reduce((sum, o) => sum + o.totalPrice, 0)

    // Top 3 produk berdasarkan stok
    const topProducts = products
      .sort((a, b) => b.quantityKg - a.quantityKg)
      .slice(0, 3)
      .map(p => ({
        id: p.id, name: p.name, emoji: p.iconUrl ?? '📦',
        stock: `${p.quantityKg} kg`,
        price: `Rp ${Number(p.pricePerKg).toLocaleString('id-ID')}`,
        predictedTier: p.predictedTier,
      }))

    return res.json({
      stats: { pesananMasuk, pesananDiproses, stokTotal, pendapatanBulanIni },
      topProducts,
      notifications,
    })
  } catch (err) {
    console.error('[dashboard/stats]', err)
    return res.status(500).json({ message: 'Terjadi kesalahan server' })
  }
})

// ── PUT /api/auth/profile ─────────────────────────────────────────────────────
app.put('/api/auth/profile', authMiddleware, async (req, res) => {
  const { name, phone, address, city, passwordSaatIni, passwordBaru } = req.body

  try {
    const supplier = await prisma.supplier.findUnique({ where: { id: req.user.id } })
    if (!supplier) return res.status(404).json({ message: 'User tidak ditemukan' })

    const updateData: Record<string, unknown> = {}
    if (name)    updateData.name    = name
    if (phone)   updateData.phone   = phone
    if (address) updateData.address = address

    // Update kota + geocode ulang kalau berubah
    if (city && city !== supplier.city) {
      updateData.city = city
      const coords = await geocodeCity(city)
      if (coords) {
        updateData.latitude  = coords.lat
        updateData.longitude = coords.lon
      }
    }

    // Ganti password kalau diisi
    if (passwordBaru) {
      if (!passwordSaatIni) {
        return res.status(400).json({ message: 'Password saat ini wajib diisi untuk mengganti password' })
      }
      const match = await bcrypt.compare(passwordSaatIni, supplier.password)
      if (!match) return res.status(401).json({ message: 'Password saat ini salah' })
      updateData.password = await bcrypt.hash(passwordBaru, SALT_ROUNDS)
    }

    const updated = await prisma.supplier.update({
      where: { id: req.user.id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, phone: true, address: true, city: true, rating: true },
    })

    return res.json({ message: 'Profil berhasil diperbarui', user: updated })
  } catch (err) {
    console.error('[auth/profile]', err)
    return res.status(500).json({ message: 'Terjadi kesalahan server' })
  }
})

// ── PUT /api/orders/:id/status ────────────────────────────────────────────────
app.put('/api/orders/:id/status', authMiddleware, async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  const validStatuses = ['masuk', 'diproses', 'selesai', 'dibatalkan']
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: `Status tidak valid. Pilih: ${validStatuses.join(', ')}` })
  }

  try {
    const order = await prisma.order.findFirst({ where: { id, supplierId: req.user.id } })
    if (!order) return res.status(404).json({ message: 'Pesanan tidak ditemukan' })

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
    })

    return res.json({ message: 'Status berhasil diperbarui', order: updated })
  } catch (err) {
    console.error('[orders/status]', err)
    return res.status(500).json({ message: 'Terjadi kesalahan server' })
  }
})

// ── GET /api/orders ───────────────────────────────────────────────────────────
app.get('/api/orders', authMiddleware, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { supplierId: req.user.id },
      include: { items: { include: { product: { select: { name: true, pricePerKg: true } } } } },
      orderBy: { createdAt: 'desc' },
    })
    return res.json({ orders })
  } catch (err) {
    console.error('[orders/list]', err)
    return res.status(500).json({ message: 'Terjadi kesalahan server' })
  }
})


function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const TIER_SCORE: Record<string, number> = { Fresh: 1.0, Standard: 0.5, Rescue: 0.1 }

const PRESET_WEIGHTS: Record<string, { price: number; distance: number; freshness: number }> = {
  termurah: { price: 1.0,  distance: 0,    freshness: 0    },
  terdekat: { price: 0,    distance: 1.0,  freshness: 0    },
  terbaik:  { price: 0,    distance: 0,    freshness: 1.0  },
  seimbang: { price: 0.33, distance: 0.34, freshness: 0.33 },
}

// ── POST /api/recommend ───────────────────────────────────────────────────────
app.post('/api/recommend', async (req, res) => {
  const { product, quantityKg, city, preset = 'seimbang' } = req.body

  if (!product || !quantityKg || !city) {
    return res.status(400).json({ message: 'product, quantityKg, dan city wajib diisi' })
  }

  const weights = PRESET_WEIGHTS[preset] ?? PRESET_WEIGHTS.seimbang

  try {
    // 1. Geocode kota UMKM
    const umkmCoords = await geocodeCity(city)

    // 2. Ambil semua produk matching
    const products = await prisma.product.findMany({
      where: { name: { contains: product }, quantityKg: { gt: 0 } },
      include: {
        supplier: {
          select: {
            id: true, name: true, email: true, phone: true,
            city: true, latitude: true, longitude: true, rating: true,
          },
        },
      },
    })

    if (products.length === 0) {
      return res.json({ suppliers: [], combination: [], message: 'Tidak ada petani dengan produk ini' })
    }

    // 3. Hitung jarak & normalisasi
    const withDistance = products.map(p => {
      let distanceKm = 9999
      if (umkmCoords && p.supplier.latitude && p.supplier.longitude) {
        distanceKm = haversineKm(umkmCoords.lat, umkmCoords.lon, p.supplier.latitude, p.supplier.longitude)
      }
      return { ...p, distanceKm }
    })

    const allPrices = withDistance.map(p => p.pricePerKg)
    const allDists  = withDistance.map(p => p.distanceKm)
    const minPrice  = Math.min(...allPrices), maxPrice = Math.max(...allPrices)
    const minDist   = Math.min(...allDists),  maxDist  = Math.max(...allDists)

    const scored = withDistance.map(p => {
      const normPrice = maxPrice === minPrice ? 1 : (maxPrice - p.pricePerKg) / (maxPrice - minPrice)
      const normDist  = maxDist  === minDist  ? 1 : (maxDist  - p.distanceKm) / (maxDist  - minDist)
      const tierScore = TIER_SCORE[p.predictedTier ?? 'Standard'] ?? 0.5
      const score     = weights.price * normPrice + weights.distance * normDist + weights.freshness * tierScore

      return {
        productId:     p.id,
        productName:   p.name,
        supplierId:    p.supplier.id,
        supplierName:  p.supplier.name,
        phone:         p.supplier.phone,
        city:          p.supplier.city,
        distanceKm:    Math.round(p.distanceKm * 10) / 10,
        pricePerKg:    p.pricePerKg,
        quantityKg:    p.quantityKg,
        predictedTier: p.predictedTier ?? 'Standard',
        rating:        p.supplier.rating,
        score:         Math.round(score * 1000) / 1000,
      }
    }).sort((a, b) => b.score - a.score)

    // 4. Kombinasi multi-petani
    let remaining = parseFloat(quantityKg)
    const combination: { supplierId: string; supplierName: string; productName: string; allocatedKg: number; pricePerKg: number; score: number }[] = []
    for (const s of scored) {
      if (remaining <= 0) break
      const allocated = Math.min(s.quantityKg, remaining)
      combination.push({
        supplierId: s.supplierId, supplierName: s.supplierName,
        productName: s.productName, allocatedKg: Math.round(allocated * 10) / 10,
        pricePerKg: s.pricePerKg, score: s.score,
      })
      remaining -= allocated
    }

    return res.json({
      preset, weights,
      umkmCity: city, umkmCoords: umkmCoords ?? null,
      totalNeeded: parseFloat(quantityKg),
      fulfilled: remaining <= 0,
      suppliers: scored,
      combination,
    })
  } catch (err) {
    console.error('[recommend]', err)
    return res.status(500).json({ message: 'Terjadi kesalahan server' })
  }
})

// ── GET /api/health ───────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`)
})
