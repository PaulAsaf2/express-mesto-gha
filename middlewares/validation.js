const { celebrate, Joi } = require('celebrate');
const { checkURL } = require('../utils/constants');

module.exports.signupValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(checkURL),
  }),
});

module.exports.signinValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.getUserByIdValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().pattern(/^[a-z0-9]{24}$/).length(24),
  }),
});

module.exports.updateUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

module.exports.updateAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(checkURL),
  }),
});
