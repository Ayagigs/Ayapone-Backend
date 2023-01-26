import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
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

app.use('/api/v1', (req, res) => {
  res.status(200).json({
    name: process.env.APP_NAME,
    version: '1.0.0',
    status: '200 - OK',
    health: 'RUNNING',
    mode: process.env.MODE,
    message: 'please, specify a valid endpoint.',
  });
});

app.use('/api', (req, res) => {
  res.status(404).json({ message: 'please, specify an API version.' });
});

app.use((req, res) => {
  res.status(200).json({
    name: process.env.APP_NAME,
    status: '200 - OK',
    health: 'RUNNING',
    mode: process.env.MODE,
  });
});
