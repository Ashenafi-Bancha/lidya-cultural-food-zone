import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database/prisma';
import { AppError } from '../middleware/errorHandler';

export const getMenuItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { branchId, categoryId } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const filter: any = { deletedAt: null };

    if (branchId) filter.branchId = branchId;

    if (categoryId) {
      // Dishes are attached to leaf categories ("Lunch and Dinner"), never to a
      // top-level one ("Food"). Matching the id exactly therefore returned an
      // empty list for every parent category, so filtering by "Food" showed
      // nothing. Include the category's children alongside it.
      const children = await prisma.category.findMany({
        where: { parentId: categoryId as string, deletedAt: null },
        select: { id: true },
      });
      filter.categoryId = children.length
        ? { in: [categoryId as string, ...children.map((c) => c.id)] }
        : categoryId;
    }

    const items = await prisma.menuItem.findMany({
      where: filter,
      include: { category: true, branch: true },
      orderBy: { order: 'asc' },
      skip,
      take: limit,
    });

    const total = await prisma.menuItem.count({
      where: filter,
    });

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
