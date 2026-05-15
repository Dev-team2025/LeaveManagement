import { LeaveRequest } from '../models/LeaveRequest.js'
import mongoose from 'mongoose'

export async function getUsedDaysForUserInYear({ userId, leaveTypeId, year }) {
  const start = new Date(Date.UTC(year, 0, 1))
  const end = new Date(Date.UTC(year + 1, 0, 1))

  const userObjectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId
  const leaveTypeObjectId =
    typeof leaveTypeId === 'string' ? new mongoose.Types.ObjectId(leaveTypeId) : leaveTypeId

  const agg = await LeaveRequest.aggregate([
    {
      $match: {
        userId: userObjectId,
        leaveTypeId: leaveTypeObjectId,
        status: 'approved',
        startDate: { $gte: start, $lt: end },
      },
    },
    { $group: { _id: null, total: { $sum: '$days' } } },
  ])

  return agg[0]?.total || 0
}

