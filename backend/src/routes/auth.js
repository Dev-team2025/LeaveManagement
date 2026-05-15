import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'
import { Notification } from '../models/Notification.js'

export const authRouter = express.Router()

function signToken(user) {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('Missing JWT_SECRET')
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || '7d'

  return jwt.sign(
    { role: user.role },
    secret,
    {
      subject: String(user._id),
      expiresIn,
    },
  )
}

authRouter.post('/login', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase()
  const password = String(req.body?.password || '')

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' })
  }

  const user = await User.findOne({ email }).select('name email role passwordHash isActive')
  if (!user || user.isActive === false) {
    return res.status(401).json({ message: 'Invalid email or password.' })
  }

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) {
    return res.status(401).json({ message: 'Invalid email or password.' })
  }

  const token = signToken(user)

  return res.json({
    token,
    user: user.toJSON(),
    role: user.role,
  })
})

authRouter.post('/logout', (_req, res) => {
  return res.json({ success: true })
})

authRouter.get('/profile', requireAuth(), (req, res) => {
  return res.json({ user: req.user, role: req.user.role })
})

authRouter.get('/notifications', requireAuth(), async (req, res) => {
  const rows = await Notification.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean()

  return res.json(
    rows.map((row) => ({
      id: String(row._id),
      title: row.title,
      message: row.message,
      type: row.type,
      isRead: Boolean(row.isRead),
      createdAt: row.createdAt,
      meta: row.meta || {},
    })),
  )
})

authRouter.post('/notifications/:id/read', requireAuth(), async (req, res) => {
  await Notification.updateOne(
    { _id: req.params.id, userId: req.user.id },
    { $set: { isRead: true } },
  )
  return res.json({ success: true })
})

authRouter.post('/notifications/read-all', requireAuth(), async (req, res) => {
  await Notification.updateMany({ userId: req.user.id, isRead: false }, { $set: { isRead: true } })
  return res.json({ success: true })
})

