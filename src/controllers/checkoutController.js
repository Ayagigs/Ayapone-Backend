import { StatusCodes } from 'http-status-codes'
import { Cart } from '../models/Cart.js'
import { Order } from '../models/Order.js'
import { Product } from '../models/Product.js'
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
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({ error: { message: 'Failed to place order. REASON: Cart is empty!'} })
      }

      // revalidate cart item prices and calculate the sub_total
      let sub_total = 0
      let purchasedProducts = await Promise.all(cart.products.map(async (ele) => {
        const product = await Product.findOne({ _id: ele.product })
        let item = {}
        if (product) {
          item.product = product._id
          item.quantity = ele.quantity
          item.price = product.price
          item.merchant = product.owner
          sub_total = sub_total + (product.price * ele.quantity)
        }

        return item
      }))

      // create order
      const order = await Order.create({
        buyer: cart.owner,
        products: purchasedProducts,
        sub_total,
        delivery_info: shippingAddress,
      })

      // empty the cart
      cart.total = 0.00
      cart.products = []
      await cart.save()

      //TODO: create a transaction for this order

      return res.status(StatusCodes.CREATED).json({ order })
    }

    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: { message: 'Order || Product does not exist.' } })
  } catch (error) {
    console.log(error)
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
