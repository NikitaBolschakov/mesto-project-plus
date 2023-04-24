import { Errback, NextFunction, Request, Response } from 'express';
import { ERROR_MESSAGE_500 } from '../constants/constants';
import HandlerError from '../errors/errors';

export const errorHandler = (
  err: Errback,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof HandlerError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  return res.status(500).json({ message: ERROR_MESSAGE_500 });
};
