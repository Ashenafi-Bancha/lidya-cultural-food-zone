import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database/prisma';

// Public: returns all non-deleted testimonials ordered for display.
// The public component shows only active ones; the admin page shows all.
export const getTestimonials = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { deletedAt: null },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    res.status(200).json({ status: 'success', data: testimonials });
  } catch (error) {
    next(error);
  }
};

export const createTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const testimonial = await prisma.testimonial.create({ data: req.body });
    res.status(201).json({ status: 'success', data: testimonial });
  } catch (error) {
    next(error);
  }
};

export const updateTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const testimonial = await prisma.testimonial.update({ where: { id }, data: req.body });
    res.status(200).json({ status: 'success', data: testimonial });
  } catch (error) {
    next(error);
  }
};

export const deleteTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await prisma.testimonial.update({ where: { id }, data: { deletedAt: new Date() } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
