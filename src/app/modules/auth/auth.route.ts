import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { userController } from '../user/user.controller';
import { UserValidation } from '../user/user.validation';
import { authController } from './auth.controller';
import { authValidation } from './auth.validation';
export const authRouter = express.Router();

authRouter.post(
  '/signup',
  validateRequest(UserValidation.createUserZodSchema),
  userController.createUser
);
authRouter.post(
  '/login',
  validateRequest(authValidation.loginZodSchema),
  authController.loginUser
);
authRouter.post(
  '/refresh-token',
  validateRequest(authValidation.refreshTokenZodSchema),
  authController.refreshToken
);
