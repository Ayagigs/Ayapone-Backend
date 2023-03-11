import express from 'express'
import { addProductToCart, getCart, emptyCart, removeProductFromCart } from '../../../controllers/cartController.js'
import { requiresAuth } from '../../../middlewares/requiresAuth.js'

export const CartRoutes = express.Router()

CartRoutes.post('/cart', requiresAuth, addProductToCart)
CartRoutes.get('/cart', requiresAuth, getCart)
CartRoutes.post('/cart', requiresAuth, emptyCart)
CartRoutes.post('/cart', requiresAuth, removeProductFromCart)
