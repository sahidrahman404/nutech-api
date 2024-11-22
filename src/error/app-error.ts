import type { StatusCodes } from 'http-status-codes';

export default class AppError extends Error {
  statusCode: StatusCodes;
  isOperational: boolean;
  constructor(
    statusCode: number,
    message: { status: 102 | 103 | 108; message: string },
    isOperational: boolean = true,
    stack: string = '',
  ) {
    super(JSON.stringify(message));
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
