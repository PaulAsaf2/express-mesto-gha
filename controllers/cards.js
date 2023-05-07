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
  const owner = req.user._id

  Card.create({ name, link, owner })
    .then(card => res.send(card))
    .catch(err => res.status(500).send({ message: "Произошла ошибка" }))
}

module.exports = {
  getCards,
  getCard,
  createCard
}