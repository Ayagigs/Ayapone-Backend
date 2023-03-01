import express from 'express'
import {createProduct,deleteProduct,getOneProduct,listProducts,updateProduct,listProductsBy, listProductsByUser} from '../../../controllers/productController'
import { requiresAuth } from '../../../middlewares/requiresAuth.js'

export const ProductRoutes = express.Router()

ProductRoutes.post('/', requiresAuth,createProduct)
ProductRoutes.get('/',listProducts)
ProductRoutes.get('/:id',getOneProduct)
ProductRoutes.get('/by', requiresAuth,listProductsBy)
ProductRoutes.patch('/:id', requiresAuth,updateProduct)
ProductRoutes.delete('/:id', requiresAuth,deleteProduct)
ProductRoutes.get('/user',requiresAuth,listProductsByUser)