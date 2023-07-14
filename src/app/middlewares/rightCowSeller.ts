import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../errors/ApiError';
import { Cow } from '../modules/cow/cow.model';

export const rightCowSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // verify cow seller
    const isRightSeller = await Cow.findOne({
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
