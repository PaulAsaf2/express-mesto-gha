/* eslint-disable max-len */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUser, updateUser, updateAvatar,
} = require('../controllers/users');

router.get(
  '/',
  getUsers,
);
router.get(
  ['/me', '/:id'],
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().required().pattern(/^[a-z0-9]{24}$/).length(24),
    }),
  }),
  getUser,
);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().pattern(/(https?:\/\/)(w{3}\.)?\w+[-.~:/?#[\]@!$&'()*+,;=]*#?/),
    }),
  }),
  updateAvatar,
);

module.exports = router;
