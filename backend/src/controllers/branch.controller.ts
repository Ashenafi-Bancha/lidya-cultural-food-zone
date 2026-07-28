import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database/prisma';
import { AppError } from '../middleware/errorHandler';

export const getBranches = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const branches = await prisma.branch.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'asc' },
      skip,
      take: limit,
    });

    const total = await prisma.branch.count({
      where: { deletedAt: null },
    });

    res.status(200).json({
      status: 'success',
      data: branches,
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

export const getBranchById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const branch = await prisma.branch.findFirst({
      where: { id, deletedAt: null },
    });

    if (!branch) {
      return next(new AppError(404, 'Branch not found'));
    }

    res.status(200).json({ status: 'success', data: branch });
  } catch (error) {
    next(error);
  }
};

export const createBranch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const branch = await prisma.branch.create({
      data,
    });
    res.status(201).json({ status: 'success', data: branch });
  } catch (error) {
    next(error);
  }
};

export const updateBranch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const data = req.body;
    const branch = await prisma.branch.update({
      where: { id },
      data,
    });
    res.status(200).json({ status: 'success', data: branch });
  } catch (error) {
    next(error);
  }
};

export const deleteBranch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await prisma.branch.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
