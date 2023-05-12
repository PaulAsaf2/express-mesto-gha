const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const process = require('process');
const rateLimit = require('express-rate-limit');
const { NO_DATA_FOUND } = require('./utils/constants');
const routerUser = require('./routes/users');
const routerCard = require('./routes/card');

const { PORT = 3000 } = process.env;
const app = express();

const limiter = rateLimit({
  windowsMs: 15 * 60 * 1000,
  max: 100,
  standartHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '6457c58c35d9935766858ce4',
  };

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', routerUser);
app.use('/cards', routerCard);

app.use((req, res) => {
  res.status(NO_DATA_FOUND).json({ message: 'Страница не найдена' });
});

app.listen(PORT);
