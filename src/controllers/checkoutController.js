import { StatusCodes } from 'http-status-codes'
import randomId from 'random-id'
import { Cart } from '../models/Cart.js'
import { Order } from '../models/Order.js'
import { OrderTracking } from '../models/OrderTracking.js'
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

      const batchId = randomId(10, 'AaO')

      // revalidate cart item prices and create order for each product
      let orders = await Promise.all(cart.products.map(async (ele) => {
        const product = await Product.findOne({ _id: ele.product })
        let item = []
        if (product) {
          // sub_total = sub_total + (product.price * ele.quantity)
          const order = await Order.create({
            buyer: cart.owner,
            merchant: product.owner,
            product: product._id,
            quantity: ele.quantity,
            price: product.price,
            delivery_fee: product.delivery,
            batch: batchId,
            delivery_info: { 
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
            },
          })

          if (order) {
            await OrderTracking.create({
              order,
              status: order.current_status
            })
          }

          item.push(order)
        }

        return item
      }))

      // empty the cart
      cart.total = 0.00
      cart.products = []
      await cart.save()

      //TODO: create a transaction for this order batch

      return res.status(StatusCodes.CREATED).json({ orders })
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
