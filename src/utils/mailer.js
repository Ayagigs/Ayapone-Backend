import nodemailer from 'nodemailer'

const mailer = async (mailOptions) => {
  let port = process.env.MAIL_PORT
  const transporter = nodemailer.createTransport({
    // port: port,
    // host: process.env.MAIL_HOST,
    service: process.env.MAIL_SERVICE,
    auth: {
      type: "login",
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
    // tls: {
    //   rejectUnauthorized: false,
    // },
  })

  mailOptions.from = process.env.EMAIL_NO_REPLY
  try {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        // console.log(err)
        throw Error(err)
      } else {
        console.log('mail sent: %s', info.messageId)
        return true
      }
    })
  } catch (error) {
    console.log(err)
  }
}

export default mailer
