import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { RequestCastom } from '../types';
import Card from '../models/card';
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
    const cards = await Card.find({}).populate(['owner', 'likes']);
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

    const newCard = await Card.create({ name, link, owner });
    return res.status(201).send(newCard);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(HandlerError.badRequest(ERROR_MESSAGE_400));
    } else {
      next(HandlerError.serverError(ERROR_MESSAGE_500));
    }
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

    const cardForDelete = await Card.findByIdAndDelete(cardId);

    if (!cardForDelete) {
      return next(HandlerError.notFound(ERROR_MESSAGE_404));
    }

    return res
      .status(200)
      .send({ cardForDelete, message: 'Карточка успешно удалена' });
  } catch (error) {
    next(HandlerError.serverError(ERROR_MESSAGE_500));
  }
};

// поставить лайк
export const putLike = async (
  req: RequestCastom,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cardId } = req.params;
    const ownerId = req.user?._id; //на этом этапе только автор может ставить лайк своей карточке

    if (!cardId) {
      return next(HandlerError.badRequest(ERROR_MESSAGE_400));
    }

    const currentCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: ownerId } },
      { new: true }
    );

    //передан несуществующий id карточки
    if (!currentCard) {
      return next(HandlerError.notFound(ERROR_MESSAGE_404));
    }

    return res
      .status(200)
      .send({ currentCard, message: 'Лайк поставлен успешно' });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(HandlerError.badRequest(ERROR_MESSAGE_400));
    } else {
      next(HandlerError.serverError(ERROR_MESSAGE_500));
    }
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

    //передан несуществующий id карточки
    if (!currentCard) {
      return next(HandlerError.notFound(ERROR_MESSAGE_404));
    }

    return res
      .status(200)
      .send({ currentCard, message: 'Лайк удален успешно' });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(HandlerError.badRequest(ERROR_MESSAGE_400));
    } else {
      next(HandlerError.serverError(ERROR_MESSAGE_500));
    }
  }
};
