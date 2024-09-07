import { Request } from 'express';

export type AuthenticatedRequest = Request & {
  auth: {
    userId: string;
  };
};
