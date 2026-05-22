import express from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { LeaveType } from '../models/LeaveType.js'
import { LeaveRequest } from '../models/LeaveRequest.js'
import { Settings } from '../models/Settings.js'
import { Notification } from '../models/Notification.js'
import { User } from '../models/User.js'
import { Holiday } from '../models/Holiday.js'
import { diffDaysInclusive, countBusinessDays, isDateInAnyRange, toDateOnlyISO } from '../utils/dates.js'
import { getUsedDaysForUserInYear } from '../utils/balance.js'

export const employeeRouter = express.Router()

employeeRouter.use(requireAuth(), requireRole(['employee']))

employeeRouter.get('/profile', async (req, res) => {
  return res.json({ user: req.user })
})

employeeRouter.put('/profile', async (req, res) => {
  const phone = req.body?.phone !== undefined ? String(req.body.phone || '').trim() : undefined
  const location = req.body?.location !== undefined ? String(req.body.location || '').trim() : undefined

  const patch = {}
  if (phone !== undefined) patch.phone = phone
  if (location !== undefined) patch.location = location

  if (Object.keys(patch).length === 0) {
    return res.status(400).json({ message: 'No fields to update.' })
  }

  // req.user is built from DB; update the underlying user record.
  const updated = await User.findByIdAndUpdate(req.user.id, { $set: patch }, { new: true })
    .select('name email role department phone location isActive')
    .lean()

  if (!updated) {
    return res.status(404).json({ message: 'User not found.' })
  }

  return res.json({
    user: {
      id: String(updated._id),
      name: updated.name,
      email: updated.email,
      role: updated.role,
      department: updated.department || '',
      phone: updated.phone || '',
      location: updated.location || '',
    },
  })
})

employeeRouter.get('/leave-types', async (_req, res) => {
  const rows = await LeaveType.find({ isActive: true }).sort({ name: 1 }).lean()
  return res.json(rows.map((lt) => lt.name))
})

employeeRouter.get('/holidays', async (_req, res) => {
  const rows = await Holiday.find({ isActive: true }).sort({ date: 1 }).lean()
  return res.json(
    rows.map((row) => ({
      id: String(row._id),
      name: row.name,
      date: toDateOnlyISO(row.date),
      type: row.type,
      description: row.description || '',
    })),
  )
})

employeeRouter.get('/leaves', async (req, res) => {
  const rows = await LeaveRequest.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .lean()

  return res.json(
    rows.map((row) => ({
      id: String(row._id),
      userId: String(row.userId),
      leaveType: row.leaveTypeName,
      fromDate: toDateOnlyISO(row.startDate),
      toDate: toDateOnlyISO(row.endDate),
      status: row.status,
      days: row.days,
      reason: row.reason || '',
      isEmergency: Boolean(row.isEmergency),
      createdAt: row.createdAt,
      attachmentUrl: row.attachmentUrl,
      attachmentName: row.attachmentName,
      deductionAmount: row.deductionAmount || 0,
      isPaid: row.isPaid !== false,
    })),
  )
})

