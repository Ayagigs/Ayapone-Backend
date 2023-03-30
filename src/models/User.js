import mongoose from 'mongoose'
import { EUserRole } from '../enums/EUserRole.js'
import { EValidIdType } from '../enums/EValidIdType.js'

const userSchema = new mongoose.Schema(
  {
    last_name: {
      type: String,
      required: [true, 'Please enter your Last name.'],
    },
    first_name: {
      type: String,
      required: [true, 'Please enter your First Name.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: [true, 'Email already used by another user']
    },
    username: {
      type: String,
    },
    phone_number: {
      type: String,
    },
    password: {
      type: String,
    },
    password_reset_token: {
      type: String,
    },
    email_verification_token: {
      type: Number,
    },
    is_email_verified: {
      type: Boolean,
      default: false
    },
    user_role: {
      type: String,
      enum: EUserRole,
      default: EUserRole.BUYER,
    },
    profile_photo: {
      type: String,
    },
    cover_photo: {
      type: String,
    },
    gender: {
      type: String,
    },
    date_of_birth: {
      type: String,
    },
    id_type: {
      type: String,
      enum: EValidIdType,
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
    is_deleted: {
      type: Boolean,
      default: false
    },
    google_connected:{
      type:Boolean,
      default:false
    }
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

userSchema.virtual('full_name').get(function () {
  return this.first_name + ' ' + this.last_name;
})

userSchema.methods.toJSON = function () {
  var obj = this.toObject()
  delete obj.password
  delete obj.password_reset_token
  delete obj.email_verification_token
  delete obj.is_deleted
  delete obj.__v
  return obj
}

export const User = mongoose.model('users', userSchema)
