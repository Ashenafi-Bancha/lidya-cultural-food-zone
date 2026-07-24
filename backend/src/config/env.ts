import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid or missing environment variables:');
  for (const error of _env.error.errors) {
    console.error(`  - ${error.path.join('.')}: ${error.message}`);
  }
  process.exit(1);
}

export const env = _env.data;
