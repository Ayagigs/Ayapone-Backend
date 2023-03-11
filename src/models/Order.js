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
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products',
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: {
          type: Number,
          default: 0.00,
        },
      },
    ],
    sub_total: {
      type: Number,
      default: 0.00
    },
    delivery_fee: {
      type: Number,
      default: 0.00
    },
    grand_total: {
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

orderSchema.pre('save', async function(next) {
  this.grand_total = sub_total + delivery_fee
  next();
})

orderSchema.methods.toJSON = function () {
  var obj = this.toObject()
  delete obj.__v
  return obj
}

export const Order = mongoose.model('orders', orderSchema)
