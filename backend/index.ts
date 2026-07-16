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

// ── POST /api/auth/register ───────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role, phone, address } = req.body

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

    const supplier = await prisma.supplier.create({
      data: { name, email, password: hashedPassword, role: userRole, phone, address },
    })

    const token = jwt.sign(
      { id: supplier.id, email: supplier.email, role: supplier.role, name: supplier.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(201).json({
      message: 'Registrasi berhasil',
      token,
      user: { id: supplier.id, name: supplier.name, email: supplier.email, role: supplier.role },
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

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`)
})
