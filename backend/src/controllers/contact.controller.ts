import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database/prisma';
import { ContactStatus } from '@prisma/client';

export const getContactMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ status: 'success', data: messages });
  } catch (error) {
    next(error);
  }
};

export const createContactMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const contactMessage = await prisma.contactMessage.create({
      data: { name, email, phone, subject, message },
    });

    res.status(201).json({ status: 'success', data: contactMessage });
  } catch (error) {
    next(error);
  }
};

export const updateContactMessageStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const contactMessage = await prisma.contactMessage.update({
      where: { id },
      data: { status: status as ContactStatus },
    });

    res.status(200).json({ status: 'success', data: contactMessage });
  } catch (error) {
    next(error);
  }
};
