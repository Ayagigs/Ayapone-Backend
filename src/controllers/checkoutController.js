import { StatusCodes } from 'http-status-codes'
import { Cart } from '../models/Cart.js'
import { Order } from '../models/Order.js'
import { ShippingAddress } from '../models/ShippingAddress.js'

export const checkoutCart = async (req, res) => {
  const { last_name, first_name, email, phone_number, addrress_one, addrress_two, city, state, country, postal_code } = req.body
  
  try {
    const shippingAddress = await ShippingAddress.findOneAndUpdate(
      { _id: res.locals.user },
      { $set: { 
          last_name,
          first_name,
          email,
          phone_number,
          addrress_one,
          addrress_two,
          city,
          state,
          country,
          postal_code
        }
      },
      { new: true, upsert: true },
    )

    const cart = await Cart.findOne({ owner: res.locals.user }).populate('products')
    if (shippingAddress && cart) {
      if (cart.products.length <= 0) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({ error: { message: 'System cannot place an empty.'} })
      }

      //TODO: validate the current price of each product and update grand total as such.

      const order = await Order.create({
        buyer: cart.owner,
        products: cart.products,
        sub_total: cart.total,
        delivery_info: shippingAddress,
      })

      //TODO: create a transaction for this order

      return res.status(StatusCodes.CREATED).json({ order })
    }

    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: { message: 'Order || Product does not exist.' } })
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}

export const getShippingAddress = async (req, res) => {
  try {
    const shippingAddress = await ShippingAddress.findOne({ user: req.locals.user })

    return res.status(StatusCodes.OK).json({ shippingAddress })
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}
