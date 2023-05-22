/* eslint-disable max-len */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser, login } = require('../controllers/users');
const { signupValidation } = require('../middlewares/validation');

router.post(
  '/signup',
  signupValidation,
  createUser,
);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

module.exports = router;
