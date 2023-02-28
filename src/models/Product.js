import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: [true, 'Product must belong to a merchant.'],
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'brands',
      required: [true, 'Product must have a brand.'],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'categories',
      required: [true, 'Product must have a category.'],
    },
    name:{
      type:String,
      required:[true,'Product Name is required']
    },
    description:{
      type:String,
      required:[true,'Description is required']
    },
    delivery:{
      type:Number,
      required:[true,'Delivery is required']
    },
    price:{
      type:Number,
      required:[true,'Price is required']
    },
    images:{
      type:[String],
      required:true,
      minlength:1,
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

productSchema.methods.toJSON = function () {
  var obj = this.toObject()
  delete obj.__v
  return obj
}

export const Product = mongoose.model('products', productSchema)
