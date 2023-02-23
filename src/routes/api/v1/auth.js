import express from 'express'
import { login, register, requestPasswordReset, setNewPassword, regenerateToken } from '../../../controllers/authController.js'

export const AuthRoutes = express.Router()

AuthRoutes.post('auth/login', login)
AuthRoutes.post('auth/register', register)
AuthRoutes.post('auth/request-password-reset', requestPasswordReset)
AuthRoutes.post('auth/reset-password', setNewPassword)
AuthRoutes.post('auth/regenerate-token', regenerateToken)
