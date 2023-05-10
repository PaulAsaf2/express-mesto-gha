const router = require('express').Router()
const { getCards, getCard, createCard, putLike, deleteLike } = require('../controllers/cards')

router.get('/', getCards)
router.get('/:id', getCard)
router.post('/', createCard)
// delete
router.put('/:id/likes', putLike)
router.delete('/:id/likes', deleteLike)

module.exports = router;