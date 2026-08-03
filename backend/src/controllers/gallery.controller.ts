import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database/prisma';

export const getGalleryItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Optional `?group=MOMENTS|LIFE` filter. An unrecognised value is ignored
    // rather than treated as a match on nothing, so a typo returns the full
    // gallery instead of a silently empty page.
    const groupParam = (req.query.group as string)?.toUpperCase();
    const group = groupParam === 'MOMENTS' || groupParam === 'LIFE' ? groupParam : undefined;

    const where = { deletedAt: null, ...(group ? { group: group as any } : {}) };

    const items = await prisma.galleryItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    const total = await prisma.galleryItem.count({ where });

    res.status(200).json({
      status: 'success',
      data: items,
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
    const id = req.params.id as string;
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
    const id = req.params.id as string;
    await prisma.galleryItem.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
