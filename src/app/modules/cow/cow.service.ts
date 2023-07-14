import httpStatus from 'http-status';
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import {
  IPaginationOptions,
  paginationHelper,
} from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { cowSearchableFields } from './cow.constant';
import { ICow, ICowFilters } from './cow.interface';
import { Cow } from './cow.model';

const createCow = async (cow: ICow): Promise<ICow | null> => {
  const createdCow = await Cow.create(cow);

  if (!createCow) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create cow!'
    );
  }
  return createdCow;
};

const getAllCows = async (
  filters: ICowFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ICow[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: cowSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData)
        .filter(([field]) => field !== 'maxPrice' && field !== 'minPrice')
        .map(([field, value]) => ({
          [field]: {
            $regex: value,
            $options: 'i',
          },
        })),
    });
    andConditions.push({
      $and: Object.entries(filtersData)
        .filter(([field]) => field === 'maxPrice')
        .map(([, value]) => ({
          price: {
            $lte: value,
          },
        })),
    });
    andConditions.push({
      $and: Object.entries(filtersData)
        .filter(([field]) => field === 'minPrice')
        .map(([, value]) => ({
          price: {
            $gte: value,
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

  const filteredAndConditions = andConditions?.filter(
    item =>
      (item['$and'] && item['$and']?.length > 0) ||
      (item['$or'] && item['$or']?.length > 0)
  );

  const whereConditions =
    andConditions.length > 0 ? { $and: filteredAndConditions } : {};
  const populateOptions = {
    path: 'seller',
    select: '-password', // Exclude the password field from the populated user document
  };
  const result = await Cow.find(whereConditions)
    .populate(populateOptions)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);
  const total = await Cow.countDocuments();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const getSingleCow = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findById(id);
  return result;
};

const updateCow = async (
  id: string,
  payload: Partial<ICow>
): Promise<ICow | null> => {
  const result = await Cow.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};
const deleteCow = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findByIdAndDelete(id);
  return result;
};

export const cowService = {
  createCow,
  getAllCows,
  getSingleCow,
  updateCow,
  deleteCow,
};
