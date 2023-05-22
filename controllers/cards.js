/* eslint-disable eqeqeq */
const Card = require('../models/card');
const {
  INCORRECT_DATA, NO_DATA_FOUND, SERVER_ERROR,
} = require('../utils/constants');
const Forbidden = require('../errors/forbidden');
const NotFoundError = require('../errors/notFound');
const BadRequest = require('../errors/badRequest');
// --------------------------------------------------------
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};
// --------------------------------------------------------
const getCard = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Некорректный id карточки'));
      }
      return next(err);
    });
};
// --------------------------------------------------------
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return new BadRequest(
          'Переданы некорректные данные при создании карточки',
        );
      }
      return next(err);
    });
};
// --------------------------------------------------------
const deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным id не найдена');
      }
      Card.deleteOne(card)
        .then(() => {
          if (card.owner != req.user._id) {
            throw new Forbidden('Нельзя удалить чужую карточку');
          }
          res.send({ message: 'Карточка удалена' });
        })
        .catch(next);
    })
    .catch(next);
};
// --------------------------------------------------------
const putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new Error('Передан несуществующий _id карточки');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'Передан несуществующий _id карточки') {
        return res.status(NO_DATA_FOUND).send({ message: err.message });
      }
      if (err.name === 'CastError') {
        return res
          .status(INCORRECT_DATA)
          .send({
            message:
              'Переданы некорректные данные для постановки лайка',
          });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};
// --------------------------------------------------------
const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new Error('Передан несуществующий _id карточки');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'Передан несуществующий _id карточки') {
        return res.status(NO_DATA_FOUND).send({ message: err.message });
      }
      if (err.name === 'CastError') {
        return res
          .status(INCORRECT_DATA)
          .send({ message: 'Переданы некорректные данные для снятия лайка' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getCards,
  getCard,
  createCard,
  putLike,
  deleteLike,
  deleteCard,
};
