const JWT_SECRET = '71607670afe8d2e70cf1090c45c488be';
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized');

const auth = async (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = await jwt.verify(token, JWT_SECRET);
    req.user = payload;
  } catch {
    return next(new UnauthorizedError(
      'Недостаточно прав. Сперва войдите в аккаунт',
    ));
  }

  return next();
};

module.exports = {
  JWT_SECRET,
  auth,
};
