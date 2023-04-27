import './env';
import express from 'express';
import mongoose from 'mongoose';
import router from './routes/index';
import { errorHandler } from './middleware/errorHandler';
import { fakeAuth } from './middleware/fakeAuth';

const { PORT = 3000 } = process.env; // Слушаем 3000 порт

const app = express(); // Создать приложение на express

app.use(express.json()); // Встроенный посредник, разбирающий входящие запросы в объект в формате JSON
app.use(express.urlencoded({ extended: true })); // Посредник, разбирающий полезную нагрузку строки запроса

app.use(fakeAuth); // Фейковая авторизация

app.use(router);

app.use(errorHandler);

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

connect();