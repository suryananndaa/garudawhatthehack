import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from './generated/prisma/client.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOADS_DIR = path.join(__dirname, 'uploads')

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
app.use(express.json({ limit: '10mb' }))
app.use('/uploads', express.static(UPLOADS_DIR))

// ── Helper: simpan gambar base64 ke disk ─────────────────────────────────────
function saveBase64Image(base64: string, userId: string, filename: string): string | null {
  const matches = base64.match(/^data:image\/(\w+);base64,(.+)$/)
  if (!matches) return null
  const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1]
  const dir = path.join(UPLOADS_DIR, userId)
  fs.mkdirSync(dir, { recursive: true })
  const filePath = path.join(dir, `${filename}.${ext}`)
  fs.writeFileSync(filePath, Buffer.from(matches[2], 'base64'))
  return `/uploads/${userId}/${filename}.${ext}`
}

const PROFILE_SELECT = {
  id: true, name: true, email: true, role: true,
  phone: true, altContact: true, address: true, city: true,
  latitude: true, longitude: true, deliveryRadiusKm: true,
  shopName: true, description: true, categories: true,
  shippingMethods: true, legalInfo: true, sellingSince: true,
  operatingHours: true, productionCapacity: true, paymentMethods: true,
  bankName: true, bankAccount: true, bankAccountName: true,
  logoUrl: true, fieldPhotoUrl: true, galleryPhotos: true, rating: true,
} as const

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

// ── Helper: geocode via Nominatim (OpenStreetMap) ───────────────────────────
const NOMINATIM_HEADERS = { 'User-Agent': 'Taniku-App/1.0' }

type NominatimAddress = Record<string, string>

function formatPlaceName(address?: NominatimAddress, displayName?: string): string {
  if (!address) return displayName ?? ''
  const parts: string[] = []
  const push = (v?: string) => { if (v && !parts.includes(v)) parts.push(v) }
  push(address.village || address.hamlet || address.neighbourhood)
  push(address.suburb || address.city_district || address.district)
  push(address.city || address.town || address.municipality)
  if (!address.city && !address.town) push(address.county)
  push(address.state)
  return parts.filter(Boolean).join(', ') || displayName || ''
}

function formatSearchItem(item: { address?: NominatimAddress; display_name?: string; name?: string; lat: string; lon: string }) {
  const a = item.address ?? {}
  const title = a.city_district || a.suburb || a.village || a.town || item.name || a.city || a.county || ''
  const subtitleParts: string[] = []
  if (a.city && a.city !== title) subtitleParts.push(a.city)
  if (a.county && a.county !== title && a.county !== a.city) subtitleParts.push(a.county)
  if (a.state) subtitleParts.push(a.state)
  const label = formatPlaceName(a, item.display_name)
  return {
    label,
    title: title || label,
    subtitle: subtitleParts.join(', '),
    lat: parseFloat(item.lat),
    lon: parseFloat(item.lon),
  }
}

async function reverseGeocodeCoords(lat: number, lon: number): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&accept-language=id`
    const res = await fetch(url, { headers: NOMINATIM_HEADERS })
    const data = await res.json()
    return formatPlaceName(data.address, data.display_name)
  } catch {
    return ''
  }
}

async function searchPlaces(query: string) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=8&countrycodes=id&accept-language=id`
    const res = await fetch(url, { headers: NOMINATIM_HEADERS })
    const data = await res.json()
    if (!Array.isArray(data)) return []
    return data.map(formatSearchItem)
  } catch {
    return []
  }
}

async function geocodeCity(city: string): Promise<{ lat: number; lon: number } | null> {
  try {
    const results = await searchPlaces(city)
    if (!results.length) return null
    return { lat: results[0].lat, lon: results[0].lon }
  } catch {
    return null
  }
}

