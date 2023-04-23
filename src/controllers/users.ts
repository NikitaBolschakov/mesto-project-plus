import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  ERROR_MESSAGE_400,
  ERROR_MESSAGE_404,
  ERROR_MESSAGE_500,
} from '../constants/constants';
import User from '../models/user';
import HandlerError from '../errors/errors';

// найти всех пользователей
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find({});
    return res.status(200).send(users);
  } catch (error) {
    next(HandlerError.serverError(ERROR_MESSAGE_500));
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
    const user = await User.findById(userId);

    if (!user) {
      return next(HandlerError.notFound(ERROR_MESSAGE_404));
    }

    return res.status(200).send(user);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(HandlerError.badRequest(ERROR_MESSAGE_400));
    } else {
      next(HandlerError.serverError(ERROR_MESSAGE_500));
    }
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

    if (!name || !about || !avatar) {
      return next(HandlerError.badRequest(ERROR_MESSAGE_400));
    }

    const newUser = await User.create({ name, about, avatar });
    return res.status(200).send(newUser);
  } catch (error) {
    next(HandlerError.serverError(ERROR_MESSAGE_500));
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
    const user = await User.findById(userId);

    if (!user) {
      return next(HandlerError.notFound(ERROR_MESSAGE_404));
    }

    if (!name || !about) {
      return next(HandlerError.badRequest(ERROR_MESSAGE_400));
    }

    const updateUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      {
        new: true,
        runValidators: true,
      }
    );
    return res.status(200).send(updateUser);
  } catch (error) {
    next(HandlerError.serverError(ERROR_MESSAGE_500));
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
    const user = await User.findById(userId);

    if (!user) {
      return next(HandlerError.notFound(ERROR_MESSAGE_404));
    }

    if (!avatar) {
      return next(HandlerError.badRequest(ERROR_MESSAGE_400));
    }

    const updateAvatar = await User.findByIdAndUpdate(
      userId,
      { avatar },
      {
        new: true,
        runValidators: true,
      }
    );
    return res.status(200).send(updateAvatar);
  } catch (error) {
    next(HandlerError.serverError(ERROR_MESSAGE_500));
  }
};
