import express from 'express'
import { AuthRoutes } from './api/v1/auth.js'
import { StatusCodes } from 'http-status-codes'

export const router = express.Router()

router.use('/api/v1', AuthRoutes)
router.use((req, res) => {
  return res.status(StatusCodes.NOT_FOUND).json({})
})