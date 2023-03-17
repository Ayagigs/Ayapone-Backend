import mongoose from 'mongoose'

const orderTrackingSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'orders',
    },
    status: {
      type: String
    },
    description: {
      type: String
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

orderTrackingSchema.methods.toJSON = function () {
  var obj = this.toObject()
  delete obj.__v
  return obj
}

export const OrderTracking = mongoose.model('order_trackings', orderTrackingSchema)
