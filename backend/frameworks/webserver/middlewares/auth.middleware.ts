import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { NextFunction, Request, Response } from 'express';

import { Api401Error } from '../utils/response/error.response';

export const requireAuth = ClerkExpressRequireAuth({});

export const asyncAuthHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    requireAuth(req, res, (err) => {
      if (err instanceof Error) {
        const unauthenticatedError =
          err.message === 'Unauthenticated' && new Api401Error();

        return next(unauthenticatedError || err);
      }
      fn(req, res, next).catch(next);
    }).catch((err) => {
      return next(err);
    });
  };
};
