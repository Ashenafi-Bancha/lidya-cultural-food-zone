import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: any) {
      if (error instanceof ZodError || error?.name === 'ZodError') {
        const errorDetails = error.errors?.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        const isDev = process.env.NODE_ENV !== 'production';
        const detailedMessage = isDev && errorDetails 
          ? `Validation failed: ${errorDetails.map((e: any) => `${e.field.replace(/^(body|query|params)\./, '')}: ${e.message}`).join(', ')}`
          : 'Validation failed';

        return res.status(400).json({
          status: 'error',
          message: detailedMessage,
          errors: errorDetails,
        });
      }
      return next(error);
    }
  };
};
