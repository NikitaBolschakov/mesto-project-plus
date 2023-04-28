import { NextFunction, Request, Response } from 'express';
import { STATUS_200, STATUS_201 } from '../constants/constants';
import User from '../models/user';
import { catchError } from '../utils/catchError';

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

// создать пользователя
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, about, avatar } = req.body;
    const newUser = await User.create({ name, about, avatar });
    return res.status(STATUS_201).send(newUser);
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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, about } = req.body;
    const userId = req.body._id; //кто отправляет запрос, тому и менять данные. поэтому _id из req.body
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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { avatar } = req.body;
    const userId = req.body._id;
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