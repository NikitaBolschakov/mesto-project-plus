import { Router } from 'express';
import {
  updateUserInfoValidation,
  updateAvatarValidation,
  getUserByIdValidation,
} from '../validation/users';
import {
  getUsers,
  getUser,
  patchUser,
  patchAvatar,
  getUserData,
} from '../controllers/users';

const userRouter = Router();

userRouter.get('/', getUsers); // возвращает всех пользователей

userRouter.get('/me', getUserData); // возвращает инфо об авторизованном пользователе (1 - порядок важен)

userRouter.get('/:userId', getUserByIdValidation, getUser); // возвращает пользователя по _id (2 - иначе этот роут выбросит ошибку валидации)

userRouter.patch('/me', updateUserInfoValidation, patchUser); // обновляет пользователя

userRouter.patch('/me/avatar', updateAvatarValidation, patchAvatar); // обновляет пользователя

export default userRouter;
