import { StatusCodes } from 'http-status-codes'
import { ProductCategory } from '../models/ProductCategory.js'
import { toObjectId } from '../utils/convert.js'
import { handleErrors } from '../utils/errorHandler.js'
export const createProductCategory = async (req, res, next) => {
  try {
    const { name } = req.body
    const user = res.locals.user
    if (!name) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Name is required',
      })
    }
    const exists = await ProductCategory.findOne({ name,owner:toObjectId(user) })
    if (exists) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Product category name already exists',
      })
    }
    const category = await ProductCategory.create({ name, owner: toObjectId(user) })
    res.status(StatusCodes.CREATED).json(category)
  } catch (err) {
    const error = handleErrors(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
  }
}

export const updateProductCategory = async (req, res, next) => {
  try {
    const { name } = req.body
    const id = req.params.id
    const user = res.locals.user
    const existing = await ProductCategory.findOne({
      name,
      owner: toObjectId(user),
    })
    const update = await ProductCategory.findOne({
      _id: toObjectId(id),
      owner: toObjectId(user),
    })
    if (!update) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Product category does not exist',
      })
    }
    if (existing && existing.id !== update.id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Product category name exist',
      })
    }
    
    await update.update({ name })
    const updated =  await ProductCategory.findById(id)
    res.status(StatusCodes.OK).json(updated)
  } catch (err) {
    const error = handleErrors(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
  }
}

export const deleteProductCategory = async (req, res, next) => {
  try {
    const id = req.params.id
    const user = res.locals.user
    const exists = await ProductCategory.findOne({
      _id: toObjectId(id),
      owner: toObjectId(user),
    })
    if (!exists) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Product category does not exist',
      })
    }
    const deleted = await exists.delete()
    return res.status(StatusCodes.OK).json({ deleted: deleted })
  } catch (err) {
    const error = handleErrors(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
  }
}

export const getOneProductCategory = async (req, res, next) => {
  try {
    const id = req.params.id
    const user = res.locals.user
    const category = await ProductCategory.findOne({
      _id: toObjectId(id),
      owner: toObjectId(user),
    })
    if (!category) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Product category does not exist',
      })
    }
    res.status(StatusCodes.OK).json(category)
  } catch (err) {
    const error = handleErrors(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
  }
}

export const listProductCategories = async (req, res, next) => {
  try {
    const user = res.locals.user
    const categories = await ProductCategory.find({ owner: toObjectId(user) })
    res.status(StatusCodes.OK).json(categories)
  } catch (err) {
    const error = handleErrors(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
  }
}
