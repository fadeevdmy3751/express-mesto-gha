require('dotenv').config();

const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/errors');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  // const { authorization } = req.headers;
  // if (!authorization || !authorization.startsWith('Bearer ')) {
  //   // console.log('in if');
  //   // return потому что без него выходит дальше... непонятно почему
  //   return next(new UnauthorizedError('нет авторизации'));
  // }
  // // console.log('out of if');
  // const token = authorization.replace('Bearer ', '');

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
