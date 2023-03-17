import { StatusCodes } from 'http-status-codes'
import { Notification } from '../models/Notification.js'

export const fetchAllNotification = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: res.locals.user })

    return res.status(StatusCodes.OK).json({ notifications })
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}

export const getNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.notificationId })

    return res.status(StatusCodes.OK).json({ notification })
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.notificationId },
      { $set: {
          read: true
        }
      },
      { new: true }
    )

    return res.status(StatusCodes.OK).json({ notification })
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}

export const deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.findOneAndRemove({ _id: req.params.notificationId })
    if (deleted) {
      return res.status(StatusCodes.OK).json({ message: 'deleted' })
    }

    throw Error('failed to delete notification')
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}
