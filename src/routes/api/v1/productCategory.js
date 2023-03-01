import express from 'express'
import { requiresAuth } from '../../../middlewares/requiresAuth.js'
import { createProductCategory, deleteProductCategory, getOneProductCategory, listProductCategories, updateProductCategory } from '../../../controllers/productCategoryController.js'
export const ProductCategoryRoutes = express.Router()

ProductCategoryRoutes.post('category/', requiresAuth,createProductCategory)
ProductCategoryRoutes.patch('category/:id',requiresAuth,updateProductCategory)
ProductCategoryRoutes.delete('category/:id',requiresAuth,deleteProductCategory)
ProductCategoryRoutes.get('category/',requiresAuth,listProductCategories)
ProductCategoryRoutes.get('category/:id',requiresAuth,getOneProductCategory)
