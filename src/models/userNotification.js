import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    
    notifications: [
    orderID: {
    type: Number,
       
    },
    message: {
    type: string,
          
    },
      
],
    email: {
      type: string,
      
    },
  },

  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    toJSON: {
      virtuals: true,
    },
  },
)

notificationSchema.methods.toJSON = function () {
  var obj = this.toObject()
  delete obj.__v
  return obj
}

export const Notification = mongoose.model('notifications', notificationSchema)
