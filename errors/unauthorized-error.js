class UnauthorizedError extends Error {
  constructor(mesage) {
    super(mesage);
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;
