import mongoose from 'mongoose'
import { EBusinessType } from '../enums/EBusinessType.js'
import { EBlockchainAddressType } from '../enums/EBlockchainAddressType.js'
import { EBusinessVerificationStatus } from '../enums/EBusinessVerificationStatus.js'

const merchantKYCSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, 'Business must belong to a user.'],
    },
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
      default: EBusinessType.OTHERS,
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
    postal_code: {
      type: String,
    },
    usdt_address: {
      type: String,
    },
    usdt_address_type: {
      type: String,
      enum: EBlockchainAddressType,
      default: EBlockchainAddressType.BEP20,
    },
    verification_status: {
      type: String,
      enum: EBusinessVerificationStatus,
      default: EBusinessVerificationStatus.PENDING,
    },
    is_default_business: {
      type: Boolean,
      default: true
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
