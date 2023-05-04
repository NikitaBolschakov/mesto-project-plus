import {
  NextFunction, Request, Response,
} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RequestCastom } from '../types';
import HandlerError from '../errors/errors';
import {
  STATUS_201,
  ERROR_MESSAGE_401,
  ERROR_MESSAGE_409,
} from '../constants/constants';
import User from '../models/user';
import catchError from '../utils/catchError';

// найти всех пользователей
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await User.find({});
    return res.send({ data: users });
  } catch (error) {
    // ошибка передается в catchError,
    // catchError работает как небольшой мидлвар - передает ошибку в next,
    // а из next через метод класса HandlerError - в централизованный обработчик ошибок
    return catchError(error, next);
  }
};

// найти пользователя по _id
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail();
    return res.send({ data: user });
  } catch (error) {
    return catchError(error, next);
  }
};

// получить данные об авторизованном пользователе
export const getUserData = async (
  req: RequestCastom,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?._id;

  try {
    const user = await User.findById(userId).orFail();
    return res.send({ data: user });
  } catch (error) {
    return catchError(error, next);
  }
};

/* // регистрация пользователя
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, name, about, avatar } = req.body;
  bcrypt.hash(password, 10)
    .then((hash: string) => {
      const user = User.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      });
    })
    .then((user) => res.status(STATUS_201).send({ email: user, name, about, avatar }))
    .catch((error) => {
      if (error.code === 11000) {
        next(HandlerError.conflict(ERROR_MESSAGE_409));
      } else {
        catchError(error, next);
      }
    });
}; */

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      email, password, name, about, avatar,
    } = req.body;

    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    });

    return res.status(STATUS_201).send({
      data: {
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
        email: newUser.email,
      },
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return next(HandlerError.conflict(ERROR_MESSAGE_409));
    }
    return catchError(error, next);
  }
};

// обновить профиль
export const patchUser = async (
  req: RequestCastom,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, about } = req.body;
    const userId = req.user?._id;
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    ).orFail();
    return res.send({ data: updateUser });
  } catch (error) {
    return catchError(error, next);
  }
};

// обновить аватар
export const patchAvatar = async (
  req: RequestCastom,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { avatar } = req.body;
    const userId = req.user?._id;
    const updateAvatar = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    ).orFail();
    return res.send({ data: updateAvatar });
  } catch (error) {
    return catchError(error, next);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    return res.send({
      token: jwt.sign({ _id: user._id }, 'super-strong-secret', {
        expiresIn: '7d',
      }),
    });
  } catch {
    return next(HandlerError.auth(ERROR_MESSAGE_401));
  }
};
