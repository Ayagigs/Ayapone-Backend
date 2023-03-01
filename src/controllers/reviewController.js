import { StatusCodes } from 'http-status-codes'
import { Order } from '../models/Order.js'
import { Product } from '../models/Product.js'
import { ProductReview } from '../models/ProductReview.js'

export const createReview = async (req, res) => {
  const { orderId, productId, comment, rating } = req.body

  try {
    const order = await Order.findById(orderId)
    const product = await Product.findById(productId)
    if (order && product) {
      const review = await ProductReview.create({
        order,
        product,
        user: res.locals.user,
        comment,
        rating,
      })

      return res.status(StatusCodes.CREATED).json({ review })
    }

    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: { message: 'Order || Product does not exist.' } })
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}

export const getReviewsByProductId = async (req, res) => {
  try {
    const reviews = await ProductReview.find({ product: req.params.productId }).populate('product').populate('order')

    return res.status(StatusCodes.OK).json({ reviews })
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}

export const getReviewsByCurrentUser = async (req, res) => {
  try {
    const reviews = await ProductReview.find({ user: res.locals.user }).populate('product').populate('order')

    return res.status(StatusCodes.OK).json(reviews)
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}

export const getReviewById = async (req, res) => {
  try {
    const review = await ProductReview.findOne({
      _id: req.params.reviewId,
    }).populate('product').populate('order')

    if (!review) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Review not found' })
    }

    return res.status(StatusCodes.OK).json(review)
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}

export const updateReview = async (req, res) => {
  const { comment, rating } = req.body
  try {
    const review = await ProductReview.findOne({ _id: req.params.reviewId })

    if (!review) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Review not found' })
    }

    if (review.user.toString() !== res.local.user.toString()) {
      return res.status(StatusCodes.NOT_ACCEPTABLE).json({ error: 'You are not allowed to perform this action on this resource.' })
    }

    review.comment = comment
    review.rating = rating
    await review.save()

    return res.status(StatusCodes.OK).json(review)
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}

export const deleteReview = async (req, res) => {
  try {
    const review = await ProductReview.findOne({ _id: req.params.reviewId })

    if (!review) {
      return res.status(404).send({ error: 'Review not found' })
    }

    if (review.user.toString() !== res.local.user.toString()) {
      return res.status(StatusCodes.NOT_ACCEPTABLE).json({ error: 'You are not allowed to perform this action on this resource.' })
    }

    await review.remove()

    return res.status(StatusCodes.OK).json({ success: "REVIEW DELETED" })
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}
