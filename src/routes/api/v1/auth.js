import express from 'express'
import { login, register, requestPasswordReset, setNewPassword, regenerateToken } from '../../../controllers/api/authController'

export const authRoutes = express.Router()

authRoutes.post('auth/login', login)
authRoutes.post('auth/register', register)
authRoutes.post('auth/request-password-reset', requestPasswordReset)
authRoutes.post('auth/reset-password', setNewPassword)
authRoutes.post('auth/regenerate-token', regenerateToken)
