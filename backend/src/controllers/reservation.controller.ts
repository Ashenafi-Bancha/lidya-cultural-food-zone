import { Request, Response, NextFunction } from 'express';
import { Prisma, ReservationStatus } from '@prisma/client';
import { prisma } from '../database/prisma';
import { notificationService } from '../services/notification.service';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

// Prisma transaction client (interactive transaction) or the base client.
type PrismaTx = Prisma.TransactionClient;

// Check whether a branch has capacity for a new party at the requested slot.
// Accepts a transaction client so the read + subsequent create can run inside
// one serializable transaction, preventing two concurrent bookings from both
// passing the check and overbooking the branch.
const hasBranchCapacity = async (
  db: PrismaTx,
  capacity: number,
  branchId: string,
  date: string,
  time: string,
  partySize: number,
  reservationId?: string
): Promise<boolean> => {
  const reservationDate = new Date(`${date}T${time}:00Z`);

  // Count active bookings (PENDING + CONFIRMED + COMPLETED) on the same date.
  // PENDING must be included, otherwise many simultaneous pending bookings all
  // bypass the capacity gate.
  const existingReservations = await db.reservation.findMany({
    where: {
      branchId,
      date,
      deletedAt: null,
      status: { in: ['PENDING', 'CONFIRMED', 'COMPLETED'] },
      ...(reservationId && { id: { not: reservationId } }),
    },
  });

  // Sum guests that overlap the requested time within a 2-hour window.
  const totalGuests = existingReservations.reduce((sum, res) => {
    const resDate = new Date(`${res.date}T${res.time}:00Z`);
    const timeDiffHours = Math.abs(reservationDate.getTime() - resDate.getTime()) / (1000 * 60 * 60);
    return timeDiffHours < 2 ? sum + res.partySize : sum;
  }, 0);

  return totalGuests + partySize <= capacity;
};

export const getReservations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const reservations = await prisma.reservation.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: { branch: true },
      skip,
      take: limit,
    });

    const total = await prisma.reservation.count({
      where: { deletedAt: null },
    });

    res.status(200).json({
      status: 'success',
      data: reservations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createReservation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Whitelist rather than handing req.body straight to Prisma: an unexpected
    // key in the payload made `create` throw an "Unknown argument" error, which
    // surfaced to the guest as a 500 on an otherwise valid booking.
    const body = req.body;
    const data = {
      customerName: body.customerName,
      phone: body.phone,
      email: body.email || null,
      date: body.date,
      time: body.time,
      partySize: body.partySize,
      branchId: body.branchId,
      specialRequest: body.specialRequest || null,
    };

    // Run the capacity check and the create together in a serializable
    // transaction so concurrent bookings can't both slip past a full branch.
    const reservation = await prisma.$transaction(
      async (tx) => {
        const branch = await tx.branch.findUnique({ where: { id: data.branchId } });
        if (!branch) {
          throw new AppError(400, 'Branch not found');
        }

        const capacity = branch.capacity || 50;
        const ok = await hasBranchCapacity(
          tx,
          capacity,
          data.branchId,
          data.date,
          data.time,
          data.partySize
        );

        if (!ok) {
          throw new AppError(
            400,
            `Sorry, the ${branch.name} branch is at full capacity for the requested date and time. Maximum capacity: ${capacity} guests.`
          );
        }

        return tx.reservation.create({ data, include: { branch: true } });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );

    // The booking is already committed. A notification that fails must not turn
    // a successful reservation into a 500 for the guest — log it and move on so
    // the confirmation screen still shows.
    try {
      await notificationService.notifyManagerNewReservation({
        customerName: reservation.customerName,
        phone: reservation.phone,
        email: reservation.email ?? undefined,
        date: reservation.date,
        time: reservation.time,
        partySize: reservation.partySize,
        branchName: reservation.branch.name,
        specialRequest: reservation.specialRequest ?? undefined,
      });

      // Reassure the guest immediately. Without this they hear nothing until a
      // manager gets around to confirming, which can be hours.
      if (reservation.email) {
        await notificationService.sendReservationReceived({
          customerName: reservation.customerName,
          email: reservation.email,
          date: reservation.date,
          time: reservation.time,
          partySize: reservation.partySize,
          branchName: reservation.branch.name,
        });
      }
    } catch (err: any) {
      logger.error({ err: err?.message, reservationId: reservation.id }, 'Reservation notifications failed');
    }

    res.status(201).json({ status: 'success', data: reservation });
  } catch (error) {
    next(error);
  }
};

export const updateReservationStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;
    
    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status: status as ReservationStatus },
      include: { branch: true },
    });

    if (status === 'CONFIRMED' || status === 'CANCELLED') {
      // Same reasoning as on create: the status change is already saved, so a
      // failed send must not roll the admin's action back into an error.
      try {
        await notificationService.notifyCustomerStatus(
          reservation.phone,
          reservation.email ?? undefined,
          status,
          reservation.customerName,
          reservation.date,
          reservation.time,
          reservation.partySize,
          reservation.branch?.name
        );
      } catch (err: any) {
        logger.error({ err: err?.message, reservationId: reservation.id }, 'Status notification failed');
      }
    }

    res.status(200).json({ status: 'success', data: reservation });
  } catch (error) {
    next(error);
  }
};
