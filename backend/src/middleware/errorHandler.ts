import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(public statusCode: number, public message: string, public isOperational = true) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    logger.warn({ err }, 'Validation Error');
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: err.errors,
    });
  }

  if (err instanceof AppError) {
    if (err.isOperational) {
      logger.warn({ err }, err.message);
    } else {
      logger.error({ err }, err.message);
    }
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  logger.error({ err }, 'Unhandled Exception');
  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
};
