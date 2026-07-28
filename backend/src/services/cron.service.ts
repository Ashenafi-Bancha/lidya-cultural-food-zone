import cron from 'node-cron';
import { prisma } from '../database/prisma';
import { logger } from '../utils/logger';
import { ReservationStatus } from '@prisma/client';

// East Africa Time (EAT) is UTC+3
// This function checks for past reservations and updates their status
const checkPastReservations = async () => {
  logger.info('[CRON] Running reservation status update check...');

  try {
    const now = new Date();
    const nowUTC = new Date(now.getTime() - 3 * 60 * 60 * 1000); // Convert to UTC for comparison

    // Find reservations that are CONFIRMED but the date and time have passed
    const pastReservations = await prisma.reservation.findMany({
      where: {
        status: 'CONFIRMED' as ReservationStatus,
        date: {
          // Check dates that are today or earlier
          lte: nowUTC.toISOString().split('T')[0],
        },
      },
    });

    let updatedCount = 0;

    for (const reservation of pastReservations) {
      // Parse the reservation date and time
      const [resHours, resMinutes] = reservation.time.split(':').map(Number);
      const resDateTime = new Date(`${reservation.date}T${resHours}:${resMinutes}:00Z`);

      // Add 2 hours grace period (reservation window is 2 hours)
      const reservationEndTime = new Date(resDateTime.getTime() + 2 * 60 * 60 * 1000);

      if (nowUTC > reservationEndTime) {
        // The reservation time has passed, mark as COMPLETED or NO_SHOW
        // For simplicity, we'll mark as COMPLETED (assuming they showed up)
        // In a more sophisticated system, you might have a way to track actual attendance
        await prisma.reservation.update({
          where: { id: reservation.id },
          data: { status: 'COMPLETED' as ReservationStatus },
        });
        
        logger.info(`[CRON] Updated reservation ${reservation.id} (${reservation.customerName}) from CONFIRMED to COMPLETED`);
        updatedCount++;
      }
    }

    logger.info(`[CRON] Updated ${updatedCount} past reservations to COMPLETED`);
  } catch (error: any) {
    logger.error(`[CRON ERROR] Failed to update reservation statuses: ${error.message}`);
  }
};

// Initialize cron jobs
export const initializeCronJobs = () => {
  // Run every hour to check for past reservations
  // This ensures we catch reservations that have passed within the last hour
  cron.schedule('0 * * * *', () => {
    checkPastReservations();
  }, {
    scheduled: true,
    timezone: 'UTC',
  });

  logger.info('[CRON] Initialized reservation status update job (runs every hour)');
};

// Also run immediately on startup to catch any past reservations
export const runInitialCronCheck = () => {
  // Give a small delay to let the server start up
  setTimeout(() => {
    checkPastReservations();
  }, 5000);
};
