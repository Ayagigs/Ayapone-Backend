import { StatusCodes } from 'http-status-codes'
import { notifications } from '../models/userNotification.js'

export const fetchAllNotification = async (req, res) => {
  const { orderId, message,email } = req.body
  
  try {
    const notification = await Notifications.findOne({ orderID })
    if (!notification) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: { message: "notification not found" } })
    }
    
    if (notification) {
        return res.status(StatusCodes.OK).json({ notification found })
        }
              
      })

    await notification.save();

      
    }
   
export const getNotification = async (req, res) => {
  try {
    const notify = await Notifications.findOne({ orderid })

    return res.status(StatusCodes.OK).json({ notification })
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
}

export const deleteNotification = async (req, res) => {
  const { orderId } = req.body
  try {
    const notification = await Notifications.findOneAndDelete({ orderID })
    if (notification) {
        return res.status(StatusCodes.OK).json({ notification })
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(error.message)
  }
    
      await notification.save()
    }
     
}
