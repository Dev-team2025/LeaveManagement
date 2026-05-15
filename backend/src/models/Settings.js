import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    wfhEmergencyOnly: { type: Boolean, default: true },
    wfhRestrictedDuringSemester: { type: Boolean, default: true },
    semesterPeriods: [
      {
        start: { type: Date, required: true },
        end: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true },
)

settingsSchema.set('toJSON', {
  transform(_doc, ret) {
    ret.id = String(ret._id)
    delete ret._id
    delete ret.__v
    return ret
  },
})

export const Settings =
  mongoose.models.Settings || mongoose.model('Settings', settingsSchema)

