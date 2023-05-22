const router = require('express').Router();
const {
  getUsers, getUser, updateUser, updateAvatar,
} = require('../controllers/users');
const {
  getUserByIdValidation, updateUserValidation, updateAvatarValidation,
} = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:id', getUserByIdValidation, getUser);
router.patch('/me', updateUserValidation, updateUser);
router.patch('/me/avatar', updateAvatarValidation, updateAvatar);

module.exports = router;
