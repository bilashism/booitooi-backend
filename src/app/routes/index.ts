import express, { Router } from 'express';
import { academicDepartmentRouter } from '../modules/academicDepartment/academicDepartment.route';
import { academicSemesterRouter } from '../modules/academicSemester/academicSemester.route';
import { AdminRoutes } from '../modules/admin/admin.route';
import { authRouter } from '../modules/auth/auth.route';
import { FacultyRoutes } from '../modules/faculty/faculty.route';
import { ManagementDepartmentRoutes } from '../modules/managementDepartment/managementDepartment.route';
import { studentRouter } from '../modules/student/student.route';
import { UserRoutes } from '../modules/user/user.route';
import { academicFacultyRouter } from './../modules/academicFaculty/academicFaculty.route';

export const appRouter: Router = express.Router();

type IRoute = {
  path: string;
  router: Router;
};

const ROUTES: IRoute[] = [
  {
    path: '/user',
    router: UserRoutes,
  },
  {
    path: '/student',
    router: studentRouter,
  },
  {
    path: '/management-departments',
    router: ManagementDepartmentRoutes,
  },
  {
    path: '/faculty',
    router: FacultyRoutes,
  },
  {
    path: '/admins',
    router: AdminRoutes,
  },
  {
    path: '/academic-semester',
    router: academicSemesterRouter,
  },
  {
    path: '/academic-faculty',
    router: academicFacultyRouter,
  },
  {
    path: '/academic-department',
    router: academicDepartmentRouter,
  },
  {
    path: '/auth',
    router: authRouter,
  },
];

ROUTES.forEach(({ path, router }) => appRouter.use(path, router));
