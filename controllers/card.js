const cardModel = require('../models/card');
const { INCORRECT_DATA, NOT_FOUND, DEFAULT_ERROR } = require('./errors');

function getCards(req, res) {
  cardModel.find({}, null, { sort: { createdAt: -1 } })
    .then((cards) => res.send(cards)) // фильтрует овнеров-объекты (а не строки или id)
    .catch((err) => res.status(DEFAULT_ERROR).send({ message: `Произошла ошибка: ${err.name} ${err.message}` }));
}

function createCard(req, res) {
  const { name, link } = req.body;
  cardModel.create({ name, link, owner: req.user._id })
    .then((newCard) => res.send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка: переданы неверные данные' });
      else res.status(DEFAULT_ERROR).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
    });
}

function deleteCard(req, res) {
  cardModel.deleteOne({ _id: req.params.cardId }, (err, result) => {
    if (err) {
      if (err.name === 'CastError')res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка: неверный ID карточки' });
      else res.status(DEFAULT_ERROR).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
    } else if (result.deletedCount > 0) res.send({ message: 'Пост удалён' });
    else res.status(NOT_FOUND).send({ message: 'Произошла ошибка: карточка не существует' });
  });
}

function putLike(req, res) {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((newCard) => {
      if (newCard) res.send(newCard);
      else res.status(NOT_FOUND).send({ message: 'Произошла ошибка: карточка не существует' });
    })
    .catch((err) => {
      if (err.name === 'CastError')res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка: неверный ID карточки' });
      else res.status(DEFAULT_ERROR).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
    });
}

function deleteLike(req, res) {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((newCard) => {
      if (newCard) res.send(newCard);
      else res.status(NOT_FOUND).send({ message: 'Произошла ошибка: карточка не существует' });
    })
    .catch((err) => {
      if (err.name === 'CastError')res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка: неверный ID карточки' });
      else res.status(DEFAULT_ERROR).send({ message: `Произошла ошибка: ${err.name} ${err.message}` });
    });
}

module.exports = {
  getCards, createCard, deleteCard, putLike, deleteLike,
};