// ── GET /api/geocode/search?q=... ─────────────────────────────────────────────
app.get('/api/geocode/search', async (req, res) => {
  const q = String(req.query.q ?? '').trim()
  if (q.length < 2) return res.json({ results: [] })
  try {
    const results = await searchPlaces(q)
    return res.json({ results })
  } catch {
    return res.status(500).json({ message: 'Gagal mencari lokasi' })
  }
})

// ── GET /api/geocode/reverse?lat=&lon= ────────────────────────────────────────
app.get('/api/geocode/reverse', async (req, res) => {
  const lat = parseFloat(String(req.query.lat))
  const lon = parseFloat(String(req.query.lon))
  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return res.status(400).json({ message: 'lat dan lon wajib diisi' })
  }
  try {
    const label = await reverseGeocodeCoords(lat, lon)
    if (!label) return res.status(404).json({ message: 'Lokasi tidak ditemukan' })
    return res.json({ label, lat, lon })
  } catch {
    return res.status(500).json({ message: 'Gagal mendapatkan nama daerah' })
  }
})

// ── POST /api/auth/register ───────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role, phone, address, city } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email, dan password wajib diisi' })
  }

  // Petani wajib isi kota yang valid
  if (role === 'petani' && !city) {
    return res.status(400).json({ message: 'Petani wajib mengisi kota / kabupaten' })
  }

  const validRoles = ['petani', 'pembeli']
  const userRole = validRoles.includes(role) ? role : 'petani'

  try {
    const existing = await prisma.supplier.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ message: 'Email sudah terdaftar' })
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    // Geocode kota — wajib valid untuk petani
    let latitude: number | null = null
    let longitude: number | null = null

    // Kalau frontend kirim koordinat GPS langsung, pakai itu
    if (req.body.latitude != null && req.body.longitude != null) {
      latitude  = parseFloat(req.body.latitude)
      longitude = parseFloat(req.body.longitude)
    } else if (city) {
      const coords = await geocodeCity(city)
      if (!coords && userRole === 'petani') {
        return res.status(400).json({
          message: `Kota "${city}" tidak ditemukan. Gunakan nama kota/kabupaten yang valid, contoh: "Jayapura", "Bogor", "Surabaya".`
        })
      }
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
      user: {
        id: supplier.id, name: supplier.name, email: supplier.email, role: supplier.role,
        phone: supplier.phone, fieldPhotoUrl: supplier.fieldPhotoUrl, shopName: supplier.shopName,
      },
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
      select: PROFILE_SELECT,
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

// ── GET /api/dashboard/umkm-suggestions ─────────────────────────────────────
app.get('/api/dashboard/umkm-suggestions', authMiddleware, async (req, res) => {
  const weights = PRESET_WEIGHTS.seimbang
  const limit = Math.min(parseInt(String(req.query.limit ?? '8'), 10) || 8, 20)

  try {
    const supplierId = req.user.id

    const [farmerProducts, farmer] = await Promise.all([
      prisma.product.findMany({ where: { supplierId, quantityKg: { gt: 0 } } }),
      prisma.supplier.findUnique({
        where: { id: supplierId },
        select: { latitude: true, longitude: true, city: true },
      }),
    ])

    if (farmerProducts.length === 0) {
      return res.json({ suggestions: [], message: 'Tambah produk dulu untuk melihat rekomendasi UMKM' })
    }

    const nameFilters = farmerProducts.map(p => ({ productName: { contains: p.name } }))

    const [wishlistItems, searchLogs] = await Promise.all([
      prisma.umkmWishlistItem.findMany({
        where: { isActive: true, OR: nameFilters },
        include: {
          buyer: {
            select: {
              id: true, shopName: true, name: true, city: true, phone: true,
              latitude: true, longitude: true, logoUrl: true, rating: true,
            },
          },
        },
      }),
      prisma.umkmSearchLog.findMany({
        where: {
          createdAt: { gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
          OR: nameFilters,
        },
        include: {
          buyer: {
            select: {
              id: true, shopName: true, name: true, city: true, phone: true,
              latitude: true, longitude: true, logoUrl: true, rating: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    type RawMatch = {
      buyerId: string
      shopName: string
      ownerName: string
      city: string | null
      phone: string | null
      logoUrl: string | null
      rating: number
      matchedProduct: string
      pricePerKg: number
      predictedTier: string
      distanceKm: number
      priceFit: number
      tierFit: number
      source: 'wishlist' | 'search'
      note: string | null
    }

    const rawMatches: RawMatch[] = []
    const farmerLat = farmer?.latitude ?? null
    const farmerLon = farmer?.longitude ?? null

    for (const product of farmerProducts) {
      for (const wish of wishlistItems) {
        if (!productNameMatches(product.name, wish.productName)) continue

        const umkmLat = wish.latitude ?? wish.buyer.latitude
        const umkmLon = wish.longitude ?? wish.buyer.longitude

        let distanceKm = 9999
        if (farmerLat != null && farmerLon != null && umkmLat != null && umkmLon != null) {
          distanceKm = haversineKm(farmerLat, farmerLon, umkmLat, umkmLon)
        }
        if (wish.maxDistanceKm != null && distanceKm > wish.maxDistanceKm) continue

        const pFit = priceFitScore(product.pricePerKg, wish.maxPricePerKg)
        if (pFit === 0) continue

        const tFit = tierFitScore(product.predictedTier, wish)
        if (tFit < 0.15) continue

        rawMatches.push({
          buyerId: wish.buyer.id,
          shopName: wish.buyer.shopName || wish.buyer.name,
          ownerName: wish.buyer.name,
          city: wish.city ?? wish.buyer.city,
          phone: wish.buyer.phone,
          logoUrl: wish.buyer.logoUrl,
          rating: wish.buyer.rating,
          matchedProduct: product.name,
          pricePerKg: product.pricePerKg,
          predictedTier: product.predictedTier ?? 'Standard',
          distanceKm,
          priceFit: pFit,
          tierFit: tFit,
          source: 'wishlist',
          note: wish.note,
        })
      }
    }

    // Riwayat search = sinyal lemah (tanpa filter harga/tier ketat)
    const seenSearch = new Set<string>()
    for (const log of searchLogs) {
      const key = `${log.buyerId}:${log.productName.toLowerCase()}`
      if (seenSearch.has(key)) continue
      seenSearch.add(key)

      const product = farmerProducts.find(p => productNameMatches(p.name, log.productName))
      if (!product) continue

      const umkmLat = log.latitude ?? log.buyer.latitude
      const umkmLon = log.longitude ?? log.buyer.longitude

      let distanceKm = 9999
      if (farmerLat != null && farmerLon != null && umkmLat != null && umkmLon != null) {
        distanceKm = haversineKm(farmerLat, farmerLon, umkmLat, umkmLon)
      }

      rawMatches.push({
        buyerId: log.buyer.id,
        shopName: log.buyer.shopName || log.buyer.name,
        ownerName: log.buyer.name,
        city: log.city ?? log.buyer.city,
        phone: log.buyer.phone,
        logoUrl: log.buyer.logoUrl,
        rating: log.buyer.rating,
        matchedProduct: product.name,
        pricePerKg: product.pricePerKg,
        predictedTier: product.predictedTier ?? 'Standard',
        distanceKm,
        priceFit: 0.45,
        tierFit: 0.45,
        source: 'search',
        note: null,
      })
    }

    if (rawMatches.length === 0) {
      return res.json({ suggestions: [], message: 'Belum ada UMKM yang cocok dengan produk kamu saat ini' })
    }

    const allDists = rawMatches.map(m => m.distanceKm)
    const minDist = Math.min(...allDists)
    const maxDist = Math.max(...allDists)

    const scored = rawMatches.map(m => {
      const normDist = maxDist === minDist ? 1 : (maxDist - m.distanceKm) / (maxDist - minDist)
      const base = weights.price * m.priceFit + weights.distance * normDist + weights.freshness * m.tierFit
      const score = Math.round((m.source === 'search' ? base * 0.75 : base) * 1000) / 1000
      return { ...m, score, distanceKm: Math.round(m.distanceKm * 10) / 10 }
    })

    // Satu UMKM = skor terbaik
    const byBuyer = new Map<string, typeof scored[0]>()
    for (const m of scored) {
      const prev = byBuyer.get(m.buyerId)
      if (!prev || m.score > prev.score) byBuyer.set(m.buyerId, m)
    }

    const suggestions = [...byBuyer.values()]
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(m => ({
        umkmId: m.buyerId,
        shopName: m.shopName,
        ownerName: m.ownerName,
        city: m.city,
        phone: m.phone,
        logoUrl: m.logoUrl,
        rating: m.rating,
        matchedProduct: m.matchedProduct,
        yourPrice: m.pricePerKg,
        predictedTier: m.predictedTier,
        distanceKm: m.distanceKm,
        matchScore: m.score,
        matchSource: m.source,
        note: m.note,
      }))

    return res.json({ suggestions })
  } catch (err) {
    console.error('[dashboard/umkm-suggestions]', err)
    return res.status(500).json({ message: 'Terjadi kesalahan server' })
  }
})

// ── PUT /api/auth/profile ─────────────────────────────────────────────────────
app.put('/api/auth/profile', authMiddleware, async (req, res) => {
  const {
    name, phone, altContact, address, city, shopName, description,
    deliveryRadiusKm, categories, shippingMethods, legalInfo, sellingSince,
    operatingHours, productionCapacity, paymentMethods,
    bankName, bankAccount, bankAccountName,
    passwordSaatIni, passwordBaru,
  } = req.body

  try {
    const supplier = await prisma.supplier.findUnique({ where: { id: req.user.id } })
    if (!supplier) return res.status(404).json({ message: 'User tidak ditemukan' })

    const updateData: Record<string, unknown> = {}
    if (name !== undefined)        updateData.name        = name
    if (phone !== undefined)       updateData.phone       = phone
    if (altContact !== undefined)  updateData.altContact  = altContact
    if (address !== undefined)     updateData.address     = address
    if (shopName !== undefined)    updateData.shopName    = shopName
    if (description !== undefined) updateData.description = description
    if (legalInfo !== undefined)   updateData.legalInfo   = legalInfo
    if (productionCapacity !== undefined) updateData.productionCapacity = productionCapacity
    if (bankName !== undefined)        updateData.bankName        = bankName
    if (bankAccount !== undefined)     updateData.bankAccount     = bankAccount
    if (bankAccountName !== undefined) updateData.bankAccountName = bankAccountName

    if (deliveryRadiusKm !== undefined) {
      updateData.deliveryRadiusKm = deliveryRadiusKm === '' || deliveryRadiusKm == null
        ? null
        : parseFloat(deliveryRadiusKm)
    }
    if (sellingSince !== undefined) {
      updateData.sellingSince = sellingSince === '' || sellingSince == null
        ? null
        : parseInt(String(sellingSince), 10)
    }
    if (categories !== undefined)       updateData.categories       = categories
    if (shippingMethods !== undefined)  updateData.shippingMethods  = shippingMethods
    if (operatingHours !== undefined)   updateData.operatingHours   = operatingHours
    if (paymentMethods !== undefined)   updateData.paymentMethods   = paymentMethods

    // Koordinat — bisa diupdate langsung tanpa ganti kota
    if (req.body.latitude != null && req.body.longitude != null) {
      updateData.latitude  = parseFloat(req.body.latitude)
      updateData.longitude = parseFloat(req.body.longitude)
    }

    // Update kota + geocode ulang kalau berubah
    if (city !== undefined && city !== supplier.city) {
      updateData.city = city
      if (req.body.latitude == null || req.body.longitude == null) {
        const coords = await geocodeCity(city)
        if (coords) {
          updateData.latitude  = coords.lat
          updateData.longitude = coords.lon
        }
      }
    } else if (city !== undefined) {
      updateData.city = city
    }

    // Upload gambar base64
    if (req.body.logoBase64) {
      const url = saveBase64Image(req.body.logoBase64, req.user.id, 'logo')
      if (url) updateData.logoUrl = url
    }
    if (req.body.fieldPhotoBase64) {
      const url = saveBase64Image(req.body.fieldPhotoBase64, req.user.id, 'field')
      if (url) updateData.fieldPhotoUrl = url
    }
    if (req.body.galleryBase64 && Array.isArray(req.body.galleryBase64)) {
      const existing = Array.isArray(supplier.galleryPhotos) ? supplier.galleryPhotos as string[] : []
      const newUrls = req.body.galleryBase64
        .map((b64: string, i: number) => saveBase64Image(b64, req.user.id, `gallery-${Date.now()}-${i}`))
        .filter(Boolean)
      updateData.galleryPhotos = [...existing, ...newUrls]
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
      select: PROFILE_SELECT,
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

const TIER_RANK: Record<string, number> = { Fresh: 3, Standard: 2, Rescue: 1 }

function productNameMatches(a: string, b: string): boolean {
  const x = a.toLowerCase(), y = b.toLowerCase()
  return x.includes(y) || y.includes(x)
}

function priceFitScore(pricePerKg: number, maxPricePerKg: number | null | undefined): number {
  if (maxPricePerKg == null) return 0.5
  if (pricePerKg > maxPricePerKg) return 0
  return 0.65 + 0.35 * (1 - pricePerKg / maxPricePerKg)
}

function tierFitScore(
  productTier: string | null | undefined,
  wish: { preferredTier?: string | null; acceptsRescue?: boolean | null },
): number {
  const tier = productTier ?? 'Standard'
  if (wish.preferredTier && wish.preferredTier === tier) return 1.0
  if (wish.acceptsRescue && tier === 'Rescue') return 1.0
  if (wish.preferredTier === 'Rescue' && tier === 'Rescue') return 1.0
  if (wish.preferredTier === 'Fresh' && tier === 'Fresh') return 1.0
  if (wish.preferredTier === 'Rescue' && tier !== 'Rescue') return 0.15
  if (wish.preferredTier === 'Fresh' && TIER_RANK[tier] < TIER_RANK.Fresh) return 0.2
  if (wish.acceptsRescue && tier === 'Standard') return 0.55
  return 0.45
}

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

// ── GET /api/umkm/search?q=... ────────────────────────────────────────────────
app.get('/api/umkm/search', authMiddleware, async (req, res) => {
  const q = String(req.query.q ?? '').trim()
  const limit = Math.min(parseInt(String(req.query.limit ?? '10'), 10) || 10, 20)

  if (q.length < 2) {
    return res.json({ results: [] })
  }

  try {
    const results = await prisma.supplier.findMany({
      where: {
        role: 'pembeli',
        OR: [
          { shopName: { contains: q } },
          { name: { contains: q } },
        ],
      },
      select: {
        id: true,
        shopName: true,
        name: true,
        city: true,
        address: true,
        phone: true,
        description: true,
        logoUrl: true,
        rating: true,
      },
      take: limit,
      orderBy: { shopName: 'asc' },
    })

    return res.json({
      results: results.map(u => ({
        id: u.id,
        shopName: u.shopName || u.name,
        ownerName: u.name,
        city: u.city,
        address: u.address,
        phone: u.phone,
        description: u.description,
        logoUrl: u.logoUrl,
        rating: u.rating,
      })),
    })
  } catch (err) {
    console.error('[umkm/search]', err)
    return res.status(500).json({ message: 'Terjadi kesalahan server' })
  }
})

// ── GET /api/health ───────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`)
})
