import { StatusCodes } from 'http-status-codes'
import { Order } from '../models/Order.js'
import { OrderTracking } from '../models/OrderTracking.js'

export const fetchOrdersForBuyer = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: res.locals.user }).populate('merchant product')

    return res.status(StatusCodes.OK).json({ orders })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}

export const fetchOrdersForMerchant = async (req, res) => {
  try {
    const orders = await Order.find({ merchant: res.locals.user }).populate('buyer product')

    return res.status(StatusCodes.OK).json({ orders })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}

export const fetchOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.param }).populate('buyer merchant product')
    const orderTracking = await OrderTracking.find({ order: req.param })

    return res.status(StatusCodes.OK).json({ order, orderTracking })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}
