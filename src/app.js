import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import { db } from './config/mongoose_db.js'
import { router } from './routes/index.js'
import { customResponse } from './middlewares/customResponse.js'

dotenv.config()
db()
const PORT = process.env.PORT || 3000

process.on('uncaughtException', (error, origin) => {
  console.log('----- Uncaught exception -----')
  console.log(error)
  console.log('----- Exception origin -----')
  console.log(origin)
})

process.on('unhandledRejection', (reason, promise) => {
  console.log('----- Unhandled Rejection at -----')
  console.log(promise)
  console.log('----- Reason -----')
  console.log(reason)
})

const app = express()
app.set('view engine', 'ejs')
app.use(express.static(path.join('assets')))
app.use(express.json())

app.enable('trust proxy')
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://playful-madeleine-d7f185.netlify.app',
    'https://ayapone.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

// start server
app.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}`)
})

// setup terminal logger
app.use(morgan('dev'))

// enable file upload
app.use(
  fileUpload({
    useTempFiles: true,
    limits: {
      fileSize: 6 * 1024 * 1024 * 1024, //6MB max file(s) size
    },
  }),
)

app.use(router)
app.use(customResponse)
