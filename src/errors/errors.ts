import { Error } from 'mongoose';

class HandlerError extends Error {
  statusCode: number;

  constructor(status: number, message: string) {
    super(message);
    this.statusCode = status;
    this.message = message;
  }

  static badRequest(message: string) {
    return new HandlerError(400, message);
  }

  static notFound(message: string) {
    return new HandlerError(404, message);
  }

  static serverError(message: string) {
    return new HandlerError(500, message);
  }
}

export default HandlerError;
