import mongoose from 'mongoose';
import { IUser } from '../types';

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина 2 символа'],
    maxlength: [30, 'Максимальная длина 30 символов'],
    required: true,
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина 2 символа'],
    maxlength: [30, 'Максимальная длина 200 символов'],
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
});

export default mongoose.model('user', userSchema);
