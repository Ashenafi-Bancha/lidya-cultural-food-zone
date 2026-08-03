import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { prisma } from './database/prisma';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Behind Render's/Vercel's proxy so express-rate-limit sees the real client IP
// and secure cookies are set correctly.
app.set('trust proxy', 1);

// Security Middlewares
app.use(
  helmet({
    // Allow the statically served /uploads images to be loaded cross-origin
    // from the frontend domain.
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

// Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static Uploads
app.use('/uploads', express.static('uploads'));

// Health check — verifies the database is reachable, not just that the process
// is up, so orchestrators don't route traffic to an instance with a dead DB.
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'ok', database: 'connected', timestamp: new Date() });
  } catch {
    res.status(503).json({ status: 'error', database: 'unavailable', timestamp: new Date() });
  }
});

import authRoutes from './routes/auth.routes';
import branchRoutes from './routes/branch.routes';
import categoryRoutes from './routes/category.routes';
import menuRoutes from './routes/menu.routes';
import uploadRoutes from './routes/upload.routes';
import galleryRoutes from './routes/gallery.routes';
import settingsRoutes from './routes/settings.routes';
import reservationRoutes from './routes/reservation.routes';
import contactRoutes from './routes/contact.routes';
import eventRoutes from './routes/event.routes';
import testimonialRoutes from './routes/testimonial.routes';
import { apiLimiter } from './middleware/rateLimiter';

// Routes
const api = express.Router();
api.use(apiLimiter);
api.use('/auth', authRoutes);
api.use('/branches', branchRoutes);
api.use('/categories', categoryRoutes);
api.use('/menus', menuRoutes);
api.use('/upload', uploadRoutes);
api.use('/gallery', galleryRoutes);
api.use('/settings', settingsRoutes);
api.use('/reservations', reservationRoutes);
api.use('/contact', contactRoutes);
api.use('/event-bookings', eventRoutes);
api.use('/testimonials', testimonialRoutes);

// Mounted twice on purpose. Locally (and behind pass-through proxies) requests
// arrive as `/api/menus`. AletCloud routes this service at the `/api` path
// prefix but strips it before forwarding, so the container sees `/menus`.
// Serving both keeps one build working in either environment.
app.use('/api', api);
app.use(api);

// Error Handler
app.use(errorHandler);

export { app };
