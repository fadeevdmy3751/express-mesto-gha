// eslint-disable-next-line max-classes-per-file
const INCORRECT_DATA = 400;
const NOT_FOUND = 404;
const UNAUTHORIZED = 401; // — передан неверный логин или пароль.
// Также эту ошибку возвращает авторизационный middleware, если передан неверный JWT;
const FORBIDDEN = 403; // — попытка удалить чужую карточку;
const CONFLICT = 409; // при регистрации указан email, который уже существует на сервере
const DEFAULT_ERROR = 500;

class MestoError extends Error {
  constructor(message) {
    super(message);
    this.message = `Mesto error: ${this.message}`;
  }
}

class NotFoundError extends MestoError {
  constructor(message) {
    const errMsg = `объект не найден: ${message}`;
    super(errMsg);
    this.statusCode = NOT_FOUND;
  }
}

class IncorrectDataError extends MestoError {
  constructor(message) {
    const errMsg = `некорректные данные: ${message}`;
    super(errMsg);
    this.statusCode = INCORRECT_DATA;
  }
}

class UnauthorizedError extends MestoError {
  constructor(message) {
    const errMsg = `не авторизован: ${message}`;
    super(errMsg);
    this.statusCode = UNAUTHORIZED;
  }
}

class ForbiddenError extends MestoError {
  constructor(message) {
    const errMsg = `доступ запрещен: ${message}`;
    super(errMsg);
    this.statusCode = FORBIDDEN;
  }
}

class ConflictError extends MestoError {
  constructor(message) {
    const errMsg = `конфликт: ${message}`;
    super(errMsg);
    this.statusCode = CONFLICT;
  }
}

class DefaultError extends MestoError {
  constructor(message) {
    const errMsg = `ошибка сервера: ${message}`;
    super(errMsg);
    this.statusCode = DEFAULT_ERROR;
  }
}

// function error404(req, res) {
//   res.status(NOT_FOUND).send({ message: 'Ресурс не найден. Проверьте URL и метод запроса' });
//   res.render();
// }

module.exports = {
  INCORRECT_DATA,
  NOT_FOUND,
  DEFAULT_ERROR,
  UNAUTHORIZED,
  FORBIDDEN,
  CONFLICT,
  NotFoundError,
  IncorrectDataError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  DefaultError,
};
