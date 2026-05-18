import express from 'express'
import bcrypt from 'bcryptjs'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { LeaveRequest } from '../models/LeaveRequest.js'
import { User } from '../models/User.js'
import { Holiday } from '../models/Holiday.js'
import { Notification } from '../models/Notification.js'
import { toDateOnlyISO } from '../utils/dates.js'

export const hrRouter = express.Router()

hrRouter.use(requireAuth(), requireRole(['hr']))

hrRouter.get('/dashboard', async (_req, res) => {
  const openRequests = await LeaveRequest.countDocuments({ status: 'pending' })
  const approvedThisWeek = await LeaveRequest.countDocuments({
    status: 'approved',
    decidedAt: { $gte: new Date(Date.now() - 7 * 86400000) },
  })
  const employeesTracked = await User.countDocuments({ isActive: true })

  return res.json({
    stats: [
      { id: 'requests', label: 'Open requests', value: openRequests },
      { id: 'approved', label: 'Approved this week', value: approvedThisWeek },
      { id: 'employees', label: 'Employees tracked', value: employeesTracked },
    ],
  })
})

hrRouter.get('/requests', async (_req, res) => {
  const rows = await LeaveRequest.find({})
    .sort({ createdAt: -1 })
    .limit(100)
    .populate('userId', 'name email department')
    .lean()

  return res.json(
    rows.map((row) => ({
      id: String(row._id),
      userId: row.userId?._id ? String(row.userId._id) : String(row.userId),
      employee: row.userId?.name || row.userId?.email || 'Employee',
      department: row.userId?.department || '',
      type: row.leaveTypeName,
      days: row.days,
      status: row.status,
      fromDate: toDateOnlyISO(row.startDate),
      toDate: toDateOnlyISO(row.endDate),
      createdAt: row.createdAt,
      decidedAt: row.decidedAt,
      reason: row.reason || '',
      decisionReason: row.decisionReason || '',
      attachmentUrl: row.attachmentUrl,
      attachmentName: row.attachmentName,
    })),
  )
})

hrRouter.post('/requests/:id/approve', async (req, res) => {
  const id = req.params.id
  const decisionReason = String(req.body?.reason || '').trim()

  const updated = await LeaveRequest.findOneAndUpdate(
    { _id: id, status: 'pending' },
    { $set: { status: 'approved', decidedBy: req.user.name, decidedAt: new Date(), decisionReason } },
    { new: true },
  ).lean()

  if (!updated) {
    return res.status(404).json({ message: 'Request not found or already processed.' })
  }

  await Notification.create({
    userId: updated.userId,
    title: 'Leave approved',
    message: `${updated.leaveTypeName} approved for ${toDateOnlyISO(updated.startDate)} to ${toDateOnlyISO(updated.endDate)}.`,
    type: 'success',
    meta: { leaveRequestId: String(updated._id), approvedBy: 'hr' },
  })

  return res.json({ success: true })
})

hrRouter.post('/requests/:id/reject', async (req, res) => {
  const id = req.params.id
  const decisionReason = String(req.body?.reason || '').trim()

  const updated = await LeaveRequest.findOneAndUpdate(
    { _id: id, status: 'pending' },
    { $set: { status: 'rejected', decidedBy: req.user.name, decidedAt: new Date(), decisionReason } },
    { new: true },
  ).lean()

  if (!updated) {
    return res.status(404).json({ message: 'Request not found or already processed.' })
  }

  await Notification.create({
    userId: updated.userId,
    title: 'Leave rejected',
    message: `${updated.leaveTypeName} rejected for ${toDateOnlyISO(updated.startDate)} to ${toDateOnlyISO(updated.endDate)}.`,
    type: 'danger',
    meta: { leaveRequestId: String(updated._id), rejectedBy: 'hr', reason: decisionReason },
  })

  return res.json({ success: true })
})

hrRouter.get('/employees', async (_req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 }).lean()
  return res.json(
    users.map((u) => ({
      id: String(u._id),
      name: u.name,
      department: u.department || '',
      role: u.role,
      email: u.email,
      isActive: u.isActive,
    })),
  )
})

hrRouter.post('/employees', async (req, res) => {
  const name = String(req.body?.name || '').trim()
  const email = String(req.body?.email || '').trim().toLowerCase()
  const role = String(req.body?.role || '').trim().toLowerCase()
  const department = String(req.body?.department || '').trim()
  const password = String(req.body?.password || '').trim()

  if (!name || !email || !role || !password) {
    return res.status(400).json({ message: 'name, email, role, and password are required.' })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const created = await User.create({
    name,
    email,
    role,
    department,
    passwordHash,
    isActive: true,
  })

  return res.status(201).json({ user: created.toJSON() })
})

hrRouter.put('/employees/:id', async (req, res) => {
  const id = req.params.id
  const patch = {}
  for (const key of ['name', 'department', 'phone', 'location', 'role', 'isActive']) {
    if (req.body?.[key] !== undefined) patch[key] = req.body[key]
  }

  const updated = await User.findByIdAndUpdate(id, { $set: patch }, { new: true })
  if (!updated) return res.status(404).json({ message: 'Employee not found.' })
  return res.json({ user: updated.toJSON() })
})

hrRouter.delete('/employees/:id', async (req, res) => {
  const id = req.params.id
  const updated = await User.findByIdAndUpdate(id, { $set: { isActive: false } }, { new: true })
  if (!updated) return res.status(404).json({ message: 'Employee not found.' })
  return res.json({ success: true })
})

// Holiday calendar management
hrRouter.get('/holidays', async (_req, res) => {
  const rows = await Holiday.find({ isActive: true }).sort({ date: 1 }).lean()
  return res.json(rows.map((h) => ({ id: String(h._id), date: toDateOnlyISO(h.date), name: h.name })))
})

hrRouter.post('/holidays', async (req, res) => {
  const name = String(req.body?.name || '').trim()
  const date = new Date(req.body?.date)
  if (!name || Number.isNaN(date.getTime())) {
    return res.status(400).json({ message: 'name and valid date are required.' })
  }

  const created = await Holiday.create({ name, date, isActive: true })
  return res.status(201).json({ holiday: created.toJSON() })
})

hrRouter.delete('/holidays/:id', async (req, res) => {
  const id = req.params.id
  const updated = await Holiday.findByIdAndUpdate(id, { $set: { isActive: false } }, { new: true })
  if (!updated) return res.status(404).json({ message: 'Holiday not found.' })
  return res.json({ success: true })
})

