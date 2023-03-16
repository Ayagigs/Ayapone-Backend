import { StatusCodes } from 'http-status-codes'
import { Cart } from '../models/Cart.js'
import { Product } from '../models/Product.js'

export const addProductToCart = async (req, res) => {
  const { productId, quantity } = req.body
  
  try {
    const product = await Product.findOne({ _id: productId })
    if (!product) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: { message: "product not found" } })
    }

    const cartItem = { product, quantity, price: product.price }

    const cart = await Cart.findOne({ owner: res.locals.user })
    if (cart) {
      //check if product already in cart, if yes, update the quantity and amount
      let existingItemAmount = 0
      const existingItem = cart.products.filter((ele) => {
        if (ele.product == productId) {
          existingItemAmount = ele.price * ele.quantity
          ele.price = product.price
          ele.quantity = quantity
          console.log('old amount: ', existingItemAmount);
        }
        return ele.product == productId
      })

      if (existingItem.length > 0) {
        console.log('updating old item: ', existingItem);
        cart.total = (cart.total - existingItemAmount) + (product.price * quantity)
      } else {
        console.log('adding new item');
        cart.products.push(cartItem)
        cart.total = cart.total + (product.price * quantity)
      }

      await cart.save();

      return res.status(StatusCodes.CREATED).json({ cart })
    }

    const newCart = await Cart.create({
      owner: res.locals.user,
      products: cartItem,
      total: product.price * quantity
    })

    return res.status(StatusCodes.CREATED).json({ cart: newCart })

  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ owner: res.locals.user })

    return res.status(StatusCodes.OK).json({ cart })
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}

export const emptyCart = async (req, res) => {
  try{
    const cart = await Cart.findOne({ owner: res.locals.user })
    if (cart) {
      cart.total = 0.00
      cart.products = []

      await cart.save()
    }

    return res.status(StatusCodes.OK).json({ cart })
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}

export const removeProductFromCart = async (req, res) => {
  const { productId } = req.body
  try {
    const cart = await Cart.findOne({ owner: res.locals.user })
    if (cart) {
      let amount = 0
      cart.products = cart.products.filter((ele) => {
        if (ele.product == productId) {
          amount = ele.price * ele.quantity
        }
        return ele.product != productId
      })

      cart.total = cart.total - amount
      await cart.save()
    }
    
    return res.status(StatusCodes.OK).json({ cart })
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}
