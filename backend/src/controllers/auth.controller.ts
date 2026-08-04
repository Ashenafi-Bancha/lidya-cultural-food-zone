import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateSecret, generateURI, verify as verifyOtp } from 'otplib';
import QRCode from 'qrcode';
import { prisma } from '../database/prisma';
import { env } from '../config/env';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const REFRESH_TOKEN_TTL_DAYS = 7;

// Allow one 30-second step either side, so a code entered as it rolls over
// still works — phone and server clocks are rarely perfectly aligned.
const TOTP_TOLERANCE_SECONDS = 30;

const verifyTotp = async (secret: string | null, code: string) => {
  if (!secret) return false;
  try {
    const result = await verifyOtp({ secret, token: code, epochTolerance: TOTP_TOLERANCE_SECONDS });
    return result.valid === true;
  } catch {
    return false;
  }
};

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

    // Second factor. The password is already confirmed correct at this point, so
    // a missing code is answered with a distinct signal the client uses to show
    // the code field — not an error, and it leaks nothing a correct password
    // hasn't already established.
    if (user.twoFactorEnabled) {
      const code = String(req.body.twoFactorCode ?? '').replace(/\s/g, '');
      if (!code) {
        return res.status(200).json({
          status: 'success',
          data: { twoFactorRequired: true },
        });
      }
      if (!(await verifyTotp(user.twoFactorSecret, code))) {
        return next(new AppError(401, 'Invalid authentication code'));
      }
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

// ─── Account management ──────────────────────────────────────────────────────

// Load the signed-in user, or fail closed. Every handler below acts on the
// account named by the access token — never on an id supplied by the client.
const requireCurrentUser = async (req: AuthRequest) => {
  const id = req.user?.id;
  if (!id) throw new AppError(401, 'Not authenticated');
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || !user.isActive) throw new AppError(401, 'Not authenticated');
  return user;
};

const assertPassword = async (plain: string, hash: string) => {
  if (!(await bcrypt.compare(plain, hash))) {
    throw new AppError(401, 'Current password is incorrect');
  }
};

export const me = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await requireCurrentUser(req);
    res.status(200).json({
      status: 'success',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await requireCurrentUser(req);
    const { currentPassword, newPassword } = req.body;

    await assertPassword(currentPassword, user.password);

    if (await bcrypt.compare(newPassword, user.password)) {
      return next(new AppError(400, 'New password must be different from the current one'));
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { password: await bcrypt.hash(newPassword, 10) },
    });

    // Revoke every session. If the old password had leaked, any session opened
    // with it dies here rather than surviving the change.
    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
    res.clearCookie('refreshToken', { ...refreshCookieOptions(), maxAge: undefined });

    res.status(200).json({
      status: 'success',
      message: 'Password changed. Please sign in again.',
    });
  } catch (error) {
    next(error);
  }
};

export const changeEmail = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await requireCurrentUser(req);
    const { currentPassword, newEmail } = req.body;

    await assertPassword(currentPassword, user.password);

    const email = String(newEmail).trim().toLowerCase();
    if (email === user.email.toLowerCase()) {
      return next(new AppError(400, 'That is already your email address'));
    }

    const taken = await prisma.user.findUnique({ where: { email } });
    if (taken) {
      return next(new AppError(409, 'That email address is already in use'));
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { email },
    });

    res.status(200).json({
      status: 'success',
      data: { id: updated.id, name: updated.name, email: updated.email, role: updated.role },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Two-factor authentication (TOTP) ────────────────────────────────────────

export const twoFactorSetup = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await requireCurrentUser(req);
    if (user.twoFactorEnabled) {
      return next(new AppError(400, 'Two-factor authentication is already enabled'));
    }

    // Stored but not yet active — `twoFactorEnabled` stays false until the user
    // proves they can read codes from it, so a half-finished setup can never
    // lock anyone out.
    const secret = generateSecret();
    await prisma.user.update({ where: { id: user.id }, data: { twoFactorSecret: secret } });

    const otpauth = generateURI({
      issuer: 'Lidya Cultural Food Zone',
      label: user.email,
      secret,
    });
    const qrDataUrl = await QRCode.toDataURL(otpauth, { width: 320, margin: 1 });

    res.status(200).json({
      status: 'success',
      data: { secret, otpauth, qrDataUrl },
    });
  } catch (error) {
    next(error);
  }
};

export const twoFactorEnable = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await requireCurrentUser(req);
    if (user.twoFactorEnabled) {
      return next(new AppError(400, 'Two-factor authentication is already enabled'));
    }
    if (!user.twoFactorSecret) {
      return next(new AppError(400, 'Start setup before enabling two-factor authentication'));
    }

    const code = String(req.body.code ?? '').replace(/\s/g, '');
    if (!(await verifyTotp(user.twoFactorSecret, code))) {
      return next(new AppError(400, 'That code is not valid. Check your authenticator app and try again.'));
    }

    await prisma.user.update({ where: { id: user.id }, data: { twoFactorEnabled: true } });
    res.status(200).json({ status: 'success', message: 'Two-factor authentication enabled' });
  } catch (error) {
    next(error);
  }
};

export const twoFactorDisable = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await requireCurrentUser(req);
    if (!user.twoFactorEnabled) {
      return next(new AppError(400, 'Two-factor authentication is not enabled'));
    }

    // Turning protection off demands both factors, exactly like using it.
    await assertPassword(req.body.currentPassword, user.password);
    const code = String(req.body.code ?? '').replace(/\s/g, '');
    if (!(await verifyTotp(user.twoFactorSecret, code))) {
      return next(new AppError(400, 'That code is not valid'));
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorEnabled: false, twoFactorSecret: null },
    });

    res.status(200).json({ status: 'success', message: 'Two-factor authentication disabled' });
  } catch (error) {
    next(error);
  }
};
