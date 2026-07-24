import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database/prisma';
import { notificationService } from '../services/notification.service';
import { ReservationStatus } from '@prisma/client';

export const getReservations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: { branch: true },
    });
    res.status(200).json({ status: 'success', data: reservations });
  } catch (error) {
    next(error);
  }
};

export const createReservation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    
    const reservation = await prisma.reservation.create({
      data,
    });

    await notificationService.notifyManagerNewReservation(reservation);

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
    });

    if (status === 'CONFIRMED' || status === 'CANCELLED') {
      await notificationService.notifyCustomerStatus(reservation.phone, status, reservation.customerName);
    }

    res.status(200).json({ status: 'success', data: reservation });
  } catch (error) {
    next(error);
  }
};
