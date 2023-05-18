const router = require('express').Router();
const {
  getUsers, getUser, getOwner, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', getUser);
router.get('/me', getOwner);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
