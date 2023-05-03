import { STATUS_404 } from './../constants/constants';
import { Router } from 'express';
import cardRouter from './cards';
import userRouter from './users';
import { ERROR_MESSAGE_BAD_ROUTE } from '../constants/constants';
import HandlerError from '../errors/errors';

const router = Router();

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res, next) => {
  next(HandlerError.notFound(ERROR_MESSAGE_BAD_ROUTE));
})

export default router;