employeeRouter.post('/leaves', async (req, res) => {
  const leaveTypeName = String(req.body?.leaveType || '').trim()
  const fromDate = req.body?.fromDate
  const toDate = req.body?.toDate
  const reason = String(req.body?.reason || '').trim()
  const isEmergency = Boolean(req.body?.isEmergency)

  if (!leaveTypeName || !fromDate || !toDate) {
    return res.status(400).json({ message: 'leaveType, fromDate, and toDate are required.' })
  }

  const startDate = new Date(fromDate)
  const endDate = new Date(toDate)
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || endDate < startDate) {
    return res.status(400).json({ message: 'Invalid date range.' })
  }

  const leaveType =
    (await LeaveType.findOne({ name: leaveTypeName, isActive: true })) ||
    (await LeaveType.findOne({ code: leaveTypeName.toUpperCase(), isActive: true }))

  if (!leaveType) {
    return res.status(400).json({ message: 'Unknown leave type.' })
  }

  // Fetch active holidays in the requested range to exclude them from the count
  const holidaysInRange = await Holiday.find({
    isActive: true,
    date: { $gte: startDate, $lte: endDate },
  }).lean()
  const holidayDates = holidaysInRange.map((h) => h.date)

  const days = countBusinessDays(startDate, endDate, holidayDates)
  console.log(`Leave Request: ${leaveTypeName}, Days: ${days}, Balance: ${leaveType.maxDaysPerYear}`)

  if (days === 0) {
    return res.status(400).json({ message: 'Selected date range contains no business days or is entirely holidays.' })
  }

  const settings = await Settings.findOne({ key: 'default' }).lean()
  let deductionAmount = 0
  let isPaid = true
  let message = 'Leave request submitted successfully.'

  if (leaveType.isWFH) {
    if (settings?.wfhEmergencyOnly && !isEmergency) {
      return res.status(400).json({ message: 'WFH is allowed only in emergency situations.' })
    }

    if (
      settings?.wfhRestrictedDuringSemester &&
      Array.isArray(settings.semesterPeriods) &&
      isDateInAnyRange(startDate, settings.semesterPeriods)
    ) {
      return res
        .status(400)
        .json({ message: 'WFH cannot be applied during semester periods.' })
    }
  } else {
    const year = new Date().getUTCFullYear()
    const usedDays = await getUsedDaysForUserInYear({
      userId: req.user.id,
      leaveTypeId: leaveType._id,
      year,
    })

    if (usedDays + days > leaveType.maxDaysPerYear) {
      const alreadyUsed = usedDays
      const allowance = leaveType.maxDaysPerYear
      
      const paidDaysAvailable = Math.max(0, allowance - alreadyUsed)
      const currentRequestPaidDays = Math.min(days, paidDaysAvailable)
      const currentRequestUnpaidDays = days - currentRequestPaidDays

      if (currentRequestUnpaidDays > 0) {
        isPaid = false
        // Calculate deduction: (Base Salary / 30) * currentRequestUnpaidDays
        const dailyRate = (req.user.baseSalary || 0) / 30
        deductionAmount = Math.round(dailyRate * currentRequestUnpaidDays)

        if (currentRequestUnpaidDays === days) {
          message = `You have 0 days left in your ${leaveType.name} balance. This entire request for ${days} days will be Loss of Pay (LOP).`
        } else {
          message = `You have ${paidDaysAvailable} days left in your ${leaveType.name} balance. This request for ${days} days will have ${currentRequestPaidDays} paid day(s) and ${currentRequestUnpaidDays} Loss of Pay (LOP) day(s).`
        }
      }
    }
  }

  const doc = await LeaveRequest.create({
    userId: req.user.id,
    managerId: req.user.managerId || null,
    leaveTypeId: leaveType._id,
    leaveTypeName: leaveType.name,
    startDate,
    endDate,
    days,
    reason,
    isEmergency,
    attachmentUrl: req.body?.attachmentUrl || null,
    attachmentName: req.body?.attachmentName || null,
    status: 'pending',
    deductionAmount,
    isPaid,
  })

  await Notification.create({
    userId: req.user.id,
    title: 'Leave request submitted',
    message: `${leaveType.name} requested from ${toDateOnlyISO(startDate)} to ${toDateOnlyISO(endDate)}.`,
    type: 'info',
    meta: { leaveRequestId: String(doc._id) },
  })

  return res.status(201).json({
    success: true,
    request: doc.toJSON(),
    message,
  })
})

employeeRouter.get('/dashboard', async (req, res) => {
  const leaveTypes = await LeaveType.find({ isActive: true }).sort({ name: 1 }).lean()
  const year = new Date().getUTCFullYear()

  const leaveTiles = await Promise.all(
    leaveTypes.map(async (lt) => {
      const usedDays = await getUsedDaysForUserInYear({
        userId: req.user.id,
        leaveTypeId: lt._id,
        year,
      })

      if (lt.isWFH) {
        return {
          id: lt.code.toLowerCase(),
          leaveType: lt.name === 'Work From Home' ? 'WFH' : lt.name,
          tone: 'primary',
          usedDays,
        }
      }

      const totalDays = lt.maxDaysPerYear
      const availableDays = Math.max(0, totalDays - usedDays)

      return {
        id: lt.code.toLowerCase(),
        leaveType: lt.name,
        tone: availableDays <= 2 ? 'warning' : 'success',
        availableDays,
        usedDays,
        totalDays,
      }
    }),
  )

  const upcoming = await LeaveRequest.find({
    userId: req.user.id,
    status: { $in: ['approved', 'pending'] },
    startDate: { $gte: new Date(Date.now() - 86400000) },
  })
    .sort({ startDate: 1 })
    .limit(10)
    .lean()

  const upcomingLeaves = upcoming
    .filter((r) => r.status === 'approved')
    .map((r) => ({
      id: String(r._id),
      leaveType: r.leaveTypeName,
      status: r.status,
      fromDate: toDateOnlyISO(r.startDate),
      toDate: toDateOnlyISO(r.endDate),
      days: r.days,
    }))

  const pendingRequests = upcoming
    .filter((r) => r.status === 'pending')
    .map((r) => ({
      id: String(r._id),
      leaveType: r.leaveTypeName,
      status: r.status,
      fromDate: toDateOnlyISO(r.startDate),
      toDate: toDateOnlyISO(r.endDate),
      days: r.days,
    }))

  const settings = await Settings.findOne({ key: 'default' }).lean()
  const alerts = []
  if (settings?.wfhRestrictedDuringSemester) {
    alerts.push({
      id: 'wfh-restricted',
      variant: 'info',
      title: 'WFH Restricted During Active Semester',
      message:
        'WFH not allowed during active semester unless emergency. Emergency WFH requests require immediate supervisor approval.',
    })
  }

  return res.json({
    alerts,
    leaveTiles,
    upcomingLeaves,
    pendingRequests,
  })
})

