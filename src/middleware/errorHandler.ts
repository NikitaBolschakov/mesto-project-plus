import { NextFunction, Request, Response } from 'express';
import { ERROR_MESSAGE_500, STATUS_500 } from '../constants/constants';
import HandlerError from '../errors/errors';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof HandlerError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  res.status(STATUS_500).json({ message: ERROR_MESSAGE_500 });

  return next();
};

export default errorHandler;
