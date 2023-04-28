import { STATUS_404 } from './../constants/constants';
import { Router } from 'express';
import cardRouter from './cards';
import userRouter from './users';
import { ERROR_MESSAGE_BAD_ROUTE } from '../constants/constants';

const router = Router();

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res) => {
  res.status(STATUS_404).send(ERROR_MESSAGE_BAD_ROUTE);
})

export default router;
