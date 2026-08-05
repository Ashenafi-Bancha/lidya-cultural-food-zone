import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database/prisma';

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Return top-level categories with their (non-deleted) children nested, so
    // the frontend can render a two-level category structure.
    const categories = await prisma.category.findMany({
      where: { deletedAt: null, parentId: null },
      orderBy: { order: 'asc' },
      include: {
        children: {
          where: { deletedAt: null },
          orderBy: { order: 'asc' },
        },
      },
    });
    res.status(200).json({ status: 'success', data: categories });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Take every validated field. This previously destructured only name and
    // order, silently dropping nameAm and parentId — so categories created via
    // the API always landed at top level with no Amharic name.
    const { name, nameAm, order, parentId } = req.body;
    const category = await prisma.category.create({
      data: { name, nameAm: nameAm ?? null, order: order || 0, parentId: parentId ?? null },
    });
    res.status(201).json({ status: 'success', data: category });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const data = req.body;
    const category = await prisma.category.update({
      where: { id },
      data,
    });
    res.status(200).json({ status: 'success', data: category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
