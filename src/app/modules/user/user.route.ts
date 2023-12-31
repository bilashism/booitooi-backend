import express from 'express';
import { ENUM_USER_ROLES } from '../../../enums/user';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { userController } from './user.controller';
import { UserValidation } from './user.validation';
export const userRouter = express.Router();

// userRouter.post(
//   '/create',
//   validateRequest(UserValidation.createUserZodSchema),
//   userController.createUser
// );

userRouter.get(
  '/:id',
  auth(ENUM_USER_ROLES.SUPERUSER, ENUM_USER_ROLES.ADMIN),
  userController.getSingleUser
);
userRouter.get(
  '/email/:email',
  // auth(ENUM_USER_ROLES.SUPERUSER, ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.USER),
  userController.getSingleUserByEmail
);
userRouter.delete(
  '/:id',
  auth(ENUM_USER_ROLES.SUPERUSER, ENUM_USER_ROLES.ADMIN),
  userController.deleteUser
);
userRouter.patch(
  '/:id',
  validateRequest(UserValidation.updateUserZodSchema),
  auth(ENUM_USER_ROLES.SUPERUSER, ENUM_USER_ROLES.ADMIN),
  userController.updateUser
);
userRouter.get(
  '/',
  // auth(ENUM_USER_ROLES.SUPERUSER, ENUM_USER_ROLES.ADMIN),
  userController.getAllUsers
);
userRouter.get(
  '/check/:email',
  // auth(ENUM_USER_ROLES.SUPERUSER, ENUM_USER_ROLES.ADMIN),
  userController.checkSingleUser
);
