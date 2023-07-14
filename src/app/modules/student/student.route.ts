import express from 'express';
import { ENUM_USER_ROLES } from '../../../enums/user';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { studentController } from './student.controller';
import { studentValidation } from './student.validation';
export const studentRouter = express.Router();

studentRouter.get(
  '/:id',
  auth(
    ENUM_USER_ROLES.SUPER_ADMIN,
    ENUM_USER_ROLES.ADMIN,
    ENUM_USER_ROLES.FACULTY,
    ENUM_USER_ROLES.STUDENT
  ),
  studentController.getSingleStudent
);

studentRouter.get(
  '/',
  auth(
    ENUM_USER_ROLES.SUPER_ADMIN,
    ENUM_USER_ROLES.ADMIN,
    ENUM_USER_ROLES.FACULTY,
    ENUM_USER_ROLES.STUDENT
  ),
  studentController.getAllStudents
);

studentRouter.delete(
  '/:id',
  auth(ENUM_USER_ROLES.SUPER_ADMIN),
  studentController.deleteStudent
);

studentRouter.patch(
  '/:id',
  validateRequest(studentValidation.updateStudentZodSchema),
  auth(ENUM_USER_ROLES.SUPER_ADMIN, ENUM_USER_ROLES.ADMIN),
  studentController.updateStudent
);
