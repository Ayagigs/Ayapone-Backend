import express from 'express'
import { GoogleAuth } from '../../../auth/strategies/index.js'
import { login, register, verifyAccount, requestPasswordReset, setNewPassword, regenerateToken } from '../../../controllers/authController.js'
import { requiresAuth } from '../../../middlewares/requiresAuth.js'

export const AuthRoutes = express.Router()
const google = new GoogleAuth()

AuthRoutes.post('/auth/login', login)
AuthRoutes.post('/auth/register', register)
AuthRoutes.post('/auth/verify', verifyAccount)
AuthRoutes.get('/auth/google',google.authenticate)
AuthRoutes.get('/google/callback', google.callback)
AuthRoutes.post('/auth/request-password-reset', requestPasswordReset)
AuthRoutes.post('/auth/reset-password', setNewPassword)
AuthRoutes.post('/auth/regenerate-token', requiresAuth, regenerateToken)
