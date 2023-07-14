import { SortOrder } from 'mongoose';

export type IPaginationOptions = {
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
};

export type IPaginationResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy?: string;
  sortOrder?: SortOrder;
};

const calculatePagination = (
  options: IPaginationOptions
): IPaginationResult => {
  const page = Number(options?.page || 1);
  const limit = Number(options?.limit || 10);
  const skip = (page - 1) * limit;
  const sortBy = options?.sortBy || 'createdAt';

  const sortOrder = options?.sortOrder || 'desc';

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export const paginationHelper = {
  calculatePagination,
};
