import mongoose from 'mongoose'

const STATUSES = ['pending', 'approved', 'rejected', 'cancelled']

const leaveRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    leaveTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'LeaveType', required: true },
    leaveTypeName: { type: String, required: true, trim: true }, // denormalized for easy reporting
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true, index: true },
    days: { type: Number, required: true, min: 1 },
    reason: { type: String, trim: true, default: '' },
    isEmergency: { type: Boolean, default: false }, // mainly for WFH rules
    status: { type: String, enum: STATUSES, default: 'pending', index: true },
    attachmentUrl: { type: String, default: null },
    attachmentName: { type: String, default: null },
    decidedBy: { type: String, default: null },
    decisionReason: { type: String, trim: true, default: '' },
    decidedAt: { type: Date, default: null },
  },
  { timestamps: true },
)

leaveRequestSchema.set('toJSON', {
  transform(_doc, ret) {
    ret.id = String(ret._id)
    delete ret._id
    delete ret.__v
    return ret
  },
})

export const LeaveRequest =
  mongoose.models.LeaveRequest || mongoose.model('LeaveRequest', leaveRequestSchema)

