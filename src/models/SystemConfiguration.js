import mongoose from 'mongoose'

const systemConfigurationSchema = new mongoose.Schema(
  {
    allow_payment: {
      type: Boolean,
      default: true,
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

systemConfigurationSchema.methods.toJSON = function () {
  var obj = this.toObject()
  delete obj.__v
  return obj
}

export const SystemConfiguration = mongoose.model('system_configuration', systemConfigurationSchema)
