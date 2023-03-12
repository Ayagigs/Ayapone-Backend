import mongoose from 'mongoose'

const userWalletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    main_wallet: {
      type: Number,
      default: 0.00,
    },
    bonus_wallet: {
      type: Number,
      default: 0.00,
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

userWalletSchema.methods.toJSON = function () {
  var obj = this.toObject()
  delete obj.__v
  return obj
}

export const UserWallet = mongoose.model('user_wallet', userWalletSchema)
