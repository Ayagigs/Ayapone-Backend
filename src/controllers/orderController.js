import { StatusCodes } from 'http-status-codes'
import { Order } from '../models/Order.js'
import { User } from '../models/User.js'
import { OrderTracking } from '../models/OrderTracking.js'
import { EUserRole } from '../enums/EUserRole.js'
import { getDescription } from "../utils/describOrderStatus.js";

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
    const order = await Order.findOne({ _id: req.params.orderId }).populate('buyer merchant product')
    const orderTracking = await OrderTracking.find({ order: req.params.orderId })

    return res.status(StatusCodes.OK).json({ order, orderTracking })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}

export const trackOrder = async (req, res) => {
  const { orderId, status } = req.params
  try {
    const user = await User.findOne({ _id: res.locals.user })

    const order = await Order.findOneAndUpdate(
      { _id: orderId },
      { $set: {
          current_status: status.toLowerCase()
        }
      },
      { new: true }
    )
    const orderTracking = await OrderTracking.create({
      order,
      status: status.toLowerCase(),
      description: getDescription(status.toLowerCase(), user.user_role)
    })

    // TODO: notify (buyer || merchant) ?? 

    // TODO: process refunds ?? declined

    return res.status(StatusCodes.OK).json({ order, orderTracking })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}
