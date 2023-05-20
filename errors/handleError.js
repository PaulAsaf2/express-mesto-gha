// const BadRequest = require('./badRequest');

const handleError = ((err, req, res, next) => {
  // if (err.name === 'CastError') {
  //   const a = new BadRequest('Некорректный id пользователя');
  //   res.status(a.statusCode).send({ message: a.message });
  // }

  res.status(err.statusCode).send({ message: err.message });

  // res.send({
  //   name: err.name,
  //   message: err.message,
  //   stack: err.stack,
  // });

  return next();
});

module.exports = handleError;
