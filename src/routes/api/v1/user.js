import express from 'express'
import { changeCoverPhoto, changePassword, changeProfilePhoto, createAdminUser, deleteUser, fetchAllUsers, fetchOneUserById, updateUser } from '../../../controllers/userController.js'
import { requiresAuth } from '../../../middlewares/requiresAuth.js'

export const UserRoutes = express.Router()

UserRoutes.get('/users', fetchAllUsers)
UserRoutes.get('/user/:userId', fetchOneUserById)
UserRoutes.patch('/user', requiresAuth, updateUser)
UserRoutes.patch('/user/change-password', requiresAuth, changePassword)
UserRoutes.post('/user/upload-profile-photo', requiresAuth, changeProfilePhoto)
UserRoutes.post('/user/upload-cover-photo', requiresAuth, changeCoverPhoto)
UserRoutes.post('/user/add-admin', requiresAuth, createAdminUser)
UserRoutes.delete('/user/close-account', requiresAuth, deleteUser)
