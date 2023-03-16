import express from 'express'
import redoc from 'redoc-express'
import { StatusCodes } from 'http-status-codes'
import { AuthRoutes } from './api/v1/auth.js'
import { UserRoutes } from './api/v1/user.js'
import { ProductRoutes } from './api/v1/products.js'
import { ProductCategoryRoutes } from './api/v1/productCategory.js'
import { ProductBrandRoutes } from './api/v1/productBrands.js'
import { ReviewRoutes } from './api/v1/reviewRoute.js'
import { CheckoutRoutes } from './api/v1/checkout.js'
import { CartRoutes } from './api/v1/cart.js'
import { OrderRoutes } from './api/v1/order.js'

export const router = express.Router()

router.get('/docs/collection.json', (req, res) => {
  res.sendFile('src/doc/collection.json', { root: '.' })
})

router.get(
  '/docs',
  redoc({
    title: 'API Docs',
    specUrl: '/docs/collection.json',
  }),
)

router.use('/api/v1', AuthRoutes)
router.use('/api/v1', UserRoutes)
router.use('/api/v1', ProductRoutes)
router.use('/api/v1', ProductCategoryRoutes)
router.use('/api/v1', ProductBrandRoutes)
router.use('/api/v1', ReviewRoutes)
router.use('/api/v1', CheckoutRoutes)
router.use('/api/v1', CartRoutes)
router.use('/api/v1', OrderRoutes)

router.use((req, res) => {
  return res.status(StatusCodes.NOT_FOUND).json({})
})
