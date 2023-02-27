import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import fileUpload from 'express-fileupload'
import { db } from './config/mongoose_db.js'
import { router } from './routes/index.js'

dotenv.config();
db()
const PORT = process.env.PORT || 3000;

const app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join('assets')));
app.use(express.json());

// start server
app.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}`);
});

// setup terminal logger
app.use(morgan('dev'));

// enable file upload
app.use(
  fileUpload({
    useTempFiles: true,
    limits: {
      fileSize: 6 * 1024 * 1024 * 1024, //6MB max file(s) size
    },
  })
);

app.use(router)
