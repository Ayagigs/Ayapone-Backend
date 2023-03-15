import express from 'express'
import { fetchAllNotification, getNotification, deleteNotification, } from '../../../controllers/userNotificationController.js'
export const NotificationRoutes = express.Router()

NotificationRoutes.get('/all', fetchAllNotification)
NotificationRoutes.get('/:id', getNotification)
NotificationRoutes.delete('/:id', deleteNotification)
