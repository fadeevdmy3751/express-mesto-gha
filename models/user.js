const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  }, // имя пользователя, строка от 2 до 30 символов, обязательное поле;
  about: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  }, // информация о пользователе, строка от 2 до 30 символов, обязательное поле;
  avatar: {
    type: String,
    required: true,
  }, // ссылка на аватарку, строка, обязательное поле.
});

module.exports = mongoose.model('user', userSchema);
