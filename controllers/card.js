const cardModel = require('../models/card');
const {
  DefaultError, IncorrectDataError, NotFoundError, ForbiddenError,
} = require('../errors/errors');

function getCards(req, res, next) {
  cardModel.find({}, null, { sort: { createdAt: -1 } })
    .then((cards) => res.send(cards)) // фильтрует овнеров-объекты (а не строки или id)
    .catch((err) => next(new DefaultError(`получение карточек: ${err.message}`)));
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  cardModel.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') next(new IncorrectDataError('название/ссылка карточки'));
      else next(new DefaultError(`создание карточки: ${err.message}`));
    });
}

function deleteCard(req, res, next) {
  cardModel.findOne({ _id: req.params.cardId })
    .then((card) => {
      if (!card) next(new NotFoundError('карточка'));
      else if (String(card.owner) !== String(req.user._id)) next(new ForbiddenError('чужая карточка'));
      else {
        cardModel.findByIdAndDelete(req.params.cardId)
          .then(() => res.send({ message: 'Пост удалён' }));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new IncorrectDataError('ID карточки'));
      else next(err);
    });
}

function putLike(req, res, next) {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card) res.send(card);
      else next(new NotFoundError('карточка'));
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new IncorrectDataError('ID карточки'));
      else next(new DefaultError(`добавление лайка: ${err.message}`));
    });
}

function deleteLike(req, res, next) {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card) res.send(card);
      else next(new NotFoundError('карточка'));
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new IncorrectDataError('ID карточки'));
      else next(new DefaultError(`удаление лайка: ${err.message}`));
    });
}

module.exports = {
  getCards, createCard, deleteCard, putLike, deleteLike,
};
