import { Request } from 'express';
import { Schema } from 'mongoose';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
}

export interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: [Schema.Types.ObjectId];
  createdAt: Date;
}

export interface RequestCastom extends Request {
  user?: {
    _id: string;
  };
}
