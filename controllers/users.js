/* eslint-disable consistent-return */
const validator = require('validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {
  INCORRECT_DATA, NO_DATA_FOUND, SERVER_ERROR,
} = require('../utils/constants');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res
      .status(SERVER_ERROR)
      .send({ message: 'Произошла ошибка' }));
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new Error('Пользователь по указанному _id не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'Пользователь по указанному _id не найден') {
        return res.status(NO_DATA_FOUND).send({ message: err.message });
      }
      if (err.name === 'CastError') {
        return res
          .status(INCORRECT_DATA)
          .send({ message: 'Некорректный _id пользователя' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

const createUser = (req, res) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(INCORRECT_DATA).send({ message: 'Некорректный email' });
  }

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res
          .status(409)
          .send({ message: 'Пользователь с таким email существует' });
      }

      bcrypt.hash(password, 10)
        .then((hash) => {
          User.create({
            email, password: hash, name, about, avatar,
          })
            .then((user) => { res.send(user); })
            .catch((err) => {
              if (err.name === 'CastError' || err.name === 'ValidationError') {
                return res
                  .status(INCORRECT_DATA)
                  .send({ message: 'Некорректные данные пользователя' });
              }
              return res
                .status(SERVER_ERROR)
                .send({ message: 'Произошла ошибка' });
            });
        });
    })
    .catch(() => res
      .status(SERVER_ERROR)
      .send({ message: 'Произошла ошибка' }));
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new Error('Пользователь с указанным _id не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'Пользователь с указанным _id не найден') {
        return res.status(NO_DATA_FOUND).send({ message: err.message });
      }
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res
          .status(INCORRECT_DATA)
          .send({ message: 'Некорректные данные профиля' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new Error('Пользователь с указанным _id не найден');
      }
      res.json({ user });
    })
    .catch((err) => {
      if (err.message === 'Пользователь с указанным _id не найден') {
        return res.status(NO_DATA_FOUND).send({ message: err.message });
      }
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res
          .status(INCORRECT_DATA)
          .send({ message: 'Некорректная ссылка' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
