const router = require('express').Router();
const {
  getUsers, getUser, createUser, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;

// POST /signup — регистрация пользователя;
// POST /signin — авторизация пользователя;
// GET /users/me — возвращает информацию о текущем пользователе.
