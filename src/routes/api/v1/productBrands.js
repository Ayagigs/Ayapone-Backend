import {
  createProductBrand,
  deleteProductBrand,
  listProductBrands,
  updateProductBrand,
  getOneProductBrand,
} from '../../../controllers/productBrandController.js'
import express from 'express'
import { requiresAuth } from '../../../middlewares/requiresAuth.js'
export const ProductBrandRoutes = express.Router()
ProductBrandRoutes.post('/brands', requiresAuth, createProductBrand)
ProductBrandRoutes.get('/brands', requiresAuth, listProductBrands)
ProductBrandRoutes.get('/brands/:id', requiresAuth, getOneProductBrand)
ProductBrandRoutes.delete('/brands/:id', requiresAuth, deleteProductBrand)
ProductBrandRoutes.patch('/brands/:id', requiresAuth, updateProductBrand)
