import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { prisma } from '../database/prisma';
import { AppError } from './errorHandler';
import { Role } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: { id: string; role: Role };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'Unauthorized');
    }

    const token = authHeader.split(' ')[1]!;
    const decoded = jwt.verify(token, env.JWT_SECRET) as unknown as { id: string; role: Role };

    req.user = decoded;
    next();
  } catch (error) {
    next(new AppError(401, 'Invalid or expired token'));
  }
};

export const authorize = (roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError(403, 'Forbidden: insufficient permissions'));
    }
    next();
  };
};
