import express from 'express';
import { ENUM_USER_ROLES } from '../../../enums/user';
import { auth } from '../../middlewares/auth';
import { rightAuthor } from '../../middlewares/rightAuthor';
import { validateRequest } from '../../middlewares/validateRequest';
import { bookController } from './book.controller';
import { BookValidation } from './book.validation';
export const bookRouter = express.Router();

bookRouter.post(
  '/',
  validateRequest(BookValidation.createBookZodSchema),
  auth(ENUM_USER_ROLES.USER),
  bookController.createBook
);

bookRouter.get(
  '/:id',
  // auth(
  //   ENUM_USER_ROLES.SUPERUSER,
  //   ENUM_USER_ROLES.ADMIN,
  //   ENUM_USER_ROLES.SELLER,
  //   ENUM_USER_ROLES.BUYER,
  //   ENUM_USER_ROLES.USER
  // ),
  bookController.getSingleBook
);

bookRouter.get(
  '/',
  // auth(
  //   ENUM_USER_ROLES.SUPERUSER,
  //   ENUM_USER_ROLES.ADMIN,
  //   ENUM_USER_ROLES.SELLER,
  //   ENUM_USER_ROLES.USER,
  //   ENUM_USER_ROLES.BUYER
  // ),
  bookController.getAllBooks
);

bookRouter.patch(
  '/:id',
  validateRequest(BookValidation.updateBookZodSchema),
  auth(ENUM_USER_ROLES.USER),
  rightAuthor,
  bookController.updateBook
);

bookRouter.post(
  '/reviews',
  validateRequest(BookValidation.addBookReviewZodSchema),
  auth(ENUM_USER_ROLES.USER),
  bookController.addBookReview
);
bookRouter.get(
  '/reviews/:bookId',
  // auth(ENUM_USER_ROLES.USER),
  bookController.getBookReviews
);

bookRouter.delete(
  '/:id',
  auth(ENUM_USER_ROLES.USER),
  rightAuthor,
  bookController.deleteBook
);
