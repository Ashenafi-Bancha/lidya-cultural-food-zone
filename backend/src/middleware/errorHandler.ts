import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(public statusCode: number, public message: string, public isOperational = true) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Map known Prisma error codes to appropriate HTTP responses so clients get a
// meaningful status (404/409/400) instead of a generic 500.
const PRISMA_ERROR_MAP: Record<string, { status: number; message: string }> = {
  P2025: { status: 404, message: 'Resource not found' },
  P2002: { status: 409, message: 'A record with this value already exists' },
  P2003: { status: 400, message: 'Invalid reference to a related record' },
  P2034: { status: 409, message: 'The request conflicted with another; please try again' },
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError || err?.name === 'ZodError') {
    logger.warn({ err }, 'Validation Error');
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: err.issues,
    });
  }

  if (typeof err?.code === 'string' && PRISMA_ERROR_MAP[err.code]) {
    const mapped = PRISMA_ERROR_MAP[err.code]!;
    logger.warn({ err }, `Prisma error ${err.code}`);
    return res.status(mapped.status).json({
      status: 'error',
      message: mapped.message,
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
