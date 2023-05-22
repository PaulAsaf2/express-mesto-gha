const router = require('express').Router();
const {
  getCards, createCard, putLike, deleteLike, deleteCard,
} = require('../controllers/cards');
const {
  createCardValidation, idValidation,
} = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', createCardValidation, createCard);
router.delete('/:id', idValidation, deleteCard);
router.put('/:id/likes', idValidation, putLike);
router.delete('/:id/likes', idValidation, deleteLike);

module.exports = router;
