const router = require('express').Router()
const { getCards, getCard, createCard } = require('../controllers/cards')

router.get('/', getCards)
router.get('/:id', getCard)
router.post('/', createCard)

module.exports = router;