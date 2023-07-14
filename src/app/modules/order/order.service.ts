import httpStatus from 'http-status';
import mongoose, { SortOrder } from 'mongoose';
import { ENUM_USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { IVerifiedUserToken } from '../../../helpers/jwtHelper';
import {
  IPaginationOptions,
  paginationHelper,
} from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { Admin } from '../admin/admin.model';
import { Cow } from '../cow/cow.model';
import { User } from '../user/user.model';
import { orderSearchableFields } from './order.constant';
import { IOrder, IOrderFilters } from './order.interface';
import { Order } from './order.model';

const createOrder = async (order: IOrder): Promise<IOrder | null> => {
  let newOrderData = null;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const buyer = await User.findById(order.buyer);
    const cow = await Cow.findById(order.cow);

    if (!buyer || buyer.role !== ENUM_USER_ROLES.BUYER) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Buyer not found');
    }

    if (!cow || cow.label === 'sold out') {
      throw new ApiError(httpStatus.NOT_FOUND, 'Cow is not available');
    }

    const seller = await User.findById(cow.seller);

    if (!seller) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Seller not found');
    }

    const isAbleToBuy = buyer.budget >= cow.price;

    if (!isAbleToBuy) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not enough budget.');
    }

    const updatedCow = await Cow.findOneAndUpdate(
      { _id: cow._id },
      { label: 'sold out' },
      { session, new: true }
    );
    const updatedSeller = await User.findOneAndUpdate(
      { _id: cow.seller },
      { income: seller.income + cow.price },
      { session, new: true }
    );
    const updatedBuyer = await User.findOneAndUpdate(
      { _id: buyer._id },
      { budget: buyer.budget - cow.price },
      { session, new: true }
    );

    if (!updatedCow || !updatedBuyer || !updatedSeller) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to create order'
      );
    }

    const newOrder = await Order.create(
      [
        {
          cow: updatedCow?._id,
          buyer: updatedBuyer?._id,
        },
      ],
      { session }
    );

    if (!newOrder.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create new order');
    }
    newOrderData = newOrder[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (newOrderData) {
    newOrderData = await Order.findById(newOrderData._id)
      .populate({
        path: 'cow',
        populate: [
          {
            path: 'seller',
          },
        ],
      })
      .populate('buyer');
  }

  if (!newOrderData) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create order!'
    );
  }
  return newOrderData;
};

const getAllOrders = async (
  filters: IOrderFilters,
  paginationOptions: IPaginationOptions,
  verifiedUser: IVerifiedUserToken
): Promise<IGenericResponse<IOrder[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: orderSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: {
          $regex: value,
          $options: 'i',
        },
      })),
    });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortCondition: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};
  let result = undefined;
  let total = 0;
  const isRightUser =
    (await User.findById(verifiedUser._id).lean()) ||
    (await Admin.findById(verifiedUser._id).lean());

  if (!isRightUser) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You do not have permission to access this resource'
    );
  }
  if (isRightUser.role === ENUM_USER_ROLES.BUYER) {
    result = await Order.find({ buyer: isRightUser._id })
      .populate({
        path: 'cow',
        populate: [{ path: 'seller', select: { budget: 0, income: 0 } }],
      })
      .populate('buyer', { budget: 0, income: 0 })
      .sort(sortCondition)
      .skip(skip)
      .limit(limit);
    total = result.length;
  } else if (isRightUser.role === ENUM_USER_ROLES.SELLER) {
    const soldCows = await Cow.find({
      seller: isRightUser._id,
      label: 'sold out',
    });

    result = soldCows.map(
      async cow =>
        await Order.findOne({ cow: cow._id })
          .populate({
            path: 'cow',
            populate: [{ path: 'seller', select: { budget: 0, income: 0 } }],
          })
          .populate('buyer', { budget: 0, income: 0 })
          .sort(sortCondition)
          .skip(skip)
          .limit(limit)
    );
    total = result.length;
  } else if (
    isRightUser.role === ENUM_USER_ROLES.ADMIN ||
    isRightUser.role === ENUM_USER_ROLES.SUPERUSER
  ) {
    result = await Order.find(whereConditions)
      .populate({
        path: 'cow',
        populate: [{ path: 'seller', select: { budget: 0, income: 0 } }],
      })
      .populate('buyer', { budget: 0, income: 0 })
      .sort(sortCondition)
      .skip(skip)
      .limit(limit);
    total = await Order.countDocuments();
  }
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result as IOrder[],
  };
};
// const getSingleOrder = async (id: string): Promise<IOrder | null> => {
//   const result = await Order.findById(id);
//   return result;
// };

// const updateOrder = async (
//   id: string,
//   payload: Partial<IOrder>
// ): Promise<IOrder | null> => {
//   const result = await Order.findOneAndUpdate({ _id: id }, payload, {
//     new: true,
//   });
//   return result;
// };
// const deleteOrder = async (id: string): Promise<IOrder | null> => {
//   const result = await Order.findByIdAndDelete(id);
//   return result;
// };

export const orderService = {
  createOrder,
  getAllOrders,
  // getSingleOrder,
  // updateOrder,
  // deleteOrder,
};
