import httpStatus from 'http-status';
import { SortOrder } from 'mongoose';
import config from '../../../config/index';
import ApiError from '../../../errors/ApiError';
import {
  IPaginationOptions,
  paginationHelper,
} from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { userSearchableFields } from './user.constant';
import { IUser, IUserFilters } from './user.interface';
import { User } from './user.model';
import { generateUserId } from './user.utils';
import { ENUM_USER_ROLES } from '../../../enums/user';

/**
 * This function creates a new user with an auto-generated ID and default password, and returns the
 * created user object.
 * @param {IUser} user - The `user` parameter is an object of type `IUser` which contains information
 * about the user being created.
 * @returns The function `createUser` returns a Promise that resolves to an `IUser` object or `null`.
 */
const createUser = async (user: IUser): Promise<IUser | null> => {
  // default password
  if (!user.password) {
    user.password = config.default_user_pass as string;
  }
  user.role = ENUM_USER_ROLES.USER;
  const createdUser = await User.create(user);

  if (!createUser) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create user!'
    );
  }
  const result = await User.findById(createdUser._id);
  return result;
};

const getAllUsers = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IUser[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: userSearchableFields.map(field => ({
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

  const result = await User.find(whereConditions)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);
  const total = await User.countDocuments();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  return result;
};
const getSingleUserByEmail = async (email: string): Promise<IUser | null> => {
  const result = await User.findOne({ email }).select([
    'id',
    'email',
    'role',
    'uid',
  ]);
  return result;
};
const checkSingleUser = async (email: string): Promise<boolean> => {
  const result = await User.findOne({ email });
  return result ? true : false;
};

const updateUser = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const result = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};
const deleteUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findByIdAndDelete(id);
  return result;
};

export const userService = {
  createUser,
  getSingleUser,
  checkSingleUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getSingleUserByEmail,
};
