const router = require('express').Router();
const {
  getCards, getCard, createCard, putLike, deleteLike, deleteCard,
} = require('../controllers/cards');
const {
  createCardValidation,
  deleteCardValidation,
  putLikeValidation,
  deleteLikeValidation,
} = require('../middlewares/validation');

router.get('/', getCards);
router.get('/:id', getCard);
router.post('/', createCardValidation, createCard);
router.delete('/:id', deleteCardValidation, deleteCard);
router.put('/:id/likes', putLikeValidation, putLike);
router.delete('/:id/likes', deleteLikeValidation, deleteLike);

module.exports = router;
