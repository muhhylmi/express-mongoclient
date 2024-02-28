import { Response } from 'express';

interface Wrapper {
    statusCode: number
    err?: Error
    data?: object | string | null
}

const wrapperResponse = (res: Response, statusCode: number, data?: object):Response => {
  return res.status(statusCode).json({
    status: 'Created!',
    message: 'Successfully request data',
    data: data
  });
};

const wrapperResponseError = (res: Response, statusCode: number, message: string,):Response => {
  return res.status(statusCode).json({
    status: 'Failed!',
    message: message,
    data: null
  });
};

const wrapperError = (statusCode: number, err?: Error): Wrapper =>  {
  return { statusCode, err };
};

const wrapperData = (statusCode: number, data?: object | string | null): Wrapper =>  {
  return { statusCode, data };
};

export {wrapperResponse, wrapperResponseError, wrapperError, wrapperData, Wrapper};