const User = require('../models/user')
const { INCORRECT_DATA, NO_DATA_FOUND, SERVER_ERROR } = require('../utils/constants')

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new Error('Запрашиваемые пользователи не найдены')
      }
      res.send(users)
    })
    .catch((err) => {
      if (err.message === 'Запрашиваемые пользователи не найдены') {
        return res.status(NO_DATA_FOUND).send({ message: err.message })
      }
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' })
    })
}

const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new Error('Запрашиваемый пользователь не найден')
      }
      res.send(user)
    })
    .catch((err) => {
      if (err.message === 'Запрашиваемый пользователь не найден') {
        return res.status(NO_DATA_FOUND).send({ message: err.message })
      }
      if (err.name === 'CastError') {
        return res.status(INCORRECT_DATA).send({ message: 'Запрашиваемый пользователь не найден' })
      }
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' })
    })
}

const createUser = (req, res) => {
  const { name, about, avatar } = req.body

  User.create({ name, about, avatar })
    .then(user => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(INCORRECT_DATA).send({ message: 'Данные пользователя некорректны' })
      }
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' })
    })
}

const updateUser = (req, res) => {
  const { name, about } = req.body

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
    .then(user => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(INCORRECT_DATA).send({ message: 'Данные пользователя некорректны' })
      }
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' })
    })
}

const updateAvatar = (req, res) => {
  const { avatar } = req.body

  User.findByIdAndUpdate(
    req.user._id,
    { avatar: avatar },
    {
      new: true,
      runValidators: true
    })
    .then(user => res.json({user}))
    // .then(user => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(INCORRECT_DATA).send({ message: 'Ссылка некорректна' })
      }
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' })
    })
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar
}