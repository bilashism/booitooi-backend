import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { bookService } from './book.service';
import { IBook, IBookReview } from './book.interface';
import { pick } from '../../../shared/pick';
import { PAGINATION_FIELDS } from '../../../constants/pagination';
import { bookFilterableFields } from './book.constant';
import { UpdateWriteOpResult } from 'mongoose';

const createBook = catchAsync(async (req: Request, res: Response) => {
  const book: IBook = req.body;
  const result = await bookService.createBook(book);

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
  const result = await bookService.getAllBooks(filters, paginationOptions);
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
  const result = await bookService.getSingleBook(id);

  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book retrieved successfully',
    data: result,
  });
});

const getBookReviews = catchAsync(async (req: Request, res: Response) => {
  const { bookId: id } = req.params;
  const result = await bookService.getBookReviews(id);

  sendResponse<Partial<IBookReview[]>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book reviews retrieved successfully',
    data: result,
  });
});

const updateBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await bookService.updateBook(id, updatedData);
  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book updated successfully',
    data: result,
  });
});
const addBookReview = catchAsync(async (req: Request, res: Response) => {
  const { bookId: id, ...updatedData } = req.body;
  const result = await bookService.addBookReview(id, updatedData);
  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book review added successfully',
    data: result,
  });
});
const deleteBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await bookService.deleteBook(id);
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
  addBookReview,
  getSingleBook,
  getBookReviews,
  updateBook,
  deleteBook,
};
