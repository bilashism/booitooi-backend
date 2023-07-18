import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../errors/ApiError';
import { Book } from '../modules/book/book.model';

export const rightAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isRightAuthor = await Book.findOne({
      _id: req.params.id,
      authorId: req.user._id,
    }).lean();

    if (!isRightAuthor) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You do not have permission to access this resource'
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
