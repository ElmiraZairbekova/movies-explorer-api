require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./middlewares/cors');
const { errors } = require('celebrate');
const handleError = require('./middlewares/handleError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes');
const limiter = require('./utils/limiter');
const helmet = require('helmet');

const { PORT = 3000, DB_ADDRESS = 'mongodb://localhost:27017/moviesdb' } = process.env;

mongoose.connect(DB_ADDRESS, () => {
  console.log('Connection successful');
});

const app = express();

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(requestLogger);

app.use('/', routes);

app.use(errorLogger);
app.use(errors());
app.use(handleError);
app.use(cors);
app.use(limiter);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
