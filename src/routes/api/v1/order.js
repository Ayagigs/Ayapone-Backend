import express from 'express'
import {
  fetchOrderHistory,
  fetchOrderById,
  trackOrder
} from '../../../controllers/orderController.js'
import { requiresAuth } from '../../../middlewares/requiresAuth.js'

export const OrderRoutes = express.Router()

OrderRoutes.get('/orders', requiresAuth, fetchOrderHistory)
OrderRoutes.get('/orders/:orderId', requiresAuth, fetchOrderById)
OrderRoutes.patch('/orders/:orderId/:status', requiresAuth, trackOrder)

