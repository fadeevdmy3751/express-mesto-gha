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
    validate: {
      // validator: isUrl,
      validator: (value) => /^https?:\/\/(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]*$/.test(value),
      message: 'invalid url!',
    },
  }, // ссылка на картинку, строка, обязательно поле.
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  }, // ссылка на модель автора карточки, тип ObjectId, обязательное поле;
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'user',
  }, // список лайкнувших пост пользователей, массив ObjectId
  createdAt: {
    type: Date,
    default: Date.now,
  }, // дата создания, тип Date, значение по умолчанию Date.now.
});

module.exports = mongoose.model('card', cardSchema);
