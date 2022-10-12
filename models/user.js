const isEmail = require('validator/lib/isEmail');
// const isUrl = require('validator/lib/isURL');

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    default: 'Жак-Ив Кусто',
    minLength: 2,
    maxLength: 30,
  }, // имя пользователя, строка от 2 до 30 символов, обязательное поле;
  about: {
    type: String,
    // required: true,
    default: 'Исследователь',
    minLength: 2,
    maxLength: 30,
  }, // информация о пользователе, строка от 2 до 30 символов, обязательное поле;
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      // validator: isUrl,
      validator: (value) => /^https?:\/\/(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]*$/.test(value),
      message: 'invalid avatar url!',
    },
    // required: true,
  }, // ссылка на аватарку, строка, обязательное поле.
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: isEmail,
      message: 'invalid Email!',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
