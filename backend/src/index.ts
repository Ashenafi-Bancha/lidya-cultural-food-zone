import { Server } from 'http';
import path from 'path';
import { execFileSync } from 'child_process';
import { app } from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { prisma } from './database/prisma';
import { initializeCronJobs, runInitialCronCheck } from './services/cron.service';

let server: Server;

// Apply pending migrations here rather than in the `start` script. The host
// launches `node dist/index.js` directly, so anything chained onto npm start is
// silently skipped — which shipped a build whose Prisma client expected columns
// the database did not have, and every login 500'd. Doing it in-process means
// schema and code can never again go live out of step.
//
// `migrate deploy` only applies committed migrations and is a no-op when there
// is nothing pending, so it is safe on every boot and every replica.
const applyMigrations = () => {
  if (env.NODE_ENV !== 'production') return;
  try {
    const prismaBin = path.join(process.cwd(), 'node_modules', '.bin', 'prisma');
    const output = execFileSync(prismaBin, ['migrate', 'deploy'], {
      encoding: 'utf8',
      stdio: 'pipe',
    });
    logger.info({ output: output.trim() }, 'Migrations applied');
  } catch (err: any) {
    // Fail loudly and refuse to serve. A half-migrated database behind a running
    // server is worse than a container that visibly will not start.
    logger.error(
      { stderr: err?.stderr?.toString?.(), stdout: err?.stdout?.toString?.() },
      'Migration failed — refusing to start'
    );
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    applyMigrations();

    await prisma.$connect();
    logger.info('Connected to database successfully');

    // Initialize cron jobs for automated state transitions
    initializeCronJobs();
    runInitialCronCheck();

    server = app.listen(env.PORT, () => {
      logger.info(`Server is running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
};

// Gracefully close the HTTP server and DB connections before exiting so that
// in-flight requests finish and Postgres connections are released cleanly.
const shutdown = async (signal: string) => {
  logger.info(`${signal} received — shutting down gracefully`);

  const forceExit = setTimeout(() => {
    logger.error('Could not close connections in time — forcing shutdown');
    process.exit(1);
  }, 10000);
  forceExit.unref();

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      });
      logger.info('HTTP server closed');
    }
    await prisma.$disconnect();
    logger.info('Database connection closed');
    clearTimeout(forceExit);
    process.exit(0);
  } catch (err) {
    logger.error({ err }, 'Error during graceful shutdown');
    process.exit(1);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error({ err: reason }, 'Unhandled promise rejection');
});

process.on('uncaughtException', (err) => {
  logger.error({ err }, 'Uncaught exception — shutting down');
  shutdown('uncaughtException');
});

startServer();
