import { Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { IResponse, ISuccessResponse } from 'types/respone';

class SuccessResponse implements ISuccessResponse {
  private message: string;
  private status: number;
  private data: object;
  constructor({ message = ReasonPhrases.OK, status = StatusCodes.OK, data = {} }) {
    this.message = message || ReasonPhrases.OK;
    this.status = status;
    this.data = data;
  }

  send(res: Response, headers: object) {
    return res.status(this.status).set(headers).json(this);
  }
}

class Ok extends SuccessResponse {
  constructor({ message, data = {} }: IResponse) {
    super({ message, data });
  }
}

class create extends SuccessResponse {
  constructor({ message, data = {} }: IResponse) {
    super({ message, status: StatusCodes.CREATED, data });
  }
}

const CREATED = ({
  res,
  message = ReasonPhrases.CREATED,
  data,
  headers = {},
}: IResponse) => {
  new create({
    message,
    data,
  }).send(res, headers);
};

const OK = ({ res, message = ReasonPhrases.OK, data, headers = {} }: IResponse) => {
  new Ok({
    message,
    data,
  }).send(res, headers);
};

export { CREATED, OK };
