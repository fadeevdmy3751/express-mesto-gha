const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  }, // имя карточки, строка от 2 до 30 символов, обязательное поле;
  link: {
    type: String,
    required: true,
  }, // ссылка на картинку, строка, обязательно поле.
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  }, // ссылка на модель автора карточки, тип ObjectId, обязательное поле;
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    default: [],
    ref: 'user',
  }, // список лайкнувших пост пользователей, массив ObjectId
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
    ref: 'user',
  }, // дата создания, тип Date, значение по умолчанию Date.now.
});

module.exports = mongoose.model('card', cardSchema);
