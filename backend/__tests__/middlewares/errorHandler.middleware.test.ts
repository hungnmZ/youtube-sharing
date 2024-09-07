/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { DuplicateError } from 'types/error';

import { handleError } from '../../frameworks/webserver/middlewares/errorHandler.middleware';
import { BusinessLogicError } from '../../frameworks/webserver/utils/response/error.response';

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  describe('handleError', () => {
    it('should handle BaseError', () => {
      const error = new BusinessLogicError('Test error');
      handleError(error, mockRequest as Request, mockResponse as Response, nextFunction);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 500,
          message: 'Test error',
        }),
      );
    });

    it('should handle DuplicateError', () => {
      const error = {
        code: 11000,
        errmsg: 'Duplicate field value: "test"',
      } as DuplicateError;
      handleError(error, mockRequest as Request, mockResponse as Response, nextFunction);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 500,
          message: expect.stringContaining('An unexpected error occurred'),
        }),
      );
    });

    it('should handle ValidationError', () => {
      const validationError = new MongooseError.ValidationError();
      validationError.errors = {
        field1: new MongooseError.ValidatorError({ message: 'Error 1' }),
        field2: new MongooseError.ValidatorError({ message: 'Error 2' }),
      };

      handleError(
        validationError,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 500,
          message: expect.stringContaining('Error 1'),
        }),
      );
    });

    it('should handle unknown errors', () => {
      const error = new Error('Unknown error');
      handleError(error, mockRequest as Request, mockResponse as Response, nextFunction);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 500,
          message: 'An unexpected error occurred',
        }),
      );
    });

    it('should include stack trace in development environment', () => {
      process.env.NODE_ENV = 'development';
      const error = new Error('Test error');
      handleError(error, mockRequest as Request, mockResponse as Response, nextFunction);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          stack: expect.any(String),
        }),
      );
    });

    it('should not include stack trace in production environment', () => {
      process.env.NODE_ENV = 'production';
      const error = new Error('Test error');
      handleError(error, mockRequest as Request, mockResponse as Response, nextFunction);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.not.objectContaining({
          stack: expect.any(String),
        }),
      );
    });
  });
});
