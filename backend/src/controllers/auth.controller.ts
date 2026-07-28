import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../database/prisma';
import { env } from '../config/env';
import { AppError } from '../middleware/errorHandler';

const REFRESH_TOKEN_TTL_DAYS = 7;

const generateTokens = (userId: string, role: string) => {
  const accessToken = jwt.sign({ id: userId, role }, env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: userId, role }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

// Cross-site (Vercel frontend <-> Render backend) requires SameSite=None; Secure.
// In development the Vite proxy keeps things same-origin, so Lax without Secure works.
const refreshCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: (env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
  maxAge: REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
});

// Persist a hashed refresh token for a user and return the raw token value.
const persistRefreshToken = async (userId: string, refreshToken: string) => {
  const hashedRefresh = await bcrypt.hash(refreshToken, 10);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_TTL_DAYS);

  await prisma.refreshToken.create({
    data: { token: hashedRefresh, userId, expiresAt },
  });
};

// Refresh tokens are stored hashed, so we can't look them up directly.
// Verify the JWT to learn the user id, then bcrypt-compare against that user's
// stored (non-expired) tokens to find the matching row.
const findStoredRefreshToken = async (userId: string, rawToken: string) => {
  const stored = await prisma.refreshToken.findMany({
    where: { userId, expiresAt: { gt: new Date() } },
  });

  for (const record of stored) {
    if (await bcrypt.compare(rawToken, record.token)) {
      return record;
    }
  }
  return null;
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError(400, 'Email and password are required'));
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      return next(new AppError(401, 'Invalid credentials'));
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return next(new AppError(401, 'Invalid credentials'));
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);
    await persistRefreshToken(user.id, refreshToken);

    res.cookie('refreshToken', refreshToken, refreshCookieOptions());

    res.status(200).json({
      status: 'success',
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return next(new AppError(401, 'No refresh token provided'));
    }

    let payload: { id: string; role: string };
    try {
      payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as unknown as { id: string; role: string };
    } catch {
      return next(new AppError(401, 'Invalid or expired refresh token'));
    }

    const stored = await findStoredRefreshToken(payload.id, token);
    if (!stored) {
      return next(new AppError(401, 'Refresh token not recognized'));
    }

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user || !user.isActive) {
      // Clean up the token belonging to a now-invalid user.
      await prisma.refreshToken.delete({ where: { id: stored.id } }).catch(() => undefined);
      return next(new AppError(401, 'User no longer active'));
    }

    // Rotate: invalidate the used token and issue a fresh pair.
    await prisma.refreshToken.delete({ where: { id: stored.id } });
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id, user.role);
    await persistRefreshToken(user.id, newRefreshToken);

    res.cookie('refreshToken', newRefreshToken, refreshCookieOptions());

    res.status(200).json({
      status: 'success',
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      try {
        const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as unknown as { id: string };
        const stored = await findStoredRefreshToken(payload.id, token);
        if (stored) {
          await prisma.refreshToken.delete({ where: { id: stored.id } });
        }
      } catch {
        // Token invalid/expired — nothing to revoke, just clear the cookie.
      }
    }

    res.clearCookie('refreshToken', { ...refreshCookieOptions(), maxAge: undefined });
    res.status(200).json({ status: 'success', message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};
