import mongoose from 'mongoose'

const leaveTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    code: { type: String, required: true, trim: true, uppercase: true, unique: true },
    maxDaysPerYear: { type: Number, required: true, min: 0 },
    isWFH: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

leaveTypeSchema.set('toJSON', {
  transform(_doc, ret) {
    ret.id = String(ret._id)
    delete ret._id
    delete ret.__v
    return ret
  },
})

export const LeaveType =
  mongoose.models.LeaveType || mongoose.model('LeaveType', leaveTypeSchema)

