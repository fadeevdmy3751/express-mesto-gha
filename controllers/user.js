require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const {
  UnauthorizedError, IncorrectDataError, DefaultError, NotFoundError, ConflictError,
} = require('../errors/errors');

function getUsers(req, res, next) {
  userModel.find({})
    .then((users) => res.send(users))
    .catch((err) => next(new DefaultError(`ошибка получения пользователя: ${err.message}`)));
  // res.status(DEFAULT_ERROR).send({ message: `Произошла ошибка: ${err.message}` }));
}

function getUser(req, res, next) {
  userModel.findOne({ _id: req.params.userId })
    .then((user) => {
      if (user) res.send(user);
      else next(new NotFoundError('пользователь'));
      // res.status(NOT_FOUND).send({ message: 'Произошла ошибка: пользователь не найден' });
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new IncorrectDataError('ID пользователя'));
      // res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка: неверный ID пользователя' });
      else next(new DefaultError(`ошибка получения пользователя: ${err.message}`));
      // res.status(DEFAULT_ERROR).send({ message: `Произошла ошибка: ${err.message}` });
    });
}

function getMe(req, res, next) {
  userModel.findOne({ _id: req.user._id })
    .then((user) => {
      if (user) res.send(user);
      else next(new NotFoundError('пользователь'));
      // res.status(NOT_FOUND).send({ message: 'Произошла ошибка: пользователь не найден' });
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new IncorrectDataError('ID пользователя'));
      // res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка: неверный ID пользователя' });
      else next(new DefaultError(`ошибка получения пользователя: ${err.message}`));
      // res.status(DEFAULT_ERROR).send({ message: `Произошла ошибка: ${err.message}` });
    });
}

function updateProfile(req, res, next) {
  const { name = null, about = null } = req.body; // для валидации обнуляем
  userModel.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((newUser) => res.send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') next(new IncorrectDataError('профиль'));
      // res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка: переданы неверные данные' });
      else next(new DefaultError(`обновление профиля: ${err.message}`));
      // res.status(DEFAULT_ERROR).send({ message: `Произошла ошибка: ${err.message}` });
    });
}

function updateAvatar(req, res, next) {
  const { avatar = null } = req.body; // для валидации обнуляем
  // eslint-disable-next-line max-len
  // все и так валидировалось в отправленном ранее варианте, см. app.js строка 11 а так же коментарий в предыдущей строке (!)
  userModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((newUser) => res.send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') next(new IncorrectDataError('аватар'));
      // res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка: переданы неверные данные' });
      else next(new DefaultError(`обновление аватара: ${err.message}`));
      // res.status(DEFAULT_ERROR).send({ message: `Произошла ошибка: ${err.message}` });
    });
}

function createUser(req, res, next) {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => userModel.create({
      name, about, avatar, email, password: hash,
    }))
    .then((newUser) => {
      // выглядит ужасно но не нашел лучшего решения как не выводить хэш пароля
      const toSend = (({
        // eslint-disable-next-line no-shadow
        name, about, avatar, email, _id,
      }) => ({
        name, about, avatar, email, _id,
      }))(newUser);
      res.send(toSend);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') next(new IncorrectDataError('почта/пароль'));
      // res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка: переданы неверные данные' });
      else if (err.code === 11000) next(new ConflictError('пользователь с такой почтой уже существует'));
      else next(new DefaultError(`ошибка создания пользователя: ${err.message}`));
      // res.status(DEFAULT_ERROR).send({ message: `Произошла ошибка: ${err.message}` });
    });
}

function login(req, res, next) {
  const { email, password } = req.body;
  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      const { NODE_ENV, JWT_SECRET } = process.env;
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      // вернём токен
      res.cookie('jwt', token, {
        // token - наш JWT токен, который мы отправляем
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .send({
          message: 'успешная авторизация',
          // jwt: token, // для GHA ибо из кук почемуто не берет
        });
    })
    .catch((err) => {
      // ошибка аутентификации
      next(new UnauthorizedError(err.message));
      // throw new UnauthorizedError(err.message);
      // res
      //   .status(UNAUTHORIZED)
      //   .send({ message: err.message });
    });
  // .catch(next);
}

module.exports = {
  getUsers, getUser, createUser, updateProfile, updateAvatar, login, getMe,
};
