import { Router } from 'express';
import {
  getUsers,
  getUser,
  createUser,
  patchUser,
  patchAvatar,
} from '../controllers/users';

const userRouter = Router();

userRouter.get('/', getUsers); // возвращает всех пользователей

userRouter.get('/:userId', getUser); // возвращает пользователя по _id

userRouter.post('/', createUser); // создает пользователя

userRouter.patch('/me', patchUser); // обновляет пользователя

userRouter.patch('/me/avatar', patchAvatar); //обновляет пользователя

export default userRouter;
