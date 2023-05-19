const JWT_SECRET = '71607670afe8d2e70cf1090c45c488be';
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.send(err);
  }

  req.user = payload;

  return next();
};

module.exports = {
  JWT_SECRET,
  auth,
};
