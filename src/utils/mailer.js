import nodemailer from 'nodemailer'
import dotenv from 'dotenv';

dotenv.config();

const mailer = async (mailOptions) => {
  const transporter = nodemailer.createTransport({
    port: process.env.MAIL_PORT,
    host: process.env.MAIL_HOST,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })

  mailOptions.from = process.env.EMAIL_NO_REPLY
  try {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        throw Error(err)
      } else {
        console.log('mail sent: %s', info.messageId)
        return true
      }
    })
  } catch (error) {
    console.log(error)
  }
}

export default mailer
