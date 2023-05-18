const { JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // res.send(req.cookies);
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.send(err);
  }

  req.user = payload;
  // const { authorization } = req.headers;

  // if (!authorization || !authorization.startsWith('Bearer ')) {
  //   return res.status(401).send({ message: 'Требуется авторизация' });
  // }

  // const token = authorization.replace('Bearer ', '');

  // let payload;

  // try {
  //   payload = jwt.verify(token, NODE_ENV || JWT_SECRET);
  // } catch (err) {
  //   return res.send({ err });
  // }

  // req.user = payload;

  return next();
};
