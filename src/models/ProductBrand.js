import mongoose, { ObjectId } from 'mongoose'

const productBrandSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: [true, 'Product Brand must belong to a merchant.'],
    },
    name:{
      type:String,
      required:[true,'Product Brand Name is required']
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

productBrandSchema.methods.toJSON = function () {
  var obj = this.toObject()
  delete obj.__v
  return obj
}

export const ProductBrand = mongoose.model('brands', productBrandSchema)
