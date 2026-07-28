import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database/prisma';
import { notificationService } from '../services/notification.service';
import { ReservationStatus } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

export const createEventBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;

    if (data.branchId) {
      const branch = await prisma.branch.findUnique({ where: { id: data.branchId } });
      if (!branch) {
        return next(new AppError(400, 'Branch not found'));
      }
    }

    const booking = await prisma.eventBooking.create({
      data,
      include: { branch: true },
    });

    const details = {
      customerName: booking.customerName,
      phone: booking.phone,
      email: booking.email ?? undefined,
      serviceType: booking.serviceType,
      eventDate: booking.eventDate,
      guestCount: booking.guestCount ?? undefined,
      branchName: booking.branch?.name,
      message: booking.message ?? undefined,
    };

    // Alert the manager, and send the customer a "we received it" confirmation.
    await notificationService.notifyManagerNewEventBooking(details);
    await notificationService.sendEventBookingReceived(details);

    res.status(201).json({ status: 'success', data: booking });
  } catch (error) {
    next(error);
  }
};

export const getEventBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const bookings = await prisma.eventBooking.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: { branch: true },
      skip,
      take: limit,
    });

    const total = await prisma.eventBooking.count({ where: { deletedAt: null } });

    res.status(200).json({
      status: 'success',
      data: bookings,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

export const updateEventBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    const booking = await prisma.eventBooking.update({
      where: { id },
      data: { status: status as ReservationStatus },
      include: { branch: true },
    });

    if (status === 'CONFIRMED' || status === 'CANCELLED') {
      await notificationService.notifyCustomerEventStatus(
        {
          customerName: booking.customerName,
          phone: booking.phone,
          email: booking.email ?? undefined,
          serviceType: booking.serviceType,
          eventDate: booking.eventDate,
          guestCount: booking.guestCount ?? undefined,
          branchName: booking.branch?.name,
          message: booking.message ?? undefined,
        },
        status
      );
    }

    res.status(200).json({ status: 'success', data: booking });
  } catch (error) {
    next(error);
  }
};
