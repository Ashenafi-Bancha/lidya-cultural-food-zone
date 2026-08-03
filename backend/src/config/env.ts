import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  // S3-compatible object storage (AletCloud injects these automatically when a
  // bucket is attached to the app). Required in production so uploaded photos
  // survive redeploys — container disks are ephemeral.
  S3_ENDPOINT: z.string().optional(),
  S3_REGION: z.string().optional().default('us-east-1'),
  S3_BUCKET: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_PUBLIC_URL: z.string().optional(), // CDN/public base URL, if different from the endpoint
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().optional().default('noreply@lidyafoodzone.com'),
  MANAGER_EMAIL: z.string().optional(),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),
  MANAGER_PHONE: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid or missing environment variables:');
  for (const error of _env.error.issues) {
    console.error(`  - ${error.path.join('.')}: ${error.message}`);
  }
  process.exit(1);
}

export const env = _env.data;
