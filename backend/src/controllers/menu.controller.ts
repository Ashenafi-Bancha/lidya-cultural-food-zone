import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database/prisma';
import { AppError } from '../middleware/errorHandler';

export const getMenuItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { branchId, categoryId } = req.query;
    const filter: any = { deletedAt: null };

    if (branchId) filter.branchId = branchId;
    if (categoryId) filter.categoryId = categoryId;

    const items = await prisma.menuItem.findMany({
      where: filter,
      include: { category: true, branch: true },
      orderBy: { order: 'asc' },
    });
    res.status(200).json({ status: 'success', data: items });
  } catch (error) {
    next(error);
  }
};

export const createMenuItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const item = await prisma.menuItem.create({
      data,
    });
    res.status(201).json({ status: 'success', data: item });
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const data = req.body;
    const item = await prisma.menuItem.update({
      where: { id },
      data,
    });
    res.status(200).json({ status: 'success', data: item });
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await prisma.menuItem.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
