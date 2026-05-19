import express from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { LeaveRequest } from '../models/LeaveRequest.js'
import { Notification } from '../models/Notification.js'
import { toDateOnlyISO } from '../utils/dates.js'

export const managerRouter = express.Router()

managerRouter.use(requireAuth(), requireRole(['manager']))

managerRouter.get('/dashboard', async (req, res) => {
  const pending = await LeaveRequest.countDocuments({ status: 'pending', managerId: req.user.id })
  const approvedToday = await LeaveRequest.countDocuments({
    status: 'approved',
    managerId: req.user.id,
    decidedAt: { $gte: new Date(Date.now() - 86400000) },
  })

  return res.json({
    cards: [
      { id: 'team-away', label: 'Team members away today', value: approvedToday },
      { id: 'pending', label: 'Pending approvals', value: pending },
      { id: 'calendar', label: 'Upcoming overlaps', value: 0 },
    ],
  })
})

managerRouter.get('/team-leaves', async (req, res) => {
  const rows = await LeaveRequest.find({
    managerId: req.user.id,
  })
    .sort({ createdAt: -1 })
    .limit(100)
    .populate('userId', 'name email designation')
    .lean()

  return res.json(
    rows.map((row) => ({
      id: String(row._id),
      employee: row.userId?.name || row.userId?.email || 'Employee',
      designation: row.userId?.designation || '',
      period: `${toDateOnlyISO(row.startDate)} - ${toDateOnlyISO(row.endDate)}`,
      fromDate: toDateOnlyISO(row.startDate),
      toDate: toDateOnlyISO(row.endDate),
      status: row.status,
      leaveType: row.leaveTypeName,
      days: row.days,
      reason: row.reason || '',
      appliedOn: toDateOnlyISO(row.createdAt),
      createdAt: row.createdAt,
      decidedAt: row.decidedAt,
      attachmentUrl: row.attachmentUrl,
      attachmentName: row.attachmentName,
    })),
  )
})

managerRouter.get('/requests/pending', async (req, res) => {
  const rows = await LeaveRequest.find({ status: 'pending', managerId: req.user.id })
    .sort({ createdAt: 1 })
    .populate('userId', 'name email')
    .lean()

  return res.json(
    rows.map((row) => ({
      id: String(row._id),
      employee: row.userId?.name || row.userId?.email || 'Employee',
      leaveType: row.leaveTypeName,
      fromDate: toDateOnlyISO(row.startDate),
      toDate: toDateOnlyISO(row.endDate),
      days: row.days,
      reason: row.reason || '',
      isEmergency: Boolean(row.isEmergency),
      status: row.status,
      createdAt: row.createdAt,
      attachmentUrl: row.attachmentUrl,
      attachmentName: row.attachmentName,
    })),
  )
})

managerRouter.post('/requests/:id/approve', async (req, res) => {
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
    meta: { leaveRequestId: String(updated._id) },
  })

  return res.json({ success: true })
})

managerRouter.post('/requests/:id/reject', async (req, res) => {
  const id = req.params.id
  const decisionReason = String(req.body?.reason || '').trim()

  const updated = await LeaveRequest.findOneAndUpdate(
    { _id: id, status: 'pending' },
    {
      $set: {
        status: 'rejected',
        decidedBy: req.user.name,
        decidedAt: new Date(),
        decisionReason,
      },
    },
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
    meta: { leaveRequestId: String(updated._id), reason: decisionReason },
  })

  return res.json({ success: true })
})

