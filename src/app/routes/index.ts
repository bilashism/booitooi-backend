import express, { Router } from 'express';
import { authRouter } from '../modules/auth/auth.route';
import { userRouter } from '../modules/user/user.route';
import { cowRouter } from '../modules/cow/cow.route';
import { orderRouter } from '../modules/order/order.route';
import { AdminRoutes } from '../modules/admin/admin.route';

export const appRouter: Router = express.Router();

type IRoute = {
  path: string;
  router: Router;
};

const ROUTES: IRoute[] = [
  {
    path: '/users',
    router: userRouter,
  },
  {
    path: '/auth',
    router: authRouter,
  },
  {
    path: '/cows',
    router: cowRouter,
  },
  {
    path: '/admins',
    router: AdminRoutes,
  },
  {
    path: '/orders',
    router: orderRouter,
  },
];

ROUTES.forEach(({ path, router }) => appRouter.use(path, router));
