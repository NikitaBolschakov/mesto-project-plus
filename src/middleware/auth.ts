import { NextFunction, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ERROR_MESSAGE_401_AUTH } from '../constants/constants';
import { RequestCastom } from '../types';
import HandlerError from '../errors/errors';

const extractBearerToken = (header: string) => header.replace('Bearer ', '');

const auth = (req: RequestCastom, res: Response, next: NextFunction) => {
  const { authorization } = req.headers; // достаём авторизационный заголовок

  // если заголовка нет - выбрасываем ошибку
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(HandlerError.auth(ERROR_MESSAGE_401_AUTH));
  }

  // извлечём токен
  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret'); // верифицируем токен
  } catch (err) {
    return next(HandlerError.auth(ERROR_MESSAGE_401_AUTH));
  }

  req.user = payload as { _id: JwtPayload }; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};

export default auth;
