import { NextFunction, Request, Response } from 'express';
import { RequestCastom } from '../types';
import Card from '../models/card';
import User from '../models/user';
import HandlerError from '../errors/errors';
import {
  ERROR_MESSAGE_400,
  ERROR_MESSAGE_404,
  ERROR_MESSAGE_500,
} from '../constants/constants';

// найти все карточки
export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cards = await Card.find({});
    return res.status(200).send(cards);
  } catch (error) {
    next(HandlerError.serverError(ERROR_MESSAGE_500));
  }
};

// создать карточку
export const createCard = async (
  req: RequestCastom,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, link } = req.body;
    const owner = req.user?._id;

    if (!name || !link) {
      return next(HandlerError.badRequest(ERROR_MESSAGE_400));
    }

    const newCard = await Card.create({ name, link, owner });
    return res.status(200).send(newCard);
  } catch (error) {
    next(HandlerError.serverError(ERROR_MESSAGE_500));
  }
};

// удалить по индентификатору
export const deleteCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId); //проверяем есть ли вообще такая карточка

    if (!card) {
      return next(HandlerError.notFound(ERROR_MESSAGE_404));
    }

    const cardForDelete = await Card.findByIdAndDelete(cardId);

    return res
      .status(200)
      .send({ cardForDelete, message: 'Карточка успешно удалена' });
  } catch (error) {
    next(HandlerError.serverError(ERROR_MESSAGE_500));
  }
};

//
// поставить лайк
export const putLike = async (
  req: RequestCastom,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cardId } = req.params;
    const ownerId = req.user?._id; //на этом этапе только автор может ставить лайк своей карточке
    const user = await User.findById(ownerId); //проверяем есть ли вообще пользователь с таким _id в базе
    const currentCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: ownerId } },
      { new: true }
    );

    //переданы некорректные данные для постановки/снятии лайка. Проверяем есть ли пользователь с таким _id в базе
    if (!user) {
      return next(HandlerError.notFound(ERROR_MESSAGE_400));
    }

    //передан несуществующий id карточки
    if (!currentCard) {
      return next(HandlerError.notFound(ERROR_MESSAGE_404));
    }

    return res
      .status(200)
      .send({ currentCard, message: 'Лайк поставлен успешно' });
  } catch (error) {
    next(HandlerError.serverError(ERROR_MESSAGE_500));
  }
};

// убрать лайк
export const deleteLike = async (
  req: RequestCastom,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cardId } = req.params;
    const ownerId = req.user?._id; //на этом этапе только автор может ставить лайк своей карточке
    const currentCard = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: ownerId } },
      { new: true }
    );
    const user = await User.findById(ownerId); //проверяем есть ли вообще пользователь с таким _id в базе

    //переданы некорректные данные для постановки/снятии лайка
    if (!user) {
      return next(HandlerError.notFound(ERROR_MESSAGE_400));
    }

    //передан несуществующий id карточки
    if (!currentCard) {
      return next(HandlerError.notFound(ERROR_MESSAGE_404));
    }

    return res
      .status(200)
      .send({ currentCard, message: 'Лайк удален успешно' });
  } catch (error) {
    next(HandlerError.serverError(ERROR_MESSAGE_500));
  }
};
