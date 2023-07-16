import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../errors/ApiError';
import { Book } from '../modules/book/book.model';
import { User } from '../modules/user/user.model';
import { ENUM_USER_ROLES } from '../../enums/user';
import { Order } from '../modules/order/order.model';

export const orderSpecificUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.user);
    // verify requesting user first
    const isRightUser = await User.findById(req.user._id).lean();

    if (!isRightUser) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You do not have permission to access this resource'
      );
    }

    if (isRightUser.role === ENUM_USER_ROLES.BUYER) {
      const orderedCow = await Order.findOne({ buyer: isRightUser._id });
      console.log(orderedCow);
    } else if (isRightUser.role === ENUM_USER_ROLES.SELLER) {
      const soldCows = await Book.find({
        seller: isRightUser._id,
        label: 'sold out',
      });
    }

    // next();
  } catch (error) {
    next(error);
  }
};
