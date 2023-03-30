import { User } from '../models/User.js'
import { MerchantKYC } from '../models/MerchantKYC.js'
import { UserWallet } from '../models/UserWallet.js'
import { createToken } from '../utils/createJwt.js'
import { handleErrors } from '../utils/errorHandler.js'
import { hashPassword } from '../utils/hashPassword.js'
import { EUserRole } from '../enums/EUserRole.js'
import mailer from '../utils/mailer.js'
import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcrypt'
import randomId from 'random-id'

export const login = async (req, res) => {
  const { email, password, remember_me } = req.body
  let businessKyc
  try {
    const user = await User.findOne({ email: email, is_deleted: false })
    if (!user) {
      throw Error('invalid credentials')
    }

    if (user.password && user.password.length > 0) {
      const pwd = await bcrypt.compare(password, user.password)
      if (pwd) {
        const token = createToken({
          id: user._id,
          remember_me,
        })

        const wallet = await UserWallet.findOne({user:user._id})
        
        if (user.user_role == EUserRole.MERCHANT) {
          businessKyc = await MerchantKYC.findOne({owner:user_id})
        }

        const response = {
          status: 'success',
          message: 'successful',
          data: { user, token, wallet, businessKyc }
        }
        
        return res.status(StatusCodes.OK).json(response)
      }
    }

    // failed credentials
    throw Error('invalid credentials')
  } catch (err) {
    const error = handleErrors(err)
    const response = {
      status: 'error',
      message: err.message,
      data: {error}
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}

export const register = async (req, res) => {
  const { last_name, first_name, email, phone_number, password, id_type, id_number, id_front_image_url, id_back_image_url, businessKyc, userId } = req.body

  let user, token
  try {
    if(!userId){
      const emailExists = await User.findOne({ email: email })
      if (emailExists) {
        const response = {
          status: 'success',
          message: 'Email already exist.',
          data: {}
        }
        
        return res.status(StatusCodes.BAD_REQUEST).json(response)
      }

      const pwdHash = await hashPassword(password)
      const emailCode = randomId(4, '000')

      user= await User.create({
        last_name,
        first_name,
        phone_number,
        email,
        password: pwdHash,
        email_verification_token: emailCode,
        id_type,
        id_number,
        id_front_image_url,
        id_back_image_url
      })
    } else {
      user = await User.findById(userId)
    }

    const wallet = await UserWallet.create({
      user: user
    })

    if (!user.is_email_verified) {
      let sender = process.env.EMAIL_NO_REPLY
      let appName = process.env.APP_NAME
      const data = {
        to: email,
        from: sender,
        name: appName,
        subject: `${appName} Account Verification`,
        text: `Thank you for joining ${appName}. Use this token to complete your registration: ${user.email_verification_token}`,
        html: `Thank you for joining <h3><a href="${process.env.BASE_URL}">${appName}</a></h3>.<br /> Use this token to complete your registration: <h2>${user.email_verification_token} </h2>`,
      }

      const mailsender = mailer(data)

      token = createToken({ id: user._id })
    }

    if (businessKyc) {
      const { business_name, registration_number, business_type, address, city, state, country, postal_code, wallet_address, wallet_address_type, wallet_address_nickname } = businessKyc

      const kyc = await MerchantKYC.create({
        owner: user,
        business_name,
        registration_number,
        business_type,
        address,
        city,
        state,
        country,
        postal_code,
        wallet_address,
        wallet_address_type,
        wallet_address_nickname
      })

      user.user_role = EUserRole.MERCHANT
      await user.save()

      const response = {
        status: 'success',
        message: 'account created successfuly',
        data: { user, wallet, businessKyc: kyc, token }
      }
      
      return res.status(StatusCodes.CREATED).json(response)
    }

    const response = {
      status: 'success',
      message: 'account created successfuly',
      data: { user, wallet, token }
    }
    return res.status(StatusCodes.CREATED).json(response)
  } catch (err) {
    const error = handleErrors(err)
    const response = {
      status: 'error',
      message: err.message,
      data: {error}
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response)
  }
}

export const verifyAccount = async (req, res) => {
  const { token, email } = req.body
  try {
    const user = await User.findOneAndUpdate(
      { email_verification_token: token, email: email },
      { $set: { is_email_verified: true } },
      { new: true },
    )

    if (!user) {
      throw Error('invalid otp')
    }

    const response = {
      status: 'success',
      message: 'account verified!',
      data: { user }
    }
    
    return res.status(StatusCodes.OK).json(response)
  } catch (err) {
    const error = handleErrors(err)
    const response = {
      status: 'error',
      message: err.message,
      data: {error}
    }
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }
}

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body

  try {
    const emailExists = await User.findOneAndUpdate(
      { email: email },
      { $set: { password_reset_token: randomId(49) } },
      { new: true },
    )
    
    if (!emailExists) {
      throw Error('user not found')
    }

    let sender = process.env.EMAIL_NO_REPLY
    let appName = process.env.APP_NAME
    let url = process.env.FRONTEND_URL
    const data = {
      to: email,
      from: sender,
      name: appName,
      subject: `${appName} Password Reset`,
      text: `Follow this link to reset your passowrd: ${url}/password-reset/${emailExists.password_reset_token}`,
      html: `<h3>Follow this link to reset your passowrd: <a href="${url}/password-reset/${emailExists.password_reset_token}">${url}/password-reset/${emailExists.password_reset_token}</a></h3>`,
    }

    const mailsender = mailer(data)

    const response = {
      status: 'success',
      message: 'LINK SENT! Please check your email for a recovery link.',
      data: {}
    }
    
    return res.status(StatusCodes.OK).json(response)
  } catch (err) {
    const error = handleErrors(err)
    const response = {
      status: 'error',
      message: err.message,
      data: {error}
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response)
  }
}

export const setNewPassword = async (req, res) => {
  const { token, new_password } = req.body
    try {
      const pwdHash = await hashPassword(new_password)

      const user = await User.findOneAndUpdate(
        { password_reset_token: token },
        { $set: { password_reset_token: '', password: pwdHash } },
      )
      if (!user) {
        throw Error('invalid recovery token: the recovery link have expired.')
      }

      const response = {
        status: 'success',
        message: 'password changed successfuly. Please login with your email and new password.',
        data: {}
      }

      return res.status(StatusCodes.OK).json(response)
    } catch (err) {
      const error = handleErrors(err)
      const response = {
        status: 'error',
        message: err.message,
        data: {error}
      }
      return res.status(StatusCodes.BAD_REQUEST).json(response)
    }
}

export const regenerateToken = async (req, res) => {
  try {
    const token = createToken({
      id: res.locals.user,
      remember_me: res.locals.remember_me,
    })

    return res.status(StatusCodes.OK).json({ token })
  } catch (err) {
    const error = handleErrors(err)
    return res.status(StatusCodes.BAD_REQUEST).json({ error })
  }
}
