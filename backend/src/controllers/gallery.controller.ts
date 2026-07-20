import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database/prisma';

export const getGalleryItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await prisma.galleryItem.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ status: 'success', data: items });
  } catch (error) {
    next(error);
  }
};

export const createGalleryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const item = await prisma.galleryItem.create({
      data,
    });
    res.status(201).json({ status: 'success', data: item });
  } catch (error) {
    next(error);
  }
};

export const updateGalleryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const item = await prisma.galleryItem.update({
      where: { id },
      data,
    });
    res.status(200).json({ status: 'success', data: item });
  } catch (error) {
    next(error);
  }
};

export const deleteGalleryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.galleryItem.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
