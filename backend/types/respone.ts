import { Response } from 'express';
import { ReasonPhrases } from 'http-status-codes';

export interface ISuccessResponse {
  send(res: Response, headers: object): Response;
}

export interface IResponse {
  message?: ReasonPhrases;
  data?: object;
  headers?: object;
  res?: Response;
}
