import express from 'express'
import { changeCoverPhoto, changePassword, changeProfilePhoto, createAdminUser, deleteUser, fetchAllUsers, fetchOneUserById, updateUser } from '../../../controllers/userController.js'
import { requiresAuth } from '../../../middlewares/requiresAuth.js'

export const UserRoutes = express.Router()

UserRoutes.get('/users', fetchAllUsers)
UserRoutes.get('/users/:userId', fetchOneUserById)

UserRoutes.patch('/user', requiresAuth, updateUser)
UserRoutes.post('/user/add-admin', requiresAuth, createAdminUser)
UserRoutes.post('/user/change-password', requiresAuth, changePassword)
UserRoutes.post('/user/upload-profile-photo', requiresAuth, changeProfilePhoto)
UserRoutes.post('/user/upload-cover-photo', requiresAuth, changeCoverPhoto)
UserRoutes.post('/user/close-account', requiresAuth, deleteUser)
