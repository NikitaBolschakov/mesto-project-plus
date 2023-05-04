import './env';
import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import router from './routes/index';
import { createUserValidation, loginValidation } from './validation/users';
import errorHandler from './middleware/errorHandler';
import auth from './middleware/auth';
import { login, createUser } from './controllers/users';
import { requestLogger, errorLogger } from './middleware/logger';

const { PORT = 3000 } = process.env; // Слушаем 3000 порт

const app = express(); // Создать приложение на express

// Посредник, разбирающий входящие запросы в объект в формате JSON
app.use(express.json());
// Посредник, разбирающий полезную нагрузку строки запроса
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger); // подключаем логер запросов

app.post('/signin', loginValidation, login); // роут авторизации
app.post('/signup', createUserValidation, createUser); // роут регистрации

app.use(auth); // авторизация

app.use(router); // все остальные роуты

app.use(errorLogger); // подключаем логер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use(errorHandler); // централизованный обработчик ошибок

/* eslint-disable no-console */
const connect = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
    app.listen(PORT, () => {
      console.log(`App listening port on ${PORT}`);
    });
  } catch (err) {
    if (err instanceof mongoose.Error.MongooseServerSelectionError) {
      console.log('Ошибка подключения к базе данных');
    } else {
      console.log('Ошибка запуска сервера', err);
    }
  }
};
/* eslint-enable no-console */

connect();
