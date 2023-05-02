import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import HandlerError from '../errors/errors';
import { STATUS_200, STATUS_201, ERROR_MESSAGE_401, ERROR_MESSAGE_409 } from '../constants/constants';
import User from '../models/user';
import { catchError } from '../utils/catchError';
import { RequestCastom } from '../types';


// найти всех пользователей
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find({});
    return res.status(STATUS_200).send(users);
  } catch (error) {
    catchError(error, res);
  }
};

// найти пользователя по _id
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail();
    return res.status(STATUS_200).send(user);
  } catch (error) {
    catchError(error, res);
  }
};

// получить данные об авторизованном пользователе
export const getUserData = async (
  req: RequestCastom,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?._id;

  try {
    const user = await User.findById(userId).orFail();
    return res.status(STATUS_200).send(user);
  } catch (error) {
    catchError(error, res);
  }
};

// регистрация пользователя
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name, about, avatar } = req.body;
    const checkEmail = await User.findOne({ email });

    if (checkEmail) {
      next(HandlerError.auth(ERROR_MESSAGE_409));
    } else {
      const hash = await bcrypt.hash(password, 10);
      const newUser = await User.create({ email, password: hash, name, about, avatar });
      return res.status(STATUS_201).send(newUser);
    }
  } catch (error) {
    catchError(error, res);
  }
};

// обновить профиль
/*{
  "_id": "643f360ac75a4c8c4b97aad0",
  "name": "Не Иван, а Богдан",
  "about": "Повар"
}*/

export const patchUser = async (
  req: RequestCastom,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, about } = req.body;
    const userId = req.user?._id; //кто отправляет запрос, тому и менять данные. поэтому _id из req.body
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true }
    ).orFail();
    return res.status(STATUS_200).send(updateUser);
  } catch (error) {
    catchError(error, res);
  }
};

// обновить аватар
/* {
  "_id": "643f360ac75a4c8c4b97aad0",
  "avatar": "https://anotheravatar"
} */

export const patchAvatar = async (
  req: RequestCastom,
  res: Response,
  next: NextFunction
) => {
  try {
    const { avatar } = req.body;
    const userId = req.user?._id;
    const updateAvatar = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true }
    ).orFail();
    return res.status(STATUS_200).send(updateAvatar);
  } catch (error) {
    catchError(error, res);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    return res.send({
      token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }),
    });
  } catch {
    next(HandlerError.auth(ERROR_MESSAGE_401))
  }
}