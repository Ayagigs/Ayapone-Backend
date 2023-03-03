import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: [true, 'Order must belong to a customer.'],
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
      },
    ],
    total: {
      type: Number,
      default: 0.00
    },
    delivery_info: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'shipping_addresses',
      required: [true, 'Order must contain delivery info.'],
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

orderSchema.methods.toJSON = function () {
  var obj = this.toObject()
  delete obj.__v
  return obj
}

export const Order = mongoose.model('orders', orderSchema)
