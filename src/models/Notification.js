import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: [true, 'Notification must belong to a user.'],
    },
    title: {
      type: String,
      required: [true, 'Notification must have a title.'],
    },
    description: {
      type: String,
    },
    read: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    toJSON: {
      virtuals: true,
    },
  },
)

notificationSchema.methods.toJSON = function () {
  var obj = this.toObject()
  delete obj.__v
  return obj
}

export const Notification = mongoose.model('notifications', notificationSchema)
