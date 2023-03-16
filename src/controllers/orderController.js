import { StatusCodes } from 'http-status-codes'
import { Order } from '../models/Order.js'
import { User } from '../models/User.js'
import { OrderTracking } from '../models/OrderTracking.js'
import { EOrderStatus } from '../enums/EOrderStatus.js'

export const fetchAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('buyer merchant product')

    return res.status(StatusCodes.OK).json({ orders })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}

export const fetchPurchaseHistory = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: res.locals.user }).populate('merchant product')

    return res.status(StatusCodes.OK).json({ orders })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}

export const fetchSalesHistory = async (req, res) => {
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

export const acceptOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.param },
      { $set: {
          current_status: EOrderStatus.ACCEPTED.toString()
        }
      },
      { new: true }
    )
    const orderTracking = await OrderTracking.create({
      order,
      status: EOrderStatus.ACCEPTED,
      description: 'merchant accepted to deliver product.'
    })

    // TODO: notify buyer

    return res.status(StatusCodes.OK).json({ order, orderTracking })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}

export const declineOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.param },
      { $set: {
          current_status: EOrderStatus.DECLINED.toString()
        }
      },
      { new: true }
    )
    const orderTracking = await OrderTracking.create({
      order,
      status: EOrderStatus.DECLINED,
      description: 'merchant declined to deliver product.'
    })

    // TODO: process refunds

    // TODO: notify buyer

    return res.status(StatusCodes.OK).json({ order, orderTracking })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}

