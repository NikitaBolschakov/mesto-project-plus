import { Router } from 'express';
import { ERROR_MESSAGE_BAD_ROUTE } from '../constants/constants';
import cardRouter from './cards';
import userRouter from './users';
import HandlerError from '../errors/errors';

const router = Router();

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res, next) => {
  next(HandlerError.notFound(ERROR_MESSAGE_BAD_ROUTE));
});

export default router;
