import mongoose from 'mongoose'

const shippingAddressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
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

shippingAddressSchema.methods.toJSON = function () {
  var obj = this.toObject()
  delete obj.__v
  return obj
}

export const ShippingAddress = mongoose.model('shipping_addresses', shippingAddressSchema)
