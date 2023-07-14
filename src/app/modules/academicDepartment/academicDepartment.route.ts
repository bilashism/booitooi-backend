import express from 'express';
import { ENUM_USER_ROLES } from '../../../enums/user';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { AcademicDepartmentController } from './academicDepartment.controller';
import { AcademicDepartmentValidation } from './academicDepartment.validation';

export const academicDepartmentRouter = express.Router();

academicDepartmentRouter.post(
  '/create',
  validateRequest(
    AcademicDepartmentValidation.createAcademicDepartmentZodSchema
  ),
  auth(ENUM_USER_ROLES.SUPER_ADMIN, ENUM_USER_ROLES.ADMIN),
  AcademicDepartmentController.createDepartment
);

academicDepartmentRouter.get(
  '/:id',
  AcademicDepartmentController.getSingleDepartment
);

academicDepartmentRouter.patch(
  '/:id',
  validateRequest(
    AcademicDepartmentValidation.updateAcademicDepartmentZodSchema
  ),
  auth(ENUM_USER_ROLES.SUPER_ADMIN, ENUM_USER_ROLES.ADMIN),
  AcademicDepartmentController.updateDepartment
);

academicDepartmentRouter.delete(
  '/:id',
  auth(ENUM_USER_ROLES.SUPER_ADMIN),
  AcademicDepartmentController.deleteDepartment
);

academicDepartmentRouter.get(
  '/',
  AcademicDepartmentController.getAllDepartments
);
