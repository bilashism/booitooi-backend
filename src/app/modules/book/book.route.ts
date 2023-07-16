import express from 'express';
import { ENUM_USER_ROLES } from '../../../enums/user';
import { auth } from '../../middlewares/auth';
import { rightCowSeller } from '../../middlewares/rightCowSeller';
import { validateRequest } from '../../middlewares/validateRequest';
import { bookController } from './book.controller';
import { BookValidation } from './book.validation';
export const bookRouter = express.Router();

bookRouter.post(
  '/',
  validateRequest(BookValidation.createBookZodSchema),
  auth(ENUM_USER_ROLES.SELLER),
  bookController.createBook
);

bookRouter.get(
  '/:id',
  auth(
    ENUM_USER_ROLES.SUPERUSER,
    ENUM_USER_ROLES.ADMIN,
    ENUM_USER_ROLES.SELLER,
    ENUM_USER_ROLES.BUYER
  ),
  bookController.getSingleBook
);

bookRouter.get(
  '/',
  auth(
    ENUM_USER_ROLES.SUPERUSER,
    ENUM_USER_ROLES.ADMIN,
    ENUM_USER_ROLES.SELLER,
    ENUM_USER_ROLES.BUYER
  ),
  bookController.getAllBooks
);

bookRouter.patch(
  '/:id',
  validateRequest(BookValidation.updateBookZodSchema),
  auth(ENUM_USER_ROLES.SELLER),
  rightCowSeller,
  bookController.updateBook
);

bookRouter.delete(
  '/:id',
  auth(ENUM_USER_ROLES.SELLER),
  rightCowSeller,
  bookController.deleteBook
);
