import mongoose, { Schema } from 'mongoose';
import { ICard } from '../types';

const cardSchema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина 2 символа'],
    maxlength: [30, 'Максимальная длина 30 символов'],
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: [Schema.Types.ObjectId],
    ref: 'user',
    required: true,
  },
  likes: {
    type: [Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('card', cardSchema);
