import { Request, Response } from 'express';

import { asyncHandler } from '../../frameworks/webserver/middlewares/async.middleware';

describe('Async Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {};
    nextFunction = jest.fn();
  });

  it('should call the handler function with request, response, and next', (done) => {
    const mockHandler = jest.fn().mockResolvedValue(undefined);
    const wrappedHandler = asyncHandler(mockHandler);

    wrappedHandler(mockRequest as Request, mockResponse as Response, nextFunction);

    setImmediate(() => {
      expect(mockHandler).toHaveBeenCalledWith(mockRequest, mockResponse, nextFunction);
      done();
    });
  });

  it('should call next function with error if handler throws', (done) => {
    const error = new Error('Test error');
    const mockHandler = jest.fn().mockRejectedValue(error);
    const wrappedHandler = asyncHandler(mockHandler);

    wrappedHandler(mockRequest as Request, mockResponse as Response, nextFunction);

    setImmediate(() => {
      expect(nextFunction).toHaveBeenCalledWith(error);
      done();
    });
  });

  it('should not call next function if handler resolves', (done) => {
    const mockHandler = jest.fn().mockResolvedValue(undefined);
    const wrappedHandler = asyncHandler(mockHandler);

    wrappedHandler(mockRequest as Request, mockResponse as Response, nextFunction);

    setImmediate(() => {
      expect(nextFunction).not.toHaveBeenCalled();
      done();
    });
  });

  it('should return a function', () => {
    const mockHandler = jest.fn();
    const wrappedHandler = asyncHandler(mockHandler);

    expect(typeof wrappedHandler).toBe('function');
  });
});
