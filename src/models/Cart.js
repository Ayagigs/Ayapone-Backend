import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: [true, 'Cart must belong to a customer.'],
    },
    cart_items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cart_items',
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

cartSchema.methods.toJSON = function () {
  var obj = this.toObject()
  delete obj.__v
  return obj
}

export const Cart = mongoose.model('carts', cartSchema)
