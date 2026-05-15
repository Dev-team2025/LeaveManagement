import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: { type: String, trim: true, default: 'info' },
    isRead: { type: Boolean, default: false, index: true },
    meta: { type: Object, default: {} },
  },
  { timestamps: true },
)

notificationSchema.set('toJSON', {
  transform(_doc, ret) {
    ret.id = String(ret._id)
    delete ret._id
    delete ret.__v
    return ret
  },
})

export const Notification =
  mongoose.models.Notification || mongoose.model('Notification', notificationSchema)

