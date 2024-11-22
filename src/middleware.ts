import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { z, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { db } from '@/database/db';
import AppError from '@/error/app-error';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { imageFormatError } from '@/error/image-error';

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.reduce((acc: any, err) => {
          acc[err.path.join('.')] = err.message;
          return acc;
        }, {});
        res.status(StatusCodes.BAD_REQUEST).json({
          status: 102,
          message: errorMessages,
          data: null,
        });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ success: false, msg: 'Internal Server Error' });
      }
    }
  };
}

export function appError(
  err: Error,
  _: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  if (err instanceof AppError) {
    if (!err.isOperational) {
      // gracefully shut down app if it's not an AppError
      db.close();
    }
    console.error(err);
    const errorMessage = JSON.parse(err.message);
    res.status(err.statusCode).json({ ...errorMessage, data: null });
  }
  next();
}


export const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory for conversion
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(imageFormatError());
    }
  },
});
