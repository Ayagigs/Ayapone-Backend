import { StatusCodes } from 'http-status-codes'
import { Product } from '../models/Product.js'
import { handleErrors } from '../utils/errorHandler.js'
import {toObjectId} from '../utils/convert.js'

export const createProduct = async (req, res, next) => {
  const { name, description, delivery, price, categoryId, brandId } = req.body
  try {
    const user = req.locals.user
    if (!delivery || !description || !price || !name) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Please fill all fields',
      })
    }
    const existingProduct = await Product.findOne({ name })
    if (existingProduct) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Product already exists',
      })
    }

    const product = await Product.create({
      name,
      description,
      delivery,
      price,
      categoryId,
      brandId,
      owner: user,
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
    const user = req.locals.user
    const product = await Product.findOne({ id: toObjectId(id), owner: user })
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: 'Product not found',
      })
    }
    const existingProduct = await Product.findOne({name})
    if(existingProduct){
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Product name already exists',
      })
    }
    const updated = await product.updateOne({
      name,
      description,
      delivery,
      price,
      categoryId,
      brandId,
    })
    return res.status(StatusCodes.OK).json(updated)
  } catch (err) {
    const error = handleErrors(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
  }
}

export const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id
    const user = req.locals.user
    const product = await Product.findOne({ id: toObjectId(id), owner: user })
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: 'Product not found',
      })
    }
    const deleted = product.delete()
    return res.status(StatusCodes.OK).json(deleted)
  } catch (err) {
    const error = handleErrors(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
  }
}

export const getOneProduct = async (req, res, next) => {
  try {
    const id = req.params.id
    const product = await Product.findOne({ id: toObjectId(id) }).populate('brands categories').sort('name ASC')
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
    return res.status(StatusCodes.OK).json({ products }).populate('brands categories').sort('name ASC')
  } catch (err) {
    const error = handleErrors(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
  }
}
export const listProductsByUser = async (req, res, next) => {
  try {
    const user = req.locals.user
    const products = await Product.find({ owner: user }).populate('brands categories').sort('name ASC')
    return res.status(StatusCodes.OK).json({ products })
  } catch (err) {
    const error = handleErrors(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
  }
}

export const listProductsBy = async (req, res, next) => {
 try {
   const {name,categoryId,brandId} = req.query
   const products = await Product.find({ name: name, categoryId: toObjectId(categoryId),brandId: toObjectId(brandId) }).populate('brands categories').sort('name ASC')
   return res.status(StatusCodes.OK).json({ products })
 } catch (err) {
  const error = handleErrors(err)
   return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
 }
}
