import { Router } from 'express';
import { createCardValidation, getCardValidation } from '../validation/cards';
import {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} from '../controllers/cards';

const cardRouter = Router();

cardRouter.get('/', getCards); // возвращает все карточки

cardRouter.post('/', createCardValidation, createCard); // создает карточку

cardRouter.delete('/:cardId', getCardValidation, deleteCard); // удаляет карточку

cardRouter.put('/:cardId/likes', putLike); // добавляет лайк карточке

cardRouter.delete('/:cardId/likes', deleteLike); // удаляет лайк карточке

export default cardRouter;
