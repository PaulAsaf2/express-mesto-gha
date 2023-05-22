require('dotenv').config();
const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const process = require('process');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { mongoDBPath } = require('./utils/constants');
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');
const routerEnter = require('./routes/enter');
const { auth } = require('./middlewares/auth');
const handleError = require('./errors/handleError');
const NotFoundError = require('./errors/notFound');

const { PORT = 3000 } = process.env;
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standartHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(cookieParser());

mongoose.connect(mongoDBPath);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routerEnter);

app.use('/users', auth, routerUser);
app.use('/cards', auth, routerCard);

app.all('*', auth, (req, res, next) => next(
  new NotFoundError('Страницы не существует'),
));

app.listen(PORT);

app.use(errors());
app.use(handleError);
