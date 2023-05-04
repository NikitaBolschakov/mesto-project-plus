import { NextFunction } from 'express';
import mongoose from 'mongoose';
import {
  ERROR_MESSAGE_500,
  ERROR_MESSAGE_400,
  ERROR_MESSAGE_404,
} from '../constants/constants';
import HandlerError from '../errors/errors';

const catchError = (error: any, next: NextFunction) => {
  if (
    error instanceof mongoose.Error.CastError || error instanceof mongoose.Error.ValidationError) {
    next(HandlerError.badRequest(ERROR_MESSAGE_400));
  }
  if (error instanceof mongoose.Error.DocumentNotFoundError) {
    next(HandlerError.notFound(ERROR_MESSAGE_404));
  }
  next(HandlerError.serverError(ERROR_MESSAGE_500));
};

export default catchError;
