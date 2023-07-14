import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { academicFacultyController } from './academicFaculty.controller';
import { AcademicFacultyValidation } from './academicFaculty.validation';
import { auth } from '../../middlewares/auth';
import { ENUM_USER_ROLES } from '../../../enums/user';

export const academicFacultyRouter = express.Router();

// create faculty
academicFacultyRouter.post(
  '/create',
  validateRequest(AcademicFacultyValidation.createAcademicFacultyZodSchema),
  auth(ENUM_USER_ROLES.SUPER_ADMIN, ENUM_USER_ROLES.ADMIN),
  academicFacultyController.createFaculty
);

// get faculty
academicFacultyRouter.get(
  '/:id',
  auth(
    ENUM_USER_ROLES.SUPER_ADMIN,
    ENUM_USER_ROLES.ADMIN,
    ENUM_USER_ROLES.FACULTY
  ),

  academicFacultyController.getSingleFaculty
);
academicFacultyRouter.get(
  '/',
  auth(
    ENUM_USER_ROLES.SUPER_ADMIN,
    ENUM_USER_ROLES.ADMIN,
    ENUM_USER_ROLES.FACULTY
  ),

  academicFacultyController.getAllFaculties
);

// update faculty
academicFacultyRouter.patch(
  '/:id',
  validateRequest(AcademicFacultyValidation.createAcademicFacultyZodSchema),
  auth(
    ENUM_USER_ROLES.SUPER_ADMIN,
    ENUM_USER_ROLES.ADMIN,
    ENUM_USER_ROLES.FACULTY
  ),
  academicFacultyController.updateFaculty
);

// delete faculty
academicFacultyRouter.delete(
  '/:id',
  auth(ENUM_USER_ROLES.SUPER_ADMIN, ENUM_USER_ROLES.ADMIN),
  academicFacultyController.deleteFaculty
);
