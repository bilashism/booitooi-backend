import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../errors/ApiError';
import { Book } from '../modules/book/book.model';

export const rightCowSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // verify cow seller
    const isRightSeller = await Book.findOne({
      _id: req.params.id,
      seller: req.user._id,
    }).lean();

    if (!isRightSeller) {
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
