import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { cowService } from './book.service';
import { IBook } from './book.interface';
import { pick } from '../../../shared/pick';
import { PAGINATION_FIELDS } from '../../../constants/pagination';
import { bookFilterableFields } from './book.constant';

const createBook = catchAsync(async (req: Request, res: Response) => {
  const book: IBook = req.body;
  const result = await cowService.createBook(book);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book created successfully!',
    data: result,
  });
});

const getAllBooks = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, bookFilterableFields);
  const paginationOptions = pick(req.query, PAGINATION_FIELDS);
  const result = await cowService.getAllBooks(filters, paginationOptions);
  sendResponse<IBook[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Books retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getSingleBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await cowService.getSingleBook(id);
  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book retrieved successfully',
    data: result,
  });
});

const updateBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await cowService.updateBook(id, updatedData);
  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book updated successfully',
    data: result,
  });
});
const deleteBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await cowService.deleteBook(id);
  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book deleted successfully',
    data: result,
  });
});

export const bookController = {
  createBook,
  getAllBooks,
  getSingleBook,
  updateBook,
  deleteBook,
};
