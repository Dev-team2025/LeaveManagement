import mongoose from 'mongoose'

const holidaySchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['national', 'festival'], default: 'national' },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

holidaySchema.set('toJSON', {
  transform(_doc, ret) {
    ret.id = String(ret._id)
    delete ret._id
    delete ret.__v
    return ret
  },
})

export const Holiday = mongoose.models.Holiday || mongoose.model('Holiday', holidaySchema)

