const Card = require('../models/card');
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
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequest('Переданы некорректные данные при создании карточки'),
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
        return next(new NotFoundError('Карточка с указанным id не найдена'));
      }
      if (card.owner.toString() !== req.user._id) {
        return next(new Forbidden('Нельзя удалить чужую карточку'));
      }

      return Card.deleteOne({ _id: card._id })
        .then(() => res.send({ message: 'Карточка удалена' }))
        .catch(next);
    })
    .catch(next);
};
// --------------------------------------------------------
const putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Передан несуществующий _id карточки'));
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(
          new BadRequest('Переданы некорректные данные для постановки лайка'),
        );
      }
      return next(err);
    });
};
// --------------------------------------------------------
const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Передан несуществующий _id карточки'));
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(
          new BadRequest('Переданы некорректные данные для снятия лайка'),
        );
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  putLike,
  deleteLike,
  deleteCard,
};
