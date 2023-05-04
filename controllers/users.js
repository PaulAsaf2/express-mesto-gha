const User = require('../models/user')

const getUsers = (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }))
}

const getUser = (req, res) => {
  User.findById(req.params.id)
    .then(user => res.send(user))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }))
}

const createUser = (req, res) => {
  const { name, about, avatar } = req.body

  User.create({ name, about, avatar })
    .then(user => res.send(user))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }))
}

module.exports = {
  getUsers,
  getUser,
  createUser
}