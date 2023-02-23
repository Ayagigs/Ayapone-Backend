import express from 'express'
import { ApiRoutes } from './api/index'
import { StatusCodes } from 'http-status-codes'

export const router = express.Router()

router.use('/api/v1', ApiRoutes)
router.use((req, res) => {
  return res.status(StatusCodes.NOT_FOUND).json({})
})