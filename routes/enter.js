const router = require('express').Router();
const { createUser, login } = require('../controllers/users');

router.post('/sign-up', createUser);
router.post('/sign-in', login);

module.exports = router;
