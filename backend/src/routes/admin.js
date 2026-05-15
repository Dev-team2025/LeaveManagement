import express from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { User } from '../models/User.js'
import { LeaveType } from '../models/LeaveType.js'

export const adminRouter = express.Router()

adminRouter.use(requireAuth(), requireRole(['admin']))

adminRouter.get('/dashboard', async (_req, res) => {
  const activeUsers = await User.countDocuments({ isActive: true })
  const rolesConfigured = 4
  const leaveTypes = await LeaveType.countDocuments({ isActive: true })

  return res.json({
    stats: [
      { id: 'active-users', label: 'Active users', value: activeUsers },
      { id: 'roles', label: 'Roles configured', value: rolesConfigured },
      { id: 'leave-types', label: 'Leave types', value: leaveTypes },
    ],
  })
})

adminRouter.get('/users', async (_req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 }).lean()
  return res.json(
    users.map((u) => ({
      id: String(u._id),
      name: u.name,
      email: u.email,
      role: u.role,
      isActive: u.isActive,
    })),
  )
})

adminRouter.get('/leave-types', async (_req, res) => {
  const rows = await LeaveType.find({}).sort({ createdAt: -1 }).lean()
  return res.json(
    rows.map((lt) => ({
      id: String(lt._id),
      name: lt.name,
      quota: lt.isWFH ? 'Emergency only' : `${lt.maxDaysPerYear} days`,
      maxDaysPerYear: lt.maxDaysPerYear,
      code: lt.code,
      isWFH: lt.isWFH,
      isActive: lt.isActive,
    })),
  )
})

adminRouter.post('/leave-types', async (req, res) => {
  const name = String(req.body?.name || '').trim()
  const code = String(req.body?.code || '').trim().toUpperCase()
  const maxDaysPerYear = Number(req.body?.maxDaysPerYear ?? 0)
  const isWFH = Boolean(req.body?.isWFH)

  if (!name || !code) {
    return res.status(400).json({ message: 'name and code are required.' })
  }

  const created = await LeaveType.create({
    name,
    code,
    maxDaysPerYear: isWFH ? 365 : maxDaysPerYear,
    isWFH,
    isActive: true,
  })

  return res.status(201).json({ leaveType: created.toJSON() })
})

adminRouter.put('/leave-types/:id', async (req, res) => {
  const id = req.params.id
  const patch = {}
  for (const key of ['name', 'code', 'maxDaysPerYear', 'isWFH', 'isActive']) {
    if (req.body?.[key] !== undefined) patch[key] = req.body[key]
  }

  const updated = await LeaveType.findByIdAndUpdate(id, { $set: patch }, { new: true })
  if (!updated) return res.status(404).json({ message: 'Leave type not found.' })
  return res.json({ leaveType: updated.toJSON() })
})

adminRouter.delete('/leave-types/:id', async (req, res) => {
  const id = req.params.id
  const updated = await LeaveType.findByIdAndUpdate(id, { $set: { isActive: false } }, { new: true })
  if (!updated) return res.status(404).json({ message: 'Leave type not found.' })
  return res.json({ success: true })
})

