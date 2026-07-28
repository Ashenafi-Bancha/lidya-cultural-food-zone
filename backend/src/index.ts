import { Server } from 'http';
import { app } from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { prisma } from './database/prisma';
import { initializeCronJobs, runInitialCronCheck } from './services/cron.service';

let server: Server;

const startServer = async () => {
  try {
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
