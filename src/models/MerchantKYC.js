import mongoose from 'mongoose'
import { EBusinessType } from '../enums/EBusinessType'
import { EBlockchainAddressType } from '../enums/EBlockchainAddressType'

const merchantKYCSchema = new mongoose.Schema(
  {
    business_name: {
      type: String,
      required: [true, 'Please enter your Last name.'],
    },
    registration_number: {
      type: String,
      required: [true, 'Please enter your First Name.'],
    },
    business_type: {
      type: String,
      enum: EBusinessType,
      default: EBusinessType.NONE,
    },
    address: {
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
    usdt_address: {
      type: String,
    },
    usdt_address_type: {
      type: String,
      enum: EBlockchainAddressType,
      default: EBlockchainAddressType.NONE,
    },
    id_type: {
      type: String,
      enum: EValidIdType,
      default: EValidIdType.NONE,
    },
    id_number: {
      type: String,
    },
    id_front_image_url: {
      type: String,
    },
    id_back_image_url: {
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

merchantKYCSchema.methods.toJSON = function () {
  var obj = this.toObject()
  delete obj.__v
  return obj
}

export const MerchantKYC = mongoose.model('merchant_kyc', merchantKYCSchema)
