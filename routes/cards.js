/* eslint-disable max-len */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, getCard, createCard, putLike, deleteLike, deleteCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.get('/:id', getCard);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/(https?:\/\/)(w{3}\.)?\w+[-.~:/?#[\]@!$&'()*+,;=]*#?/),
  }),
}), createCard);

router.delete(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().required().pattern(/^[a-z0-9]{24}$/).length(24),
    }),
  }),
  deleteCard,
);

router.put(
  '/:id/likes',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().required().pattern(/^[a-z0-9]{24}$/).length(24),
    }),
  }),
  putLike,
);

router.delete(
  '/:id/likes',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().required().pattern(/^[a-z0-9]{24}$/).length(24),
    }),
  }),
  deleteLike,
);

module.exports = router;
