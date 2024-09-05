/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

declare class Error {
  public name: string;
  public message: string;
  public stack: string;
  public status: number;
  public isOperational: boolean;
  public errors: any;
  constructor(message: string);
}

export class BaseError extends Error {
  constructor(message: string, status: number, errors: any, isOperational: boolean) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, BaseError.prototype);
  }
}

export class Api404Error extends BaseError {
  constructor(
    message: string = ReasonPhrases.NOT_FOUND,
    errors = [],
    status = StatusCodes.NOT_FOUND,
    isOperational = true,
  ) {
    super(message, status, errors, isOperational);
  }
}

export class Api409Error extends BaseError {
  constructor(
    message: string = ReasonPhrases.CONFLICT,
    errors = [],
    status = StatusCodes.CONFLICT,
    isOperational = true,
  ) {
    super(message, status, errors, isOperational);
  }
}

export class Api403Error extends BaseError {
  constructor(
    message: string = ReasonPhrases.FORBIDDEN,
    errors = [],
    status = StatusCodes.FORBIDDEN,
    isOperational = true,
  ) {
    super(message, status, errors, isOperational);
  }
}

export class Api401Error extends BaseError {
  constructor(
    message: string = ReasonPhrases.UNAUTHORIZED,
    errors = [],
    status = StatusCodes.UNAUTHORIZED,
    isOperational = true,
  ) {
    super(message, status, errors, isOperational);
  }
}

export class Api400Error extends BaseError {
  constructor(
    message: string = ReasonPhrases.BAD_REQUEST,
    errors = [],
    status = StatusCodes.BAD_REQUEST,
    isOperational = true,
  ) {
    super(message, status, errors, isOperational);
  }
}

export class BusinessLogicError extends BaseError {
  constructor(
    message: string = ReasonPhrases.INTERNAL_SERVER_ERROR,
    errors = [],
    status = StatusCodes.INTERNAL_SERVER_ERROR,
    isOperational = true,
  ) {
    super(message, status, errors, isOperational);
  }
}
