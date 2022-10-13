require('dotenv').config();

const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/errors');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new UnauthorizedError('нет авторизации'));
  }

  let payload;
  const { NODE_ENV, JWT_SECRET } = process.env;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new UnauthorizedError('неверный токен'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  // req.user._id = mongoose.Types.ObjectId(req.user._id);
  next(); // пропускаем запрос дальше
};
