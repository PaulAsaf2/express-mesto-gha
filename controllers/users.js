const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { JWT_SECRET } = require('../middlewares/auth');
const UnauthorizedError = require('../errors/unauthorized');
const NotFoundError = require('../errors/notFound');
const BadRequest = require('../errors/badRequest');
const ConflictError = require('../errors/conflict');
// --------------------------------------------------------
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};
// --------------------------------------------------------
const getUser = (req, res, next) => {
  User.findById(req.params.id || req.user._id)
    .then((user) => {
      if (!user) {
        return next(
          new NotFoundError('Пользователь по указанному id не найден'),
        );
      }
      return res.send(user);
    })
    .catch(next);
};
// --------------------------------------------------------
const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email, password: hash, name, about, avatar,
      })
        .then((user) => {
          res.send({
            email: user.email,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
          });
        })
        .catch((err) => {
          if (err.code === 11000) {
            return next(
              new ConflictError('Пользователь с таким email существует'),
            );
          }
          return next(err);
        });
    })
    .catch(next);
};
// --------------------------------------------------------
const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Неверная почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new UnauthorizedError('Неверная почта или пароль'));
          }

          const token = jwt.sign(
            { _id: user._id },
            JWT_SECRET,
            { expiresIn: '7d' },
          );

          return res.cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
          });
        })
        .then(() => res.send({ message: 'Успешный вход' }))
        .catch(next);
    })
    .catch(next);
};
// --------------------------------------------------------
const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному id не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Некорректный id пользователя'));
      }
      return next(err);
    });
};
// --------------------------------------------------------
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return next(
          new NotFoundError('Пользователь по указанному id не найден'),
        );
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Некорректный id пользователя'));
      }
      return next(err);
    });
};
// --------------------------------------------------------
module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
