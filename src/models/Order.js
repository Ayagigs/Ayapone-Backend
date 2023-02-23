import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: [true, 'Cart must belong to a customer.'],
    },
    merchants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
    ],
    ordered_items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ordered_items',
      },
    ],
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

orderSchema.methods.toJSON = function () {
  var obj = this.toObject()
  delete obj.__v
  return obj
}

export const Order = mongoose.model('orders', orderSchema)
