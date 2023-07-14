import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { authController } from './auth.controller';
import { authValidation } from './auth.validation';
import { auth } from '../../middlewares/auth';
import { ENUM_USER_ROLES } from '../../../enums/user';
export const authRouter = express.Router();

authRouter.post(
  '/login',
  validateRequest(authValidation.loginZodSchema),
  authController.loginUser
);
authRouter.post(
  '/change-password',
  validateRequest(authValidation.changePasswordZodSchema),
  auth(
    ENUM_USER_ROLES.SUPER_ADMIN,
    ENUM_USER_ROLES.ADMIN,
    ENUM_USER_ROLES.FACULTY,
    ENUM_USER_ROLES.STUDENT
  ),
  authController.changePassword
);
authRouter.post(
  '/refresh-token',
  validateRequest(authValidation.refreshTokenZodSchema),
  authController.refreshToken
);
