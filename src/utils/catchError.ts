import {
  ERROR_MESSAGE_500,
  ERROR_MESSAGE_400,
  ERROR_MESSAGE_404,
  STATUS_400,
  STATUS_404,
  STATUS_500,
} from './../constants/constants';
import { Response } from 'express';
import mongoose from 'mongoose';

export const catchError = (error: unknown, res: Response) => {
  if (
    error instanceof mongoose.Error.CastError || error instanceof mongoose.Error.ValidationError ) {
    return res.status(STATUS_400).send(ERROR_MESSAGE_400);
  }
  if (error instanceof mongoose.Error.DocumentNotFoundError) {
    return res.status(STATUS_404).send(ERROR_MESSAGE_404);
  }
  return res.status(STATUS_500).send(ERROR_MESSAGE_500);
};
