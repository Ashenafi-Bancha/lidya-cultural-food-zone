import { app } from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { prisma } from './database/prisma';

const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info('Connected to database successfully');

    app.listen(env.PORT, () => {
      logger.info(`Server is running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
};

startServer();
