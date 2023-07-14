import express from 'express';
import { ENUM_USER_ROLES } from '../../../enums/user';
import { auth } from '../../middlewares/auth';
import { rightCowSeller } from '../../middlewares/rightCowSeller';
import { validateRequest } from '../../middlewares/validateRequest';
import { cowController } from './cow.controller';
import { CowValidation } from './cow.validation';
export const cowRouter = express.Router();

cowRouter.post(
  '/',
  validateRequest(CowValidation.createCowZodSchema),
  auth(ENUM_USER_ROLES.SELLER),
  cowController.createCow
);

cowRouter.get(
  '/:id',
  auth(
    ENUM_USER_ROLES.SUPERUSER,
    ENUM_USER_ROLES.ADMIN,
    ENUM_USER_ROLES.SELLER,
    ENUM_USER_ROLES.BUYER
  ),
  cowController.getSingleCow
);

cowRouter.get(
  '/',
  auth(
    ENUM_USER_ROLES.SUPERUSER,
    ENUM_USER_ROLES.ADMIN,
    ENUM_USER_ROLES.SELLER,
    ENUM_USER_ROLES.BUYER
  ),
  cowController.getAllCows
);

cowRouter.patch(
  '/:id',
  validateRequest(CowValidation.updateCowZodSchema),
  auth(ENUM_USER_ROLES.SELLER),
  rightCowSeller,
  cowController.updateCow
);

cowRouter.delete(
  '/:id',
  auth(ENUM_USER_ROLES.SELLER),
  rightCowSeller,
  cowController.deleteCow
);
