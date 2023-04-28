import { NextFunction, Request, Response } from 'express';
import { catchError } from '../utils/catchError';
import { RequestCastom } from '../types';
import Card from '../models/card';
import { STATUS_201, STATUS_200 } from '../constants/constants';

// найти все карточки
export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.status(STATUS_200).send(cards);
  } catch (error) {
    catchError(error, res);
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
    return res.status(STATUS_201).send(newCard);
  } catch (error) {
    catchError(error, res);
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
    const cardForDelete = await Card.findByIdAndDelete(cardId).orFail();
    return res.status(STATUS_200).send(cardForDelete);
  } catch (error) {
    catchError(error, res);
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
    const currentCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: ownerId } },
      { new: true }
    ).orFail();
    return res.status(STATUS_200).send(currentCard);
  } catch (error) {
    catchError(error, res);
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
    ).orFail();
    return res.status(STATUS_200).send(currentCard);
  } catch (error) {
    catchError(error, res);
  }
};