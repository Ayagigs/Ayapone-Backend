import { User } from '../models/User.js'
import { MerchantKYC } from '../models/MerchantKYC.js'
import { handleErrors } from '../utils/errorHandler.js'
import { hashPassword } from '../utils/hashPassword.js'
import { EUserRole } from '../enums/EUserRole.js'
import mailer from '../utils/mailer.js'
import { cloudImageUpload } from '../utils/fileHandler.js'
import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcrypt'
import randomId from 'random-id'

export const fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
    if (!users) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'users not found' })
    }

    return res.status(StatusCodes.OK).json({ users })
  } catch (err) {
    const error = handleErrors(err)
    return res.status(StatusCodes.BAD_REQUEST).json({ error })
  }
}

export const fetchOneUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId })
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: { message: 'user not found' }})
    }

    const businesses = await MerchantKYC.find({ owner: user })

    return res.status(StatusCodes.OK).json({ user, businesses })

  } catch (err) {
    const error = handleErrors(err)
    return res.status(StatusCodes.BAD_REQUEST).json({ error })
  }
}

export const updateUser = async (req, res) => {
  const { last_name, first_name, phone_number, username, id_type, id_number, id_front_image_url, id_back_image_url } = req.body

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.locals.user },
      { $set: { 
          last_name,
          first_name,
          phone_number,
          username,
          id_type,
          id_number,
          id_front_image_url,
          id_back_image_url
        }
      },
      { new: true },
    )
    
    if (!updatedUser) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: { message: 'user not found' }})
    }

    return res.status(StatusCodes.OK).json({ updatedUser })
  } catch (err) {
    const error = handleErrors(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
  }
}

export const changePassword = async (req, res) => {
  const { old_password, new_password } = req.body
    try {
      const user = await User.findOne({ _id: res.locals.user, is_deleted: false })
      if (!user) {
        throw Error('user not found')
      }
      
      if (old_password && old_password.length > 0) {
        const pwd = await bcrypt.compare(old_password, user.password)
        if (pwd) {
          const pwdHash = await hashPassword(new_password)

          user.password = pwdHash
          await user.save()

          return res.status(StatusCodes.OK).json({ success: 'SUCCESSFUL' })
        }
      }

      // failed credentials
      throw Error('invalid old password')
    } catch (err) {
      const error = handleErrors(err)
      return res.status(StatusCodes.BAD_REQUEST).json({ error })
    }
}

export const changeProfilePhoto = async (req, res) => {
    try {
      const user = await User.findOne({ _id: res.locals.user, is_deleted: false })
      if (!user) {
        throw Error('user not found')
      }

      const upload = await cloudImageUpload(req)

      if(upload && upload.status == true){
        user.profile_photo = upload.urls[0]
        user.save()
  
        return res.status(StatusCodes.OK).json({ success: 'SUCCESSFUL', profile_photo: upload.urls[0] })
      }

      throw Error(upload)
    } catch (err) {
      return res.status(StatusCodes.BAD_REQUEST).json({ err })
    }
}

export const changeCoverPhoto = async (req, res) => {
  try {
    const user = await User.findOne({ _id: res.locals.user, is_deleted: false })
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'user not found' })
    }

    const upload = await cloudImageUpload(req)

    if(upload && upload.status == true){
      user.cover_photo = upload.urls[0]
      user.save()

      return res.status(StatusCodes.OK).json({ success: 'SUCCESSFUL', cover_photo: upload.urls[0] })
    }

    throw Error(upload)
  } catch (err) {
    console.log(err)
    return res.status(StatusCodes.BAD_REQUEST).json({ err })
  }
}

export const deleteUser = async (req, res) => {
  try {
    // deleting a user requires delinting all data that partains to that user.
    // This will lead to inconsistencies in data, hence we would implement soft-delete

    const deletedUser = await User.findOneAndUpdate(
      { _id: res.locals.user, is_deleted: false },
      { $set: { is_deleted: true } },
      { new: true },
    )

    // also delete merchant kyc too if available
    const deletedKyc = await MerchantKYC.findOneAndUpdate(
      { owner: res.locals.user },
      { $set: { is_deleted: true } },
      { new: true },
    )

    return res.status(StatusCodes.OK).json({ success: "ACCOUNT DELETED" })
  } catch (err) {
    const error = handleErrors(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
  }
}

export const createAdminUser = async (req, res) => {
  const { last_name, first_name, email, phone_number, password } = req.body

  try {
    const emailExists = await User.findOne({ email: email })
    if (emailExists) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: { email: 'Email already exists' }})
    }

    const pwdHash = await hashPassword(password)
    const emailCode = randomId(6, '000')

    const user = await User.create({
      last_name,
      first_name,
      phone_number,
      email,
      password: pwdHash,
      email_verification_token: emailCode,
      user_role: EUserRole.ADMIN
    })

    let sender = process.env.EMAIL_NO_REPLY
    let appName = process.env.APP_NAME
    const data = {
      to: email,
      from: sender,
      name: appName,
      subject: `${appName} Account Verification`,
      text: `Congratulations ${user.full_name}, You have been given elevated access to ${appName} platform. Use this token to verify your email: ${user.email_verification_token}`,
      html: `Congratulations ${user.full_name}, <p>You have been given elevated access to ${appName} platform.<br />Use this token to verify your email:</p> <h2>${user.email_verification_token} </h2><br /><br /><h3><a href="${process.env.BASE_URL}">${appName}</a></h3>`,
    }

    const mailsender = mailer(data)

    return res.status(StatusCodes.CREATED).json({ user, token })
  } catch (err) {
    const error = handleErrors(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
  }
}