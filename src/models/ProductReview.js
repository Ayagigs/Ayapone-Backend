import mongoose from 'mongoose'

const productReviewSchema = new mongoose.Schema(
  {
    /* order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'orders',
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products',
    },*/
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
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

productReviewSchema.methods.toJSON = function () {
  var obj = this.toObject()
  delete obj.__v
  return obj
}

export const ProductReview = mongoose.model(
  'product_review',
  productReviewSchema,
)
