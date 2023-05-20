const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, getCard, createCard, putLike, deleteLike, deleteCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.get('/:id', getCard);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().uri(),
  }),
}), createCard);
router.delete('/:id', deleteCard);
router.put('/:id/likes', putLike);
router.delete('/:id/likes', deleteLike);

module.exports = router;
