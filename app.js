const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { error404 } = require('./controllers/errors');

const userId = '63336b48e0fc8f7c2233da1a';

const app = express();
const { PORT = 3000 } = process.env;

mongoose.set('runValidators', true); // чтобы валидация на апдейты работала
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.use((req, res, next) => {
  req.user = {
    _id: userId,
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('/', error404);

app.listen(
  PORT,
  () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    // запрещено линтером, поэтому
    /* eslint-disable no-console */
    console.log(`App listening on port ${PORT}`);
    /* eslint-enable no-console */
  },
);
