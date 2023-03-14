import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: [true, 'Order must belong to a customer.'],
    },
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
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
    current_status: {
      type: String,
      default: "order placed",
    },
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
    batch: {
      type: String,
      required: [true, 'Order must belong to a batch.'],
    },
    delivery_info: {
      last_name: {
        type: String,
      },
      first_name: {
        type: String,
      },
      email: {
        type: String,
      },
      phone_number: {
        type: String,
      },
      addrress_one: {
        type: String,
      },
      addrress_two: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      country: {
        type: String,
      },
      postal_code: {
        type: String,
      },
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
  this.sub_total = this.price + this.quantity
  this.grand_total = this.sub_total + this.delivery_fee
  next();
})

orderSchema.methods.toJSON = function () {
  var obj = this.toObject()
  delete obj.__v
  return obj
}

export const Order = mongoose.model('orders', orderSchema)
