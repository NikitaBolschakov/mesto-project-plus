import { Router } from 'express';
import cardRouter from './cards';
import userRouter from './users';

const router = Router();

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res) => {
  res.status(404).send('Ohh you are lost, read the API documentation to find your way back home.');
})

export default router;
