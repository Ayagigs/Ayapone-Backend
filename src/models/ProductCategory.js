import mongoose, { ObjectId } from 'mongoose'

const productCategorySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: [true, 'Category must belong to a merchant.'],
    },
    name:{
      type:String,
      required:[true,'Category Name is required']
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

productCategorySchema.methods.toJSON = function () {
  var obj = this.toObject()
  delete obj.__v
  return obj
}

export const ProductCategory = mongoose.model('categories', productCategorySchema)
