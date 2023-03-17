import express from 'express'
import {
  fetchAllNotification,
  getNotification,
  markAsRead,
  deleteNotification,
} from '../../../controllers/notificationController.js'
import { requiresAuth } from '../../../middlewares/requiresAuth.js'

export const NotificationRoutes = express.Router()

NotificationRoutes.get('/notifications', requiresAuth, fetchAllNotification)
NotificationRoutes.get('/notifications/:notificationId', requiresAuth, getNotification)
NotificationRoutes.patch('/notifications/:notificationId/read', requiresAuth, markAsRead)
NotificationRoutes.delete('/notifications/:notificationId', requiresAuth, deleteNotification)
