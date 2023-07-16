import httpStatus from 'http-status';
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import {
  IPaginationOptions,
  paginationHelper,
} from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { bookSearchableFields } from './book.constant';
import { IBook, IBookFilters } from './book.interface';
import { Book } from './book.model';

const createBook = async (cow: IBook): Promise<IBook | null> => {
  const createdCow = await Book.create(cow);

  if (!createBook) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create cow!'
    );
  }
  return createdCow;
};

const getAllBooks = async (
  filters: IBookFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IBook[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: bookSearchableFields.map(field => ({
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
  const result = await Book.find(whereConditions)
    .populate(populateOptions)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);
  const total = await Book.countDocuments();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const getSingleBook = async (id: string): Promise<IBook | null> => {
  const result = await Book.findById(id);
  return result;
};

const updateBook = async (
  id: string,
  payload: Partial<IBook>
): Promise<IBook | null> => {
  const result = await Book.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};
const deleteBook = async (id: string): Promise<IBook | null> => {
  const result = await Book.findByIdAndDelete(id);
  return result;
};

export const cowService = {
  createBook,
  getAllBooks,
  getSingleBook,
  updateBook,
  deleteBook,
};
