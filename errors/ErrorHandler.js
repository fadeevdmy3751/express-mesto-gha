require('dotenv').config();

const { NODE_ENV } = process.env;
// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  if (NODE_ENV !== 'production' && statusCode === 500) {
    // eslint-disable-next-line no-console
    console.log(message);
  }
  res.status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
};
