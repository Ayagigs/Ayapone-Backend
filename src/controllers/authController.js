import { User } from '../models/User.js'
import { MerchantKYC } from '../models/MerchantKYC.js'
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

  try {
    const user = await User.findOne({ email: email })
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
        return res.status(StatusCodes.OK).json({ user, token })
      }
    }

    // failed credentials
    throw Error('invalid credentials')
  } catch (err) {
    const error = handleErrors(err)
    return res.status(StatusCodes.BAD_REQUEST).json({ error })
  }
}

export const register = async (req, res) => {
  const { last_name, first_name, email, phone_number, password, id_type, id_number, id_front_image_url, id_back_image_url, businessKyc } = req.body

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
      id_type,
      id_number,
      id_front_image_url,
      id_back_image_url
    })

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

    // const mailsender = mailer(data)

    const token = createToken({ id: user._id })

    if (businessKyc) {
      const { business_name, registration_number, business_type, address, city, state, country, postal_code, usdt_address, usdt_address_type } = businessKyc

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
        usdt_address,
        usdt_address_type
      })

      user.user_role = EUserRole.MERCHANT
      await user.save()

      return res.status(StatusCodes.CREATED).json({ user, businessKyc: kyc, token })
    }

    return res.status(StatusCodes.CREATED).json({ user, token })
  } catch (err) {
    const error = handleErrors(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
  }
}

export const verifyAccount = async (req, res) => {
  const { token, email } = req.body
    try {
      const user = await User.findOneAndUpdate(
        { email_verification_token: token, email: email },
        { $set: { is_email_verified: true } },
      )

      if (!user) {
        throw Error('invalid verification token')
      }

      return res.status(StatusCodes.OK).json({ success: 'SUCCESSFUL' })
    } catch (err) {
      const error = handleErrors(err)
      return res.status(StatusCodes.BAD_REQUEST).json({ error })
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
    const data = {
      to: email,
      from: sender,
      name: 'AyaVTOL',
      subject: 'AyaVTOL Password Reset',
      text: `Follow this link to reset your passowrd: ${process.env.BASE_URL}/set-new-password?token=${emailExists.password_reset_token}`,
      html: `<h3>Follow this link to reset your passowrd: <a href="${process.env.BASE_URL}/set-new-password?token=${emailExists.password_reset_token}">${process.env.BASE_URL}/set-new-password?token=${emailExists.password_reset_token}</a></h3>`,
    }

    const mailsender = mailer(data)

    return res.status(StatusCodes.CREATED).json({ success: "LINK SENT! Please check your email for a recovery link." })
  } catch (err) {
    const error = handleErrors(err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
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
        throw Error('invalid recovery token')
      }

      return res.status(StatusCodes.OK).json({ success: 'SUCCESSFUL' })
    } catch (err) {
      const error = handleErrors(err)
      return res.status(StatusCodes.BAD_REQUEST).json({ error })
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
