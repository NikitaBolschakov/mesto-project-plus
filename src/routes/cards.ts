import { Router } from 'express';
import {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} from '../controllers/cards';

const cardRouter = Router();

cardRouter.get('/', getCards); // возвращает все карточки

cardRouter.post('/', createCard); // создает карточку

cardRouter.delete('/:cardId', deleteCard); // удаляет карточку

cardRouter.put('/:cardId/likes', putLike); // добавляет лайк карточке

cardRouter.delete('/:cardId/likes', deleteLike); // удаляет лайк карточке

export default cardRouter;
