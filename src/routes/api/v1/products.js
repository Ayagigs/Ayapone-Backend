import express from 'express'
import {
  createProduct,
  deleteProduct,
  getOneProduct,
  listProducts,
  updateProduct,
  listProductsBy,
  listProductsByUser,
} from '../../../controllers/productController.js'
import { requiresAuth } from '../../../middlewares/requiresAuth.js'

export const ProductRoutes = express.Router()

ProductRoutes.post('/products/', requiresAuth, createProduct)
ProductRoutes.get('/products/', listProducts)
ProductRoutes.get('/products/user', listProductsByUser)
ProductRoutes.delete('/products/:id', requiresAuth, deleteProduct)
ProductRoutes.get('/products/:id', getOneProduct)
ProductRoutes.get('/products/by', listProductsBy)
ProductRoutes.patch('/products/:id', requiresAuth, updateProduct)


