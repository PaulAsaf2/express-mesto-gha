const User = require('../models/user');
const { INCORRECT_DATA, NO_DATA_FOUND, SERVER_ERROR } = require('../utils/constants');

const getUsers = (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch(err => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' }))
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new Error('Пользователь по указанному _id не найден')
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'Пользователь по указанному _id не найден') {
        return res.status(NO_DATA_FOUND).send({ message: err.message });
      }
      if (err.name === 'CastError') {
        return res.status(INCORRECT_DATA).send({ message: 'Передан некорректный _id при запросе пользователя' });
      }
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    })
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(INCORRECT_DATA).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    })
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {
      name: name,
      about: about,
    },
    {
      new: true,
      runValidators: true
    })
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
        return res.status(INCORRECT_DATA).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    })
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar: avatar },
    {
      new: true,
      runValidators: true
    })
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
        return res.status(INCORRECT_DATA).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    })
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar
};