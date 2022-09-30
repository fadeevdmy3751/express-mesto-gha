const INCORRECT_DATA = 400;
const NOT_FOUND = 404;
const DEFAULT_ERROR = 500;

function error404(req, res) {
  res.status(NOT_FOUND).send({ message: 'Ресурс не найден. Проверьте URL и метод запроса' });
}

module.exports = {
  INCORRECT_DATA, NOT_FOUND, DEFAULT_ERROR, error404,
};
