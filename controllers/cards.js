const Card = require('../models/card')
const { INCORRECT_DATA, NO_DATA_FOUND, SERVER_ERROR } = require('../utils/constants')

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        throw new Error('Запрашиваемые карточки не найдены')
      }
      res.send(cards)
    })
    .catch((err) => {
      if (err.message === 'Запрашиваемые карточки не найдены') {
        return res.status(NO_DATA_FOUND).send({ message: err.message })
      }
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' })
    })
}

const getCard = (req, res) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        throw new Error('Запрашиваемая карточка не найдена')
      }
      res.send(card)
    })
    .catch((err) => {
      if (err.message === 'Запрашиваемая карточка не найдена') {
        return res.status(NO_DATA_FOUND).send({ message: err.message })
      }
      if (err.name === 'CastError') {
        return res.status(INCORRECT_DATA).send({ message: 'Запрашиваемая карточка не найдена' })
      }
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' })
    })
}

const createCard = (req, res) => {
  const { name, link } = req.body
  const owner = req.user.id

  Card.create({ name, link, owner })
    .then(card => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(INCORRECT_DATA).send({ message: 'Данные карточки некорректны' })
      }
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' })
    })
}

// delete card /

const putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res.status(NO_DATA_FOUND).send({ message: 'Пользователь не найден' })
      }
      res.send(card)
    })
    .catch((err) => {
      // if () {
      //   res.status(NO_DATA_FOUND).send({ message: 'Пользователь не найден' })
      // }
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(INCORRECT_DATA).send({ message: 'Пользователь не найден' })
      }
      res.status(500).send(err.message)
    })
  // .catch(err => res.status(500).send({ message: "Произошла ошибка" }))
}

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      res.send(card)
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA).send({ message: 'Пользователь не найден' })
      }
      res.status(500).send(err.message)
    })
}

module.exports = {
  getCards,
  getCard,
  createCard,
  putLike,
  deleteLike
}