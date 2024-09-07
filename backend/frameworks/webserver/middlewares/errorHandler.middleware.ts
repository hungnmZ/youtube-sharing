import { NextFunction, Request, Response } from 'express';
import { CastError } from 'mongoose';
import { DuplicateError, ValidationError } from 'types/error';

import {
  Api404Error,
  BaseError,
  BusinessLogicError,
} from '../utils/response/error.response';

// 404 Not Found handler
const handle404Error = (req: Request, res: Response, next: NextFunction): void => {
  next(new Api404Error('Not found'));
};

// Main error handler
const handleError = (
  err: unknown,
  req: Request,
  res: Response,
  _: NextFunction,
): Response => {
  const error = normalizeError(err);
  const statusCode = error.status || 500;

  return res.status(statusCode).json({
    status: statusCode,
    message: error?.message || 'Internal Server Error',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    errors: error.errors,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  });
};

// Normalize different error types
function normalizeError(err: unknown): BaseError {
  if (err instanceof BaseError) {
    return err;
  }
  if (err instanceof Error) {
    if (err.name === 'CastError') return handleCastError(err as CastError);
    if ('code' in err && err.code === 11000)
      return handleDuplicateFieldsError(err as DuplicateError);
    if (err.name === 'ValidationError')
      return handleValidationError(err as ValidationError);
  }
  return new BusinessLogicError('An unexpected error occurred');
}

// Handle specific error types
function handleCastError(err: CastError): BusinessLogicError {
  return new BusinessLogicError(`Invalid ${err.path}: ${err.value}`);
}

function handleDuplicateFieldsError(err: DuplicateError): BusinessLogicError {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)?.[0];
  return new BusinessLogicError(
    `Duplicate field value: ${value}. Please use another value`,
  );
}

function handleValidationError(err: ValidationError): BusinessLogicError {
  const errors = Object.values(err.errors).map((el) => el.message);
  return new BusinessLogicError(`Invalid input data. ${errors.join('. ')}`);
}

export { handle404Error, handleError };
