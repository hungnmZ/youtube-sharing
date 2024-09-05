/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';

import {
  Api401Error,
  Api403Error,
  Api404Error,
  BaseError,
  BusinessLogicError,
} from '../utils/response/error.response';

// Define a type for the error handling functions
type ErrorHandlerFunction = (
  err: unknown,
) => BaseError | Api401Error | Api403Error | BusinessLogicError;

const is404Handler = (req: Request, res: Response, next: NextFunction): void => {
  const err = new Api404Error('Not found');
  next(err);
};

const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _: NextFunction,
): Response => {
  const statusCode = err instanceof BaseError ? err.status : 500;
  let error: BaseError;

  if (err instanceof BaseError) {
    error = { ...err, message: err.message };
  } else if (err instanceof Error) {
    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if ((err as any).code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
  }

  return res.status(statusCode).json({
    status: statusCode,
    message: error.message || 'Internal Server Error',
    errors: (err as any).errors,
    stack: process.env.NODE_ENV === 'development' ? (err as any).stack : '',
  });
};

// Error Database
const handleCastErrorDB: ErrorHandlerFunction = (err: unknown): BusinessLogicError => {
  const castError = err as { path: string; value: string };
  const message = `Invalid ${castError.path}: ${castError.value}`;
  return new BusinessLogicError(message);
};

const handleDuplicateFieldsDB: ErrorHandlerFunction = (
  err: unknown,
): BusinessLogicError => {
  const duplicateError = err as { errmsg: string };
  const value = duplicateError.errmsg.match(/(["'])(\\?.)*?\1/)?.[0];
  console.log(value);
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new BusinessLogicError(message);
};

const handleValidationErrorDB: ErrorHandlerFunction = (
  err: unknown,
): BusinessLogicError => {
  const validationError = err as { errors: Record<string, { message: string }> };
  const errors = Object.values(validationError.errors).map((el) => el.message);
  console.log(errors);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new BusinessLogicError(message);
};

export { is404Handler, errorHandler as returnError };
