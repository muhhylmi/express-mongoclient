import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config/globalConfig';
import { wrapperResponseError } from '../wrapper/wrapper';
import { User } from '../../domain/users/schemas/Model';


export const jwtAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error();
    }
   
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET_KEY);
      req.body.token = decoded;
      const user = User.findOne({
        where: {
          username: req.body.token.username
        }
      });
      if (!user) {
        throw new Error('user not found');
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return wrapperResponseError(res, 401, 'Token expired');
      } else if (error instanceof JsonWebTokenError) {
        return wrapperResponseError(res, 401, 'Invalid token');
      } else {
        throw error as Error;
      }
    }

    next();
  } catch (err) {
    return wrapperResponseError(res, 401, 'Please authenticate');
  }
};