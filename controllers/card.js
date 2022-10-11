const cardModel = require('../models/card');
const {
  DefaultError, IncorrectDataError, NotFoundError, ForbiddenError,
} = require('../errors/errors');

function getCards(req, res, next) {
  cardModel.find({}, null, { sort: { createdAt: -1 } })
    .then((cards) => res.send(cards)) // фильтрует овнеров-объекты (а не строки или id)
    .catch((err) => next(new DefaultError(`получение карточек: ${err.message}`)));
  // res.status(DEFAULT_ERROR).send({ message: `Произошла ошибка: ${err.message}` }));
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  cardModel.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') next(new IncorrectDataError('название/ссылка карточки'));
      // res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка: переданы неверные данные' });
      else next(new DefaultError(`создание карточки: ${err.message}`));
      // res.status(DEFAULT_ERROR).send({ message: `Произошла ошибка: ${err.message}` });
    });
}

function deleteCard(req, res, next) {
  cardModel.findOne({ _id: req.params.cardId })
    .then((card) => {
      if (card) {
        if (String(card.owner) === String(req.user._id)) {
          cardModel.findByIdAndDelete(req.params.cardId)
            .then(() => res.send({ message: 'Пост удалён' }));
        } else next(new ForbiddenError('чужая карточка'));
      } else next(new NotFoundError('карточка'));
    })
    .catch(next);

  // .then(() => res.send({ message: 'Пост удалён' }))
  // .catch((err) => {
  //   if (err.name === 'CastError') next(new IncorrectDataError('ID карточки'));
  //   // res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка: неверный ID карточки' });
  //   else next(new DefaultError(`удаление карточки: ${err.message}`));
  //   // res.status(DEFAULT_ERROR).send({ message: `Произошла ошибка: ${err.message}` });
  // });
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
      // res.status(NOT_FOUND).send({ message: 'Произошла ошибка: карточка не существует' });
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new IncorrectDataError('ID карточки'));
      // res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка: неверный ID карточки' });
      else next(new DefaultError(`добавление лайка: ${err.message}`));
      // res.status(DEFAULT_ERROR).send({ message: `Произошла ошибка: ${err.message}` });
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
      // res.status(NOT_FOUND).send({ message: 'Произошла ошибка: карточка не существует' });
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new IncorrectDataError('ID карточки'));
      // res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка: неверный ID карточки' });
      else next(new DefaultError(`удаление лайка: ${err.message}`));
      // res.status(DEFAULT_ERROR).send({ message: `Произошла ошибка: ${err.message}` });
    });
}

module.exports = {
  getCards, createCard, deleteCard, putLike, deleteLike,
};
