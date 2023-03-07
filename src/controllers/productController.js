import { StatusCodes } from 'http-status-codes'
import { Product } from '../models/Product.js'
import { handleErrors } from '../utils/errorHandler.js'
import { toObjectId } from '../utils/convert.js'
import { ProductBrand } from '../models/ProductBrand.js'
import { ProductCategory } from '../models/ProductCategory.js'

export const createProduct = async (req, res, next) => {
  const { name, description, delivery, price, categoryId, brandId } = req.body
  try {
    const user = res.locals.user
    if (
      !delivery ||
      !description ||
      !price ||
      !name ||
      !brandId ||
      !categoryId
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Please fill all fields',
      })
    }
    const existingProduct = await Product.findOne({
      name,
      owner: toObjectId(user),
    })
    if (existingProduct) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Product already exists',
      })
    }
    const brand = await ProductBrand.findOne({
      _id: toObjectId(brandId),
      owner: toObjectId(user),
    })
    const category = await ProductCategory.findOne({
      _id: toObjectId(categoryId),
      owner: toObjectId(user),
    })
    if (!brand || !category) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: 'Product Brand Or Category not found',
      })
    }
    const product = await Product.create({
      name,
      description,
      delivery,
      price,
      category: toObjectId(categoryId),
      brand: toObjectId(brandId),
      owner: toObjectId(user),
    })
    return res.status(StatusCodes.CREATED).json(product)
  } catch (err) {
    const error = handleErrors(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
  }
}

export const updateProduct = async (req, res, next) => {
  try {
    const { name, description, delivery, price, categoryId, brandId } = req.body
    const id = req.params.id
    const user = res.locals.user
    const product = await Product.findOne({
      _id: toObjectId(id),
      owner: toObjectId(user),
    })
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: 'Product not found',
      })
    }

      const existing = await Product.findOne({ name: name })
      if (existing && existing.id !== product.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Product name already exists',
        })
      }

  if(brandId){
       const brand = await ProductBrand.findOne({
         _id: toObjectId(brandId),
         owner: toObjectId(user),
       })
     
       if (!brand) {
         return res.status(StatusCodes.NOT_FOUND).json({
           error: 'Product Brand  not found',
         })
       }
  }
  if(categoryId){
      const category = await ProductCategory.findOne({
        _id: toObjectId(categoryId),
        owner: toObjectId(user),
      })
      if (!categoryId) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: 'Product Category not found',
        })
      }
  }
    await product.update({
      name,
      description,
      delivery,
      price,
      categoryId: toObjectId(categoryId),
      brandId: toObjectId(brandId),
    })
    const updated = await Product.findById(id)
    return res.status(StatusCodes.OK).json({updated})
  } catch (err) {
    const error = handleErrors(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
  }
}

export const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id
    const user = res.locals.user
    const product = await Product.findOne({
      _id: toObjectId(id),
      owner: toObjectId(user),
    })
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: 'Product not found',
      })
    }
    const deleted = await product.delete()
    return res.status(StatusCodes.OK).json(deleted)
  } catch (err) {
    const error = handleErrors(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
  }
}

export const getOneProduct = async (req, res, next) => {
  try {
    const id = req.params.id
    const product = await Product.findOne({ id: toObjectId(id) })
      .populate('brand category')
      .sort('name ASC')
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: 'Product not found',
      })
    }
    return res.status(StatusCodes.OK).json(product)
  } catch (err) {
    const error = handleErrors(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
  }
}

export const listProducts = async (req, res, next) => {
  try {
    const products = await Product.find({})
      .populate('brand category')
      .sort('name ASC')
    return res.status(StatusCodes.OK).json({ products })
  } catch (err) {
    const error = handleErrors(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
  }
}
export const listProductsByUser = async (req, res, next) => {
  try {
    const user = res.locals.user
    const products = await Product.find({ owner: toObjectId(user) })
      .populate('brand category')
      .sort('name ASC')
    return res.status(StatusCodes.OK).json({ products })
  } catch (err) {
    const error = handleErrors(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
  }
}

export const listProductsBy = async (req, res, next) => {
  try {
    const { name, categoryId, brandId } = req.query
    const products = await Product.find({
      name: name,
      category: toObjectId(categoryId),
      brand: toObjectId(brandId),
    })
      .populate('brand category')
      .sort('name ASC')
    return res.status(StatusCodes.OK).json({ products })
  } catch (err) {
    const error = handleErrors(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
  }
}
