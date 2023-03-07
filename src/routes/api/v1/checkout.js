import express from 'express'
import { checkoutCart, getShippingAddress } from '../../../controllers/checkoutController.js'
import { requiresAuth } from '../../../middlewares/requiresAuth.js'

export const CheckoutRoutes = express.Router()

CheckoutRoutes.post('/checkout', requiresAuth, checkoutCart)
CheckoutRoutes.get('/checkout/delivery-info', requiresAuth, getShippingAddress)
