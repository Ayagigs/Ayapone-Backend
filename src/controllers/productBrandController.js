import { StatusCodes } from 'http-status-codes'
import { ProductBrand } from '../models/ProductBrand.js'
import { toObjectId } from '../utils/convert.js'
import { handleErrors } from '../utils/errorHandler.js'
export const createProductBrand = async (req, res, next) => {
  try {
    const { name } = req.body
     const user = res.locals.user
     console.log(user);
    if (!name) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Name is required',
      })
    }
    const exists = await ProductBrand.findOne({ name, owner: toObjectId(user) })
    if (exists) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Product brand already exists',
      })
    }
    const brand = await ProductBrand.create({ name, owner: toObjectId(user) })
    res.status(StatusCodes.CREATED).json(brand)
  } catch (err) {
    const error = handleErrors(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
  }
}

export const updateProductBrand = async (req, res, next) => {
  try {
    const { name } = req.body
    const id = req.params.id
    const user = res.locals.user
    const existing = await ProductBrand.findOne({
      name,
      owner: toObjectId(user),
    })
    const update = await ProductBrand.findOne({
      _id: toObjectId(id),
      owner: toObjectId(user),
    })
    if (existing && existing.id !== update.id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Product brand name exist',
      })
    }
     await update.update({name})
     const updated = await ProductBrand.findById(id)
    res.status(StatusCodes.OK).json(updated)
  } catch (err) {
    const error = handleErrors(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
  }
}

export const deleteProductBrand = async (req, res, next) => {
  try {
    const id = req.params.id
    const user = res.locals.user
    const productBrand = await ProductBrand.findOne({
      _id: toObjectId(id),
      owner: toObjectId(user),
    })
    if (!productBrand) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Product brand does not exist',
      })
    }
    const deleted = await productBrand.delete({})
    return res.status(StatusCodes.OK).json({ deleted: deleted })
  } catch (err) {
    const error = handleErrors(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
  }
}

export const getOneProductBrand = async (req, res, next) => {
  try {
    const id = req.params.id
    const user = res.locals.user
    const productBrand = await ProductBrand.findOne({
      _id: toObjectId(id),
      owner: toObjectId(user),
    })
    if (!productBrand) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Product brand does not exist',
      })
    }
    res.status(StatusCodes.OK).json(productBrand)
  } catch (err) {
    const error = handleErrors(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
  }
}

export const listProductBrands = async (req, res, next) => {
  try {
    const user = res.locals.user
    const productBrands = await ProductBrand.find({ owner: toObjectId(user) })
    res.status(StatusCodes.OK).json(productBrands)
  } catch (err) {
    const error = handleErrors(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
  }
}
