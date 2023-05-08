const Card = require('../models/card')

const getCards = (req, res) => {
  Card.find({})
    .then(card => res.send(card))
    .catch(err => res.status(500).send({ message: "Произошла ошибка" }))
}

const getCard = (req, res) => {
  Card.findById(req.params.id)
    .then(card => res.send(card))
    .catch(err => res.status(500).send({ message: "Произошла ошибка" }))
}

const createCard = (req, res) => {
  const { name, link } = req.body
  const owner = req.user.id

  Card.create({ name, link, owner })
    .then(card => res.send(card))
    .catch(err => res.status(500).send({ message: "Произошла ошибка" }))
}

const putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then(card => res.send(card))
    .catch(err => res.status(500).send({ message: "Произошла ошибка" }))
}

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then(card => res.send(card))
    .catch(err => res.status(500).send({ message: "Произошла ошибка" }))
}

module.exports = {
  getCards,
  getCard,
  createCard,
  putLike,
  deleteLike
}