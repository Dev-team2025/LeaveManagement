import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

function getBearerToken(req) {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null
  return token
}

export function requireAuth() {
  return async (req, res, next) => {
    try {
      const token = getBearerToken(req)
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const secret = process.env.JWT_SECRET
      if (!secret) {
        return res.status(500).json({ message: 'Server misconfiguration' })
      }

      const payload = jwt.verify(token, secret)
      const user = await User.findById(payload.sub)
        .select('name email role department phone location isActive managerId baseSalary')
        .lean()
      if (!user || user.isActive === false) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      req.user = {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department || '',
        phone: user.phone || '',
        location: user.location || '',
        managerId: user.managerId ? String(user.managerId) : null,
        baseSalary: user.baseSalary || 0,
      }

      return next()
    } catch {
      return res.status(401).json({ message: 'Unauthorized' })
    }
  }
}

export function requireRole(roles = []) {
  const allowed = Array.isArray(roles) ? roles : [roles]

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    if (allowed.length > 0 && !allowed.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    return next()
  }
}

