import { StatusCodes } from 'http-status-codes'
import { Order } from '../models/Order.js'
import { User } from '../models/User.js'
import { OrderTracking } from '../models/OrderTracking.js'
import { EOrderStatus } from '../enums/EOrderStatus.js'
import { EUserRole } from '../enums/EUserRole.js'

export const fetchOrderHistory = async (req, res) => {
  try {
    const user = await User.findOne({ _id: res.locals.user })

    let query = {}, fill = 'buyer merchant product'

    if (user.user_role == EUserRole.BUYER) {
      query = { buyer: res.locals.user }
      fill = 'merchant product'
    }

    if (user.user_role == EUserRole.MERCHANT) {
      query = { merchant: res.locals.user }
      fill = 'buyer product'
    }

    const orders = await Order.find(query).populate(fill)

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

export const cancelOrder = async (req, res) => {
  try {
    const user = await User.findOne({ _id: res.locals.user })
    const order = await Order.findOneAndUpdate(
      { _id: req.param },
      { $set: {
          current_status: EOrderStatus.CANCELLED.toString()
        }
      },
      { new: true }
    )
    const orderTracking = await OrderTracking.create({
      order,
      status: EOrderStatus.CANCELLED,
      description: `${user.user_role.toString()} cancelled order.`
    })

    // TODO: process refunds

    // TODO: notify buyer || merchant

    return res.status(StatusCodes.OK).json({ order, orderTracking })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}

export const deliverOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.param },
      { $set: {
          current_status: EOrderStatus.DELIVERED.toString()
        }
      },
      { new: true }
    )
    const orderTracking = await OrderTracking.create({
      order,
      status: EOrderStatus.DELIVERED,
      description: 'merchant delivered product.'
    })

    // TODO: notify buyer

    return res.status(StatusCodes.OK).json({ order, orderTracking })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}