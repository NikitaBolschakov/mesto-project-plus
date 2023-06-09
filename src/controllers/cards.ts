import {
  NextFunction, Request, Response,
} from 'express';
import catchError from '../utils/catchError';
import { RequestCastom } from '../types';
import Card from '../models/card';
import {
  STATUS_201,
  ERROR_MESSAGE_403,
  MESSAGE_SUCCESS_DELETE,
} from '../constants/constants';
import HandlerError from '../errors/errors';

// найти все карточки
export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.send({ data: cards });
  } catch (error) {
    // ошибка передается в catchError,
    // catchError работает как небольшой мидлвар - передает ошибку в next,
    // а из next через метод класса HandlerError - в централизованный обработчик ошибок
    return catchError(error, next);
  }
};

// создать карточку
export const createCard = async (
  req: RequestCastom,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, link } = req.body;
    const owner = req.user?._id;
    const newCard = await Card.create({ name, link, owner });
    return res.status(STATUS_201).send({ data: newCard });
  } catch (error) {
    return catchError(error, next);
  }
};

// удалить по индентификатору
export const deleteCard = async (
  req: RequestCastom,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cardId } = req.params;
    const cardForDelete = await Card.findById(cardId).orFail();

    const { owner } = cardForDelete;
    const userId = req.user?._id;

    if (owner.toString() !== userId) {
      return next(HandlerError.violationOfAccessRights(ERROR_MESSAGE_403));
    }
    await Card.findByIdAndDelete(cardId);
    return res.send({ message: MESSAGE_SUCCESS_DELETE });
  } catch (error) {
    return catchError(error, next);
  }
};

// поставить лайк
export const putLike = async (
  req: RequestCastom,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cardId } = req.params;
    const ownerId = req.user?._id;
    const currentCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: ownerId } },
      { new: true },
    ).orFail();
    return res.send({ data: currentCard });
  } catch (error) {
    return catchError(error, next);
  }
};

// убрать лайк
export const deleteLike = async (
  req: RequestCastom,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cardId } = req.params;
    const ownerId = req.user?._id;
    const currentCard = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: ownerId } },
      { new: true },
    ).orFail();
    return res.send({ data: currentCard });
  } catch (error) {
    return catchError(error, next);
  }
};
