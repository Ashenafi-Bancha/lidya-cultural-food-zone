import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database/prisma';

export const getSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await prisma.websiteSetting.findMany();
    const data = settings.reduce((acc, setting) => ({ ...acc, [setting.key]: setting.value }), {});
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updates = req.body;
    
    const promises = Object.entries(updates).map(([key, value]) => {
      return prisma.websiteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    });

    await prisma.$transaction(promises);
    
    res.status(200).json({ status: 'success', message: 'Settings updated successfully' });
  } catch (error) {
    next(error);
  }
};
