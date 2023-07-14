import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { AdminController } from './admin.controller';
import { AdminValidation } from './admin.validation';
import { authValidation } from '../auth/auth.validation';
const router = express.Router();

router.post(
  '/create-admin',
  validateRequest(AdminValidation.createAdminZodSchema),
  AdminController.createAdmin
);
router.post(
  '/login',
  validateRequest(authValidation.loginZodSchema),
  AdminController.loginUser
);
router.post(
  '/refresh-token',
  validateRequest(authValidation.refreshTokenZodSchema),
  AdminController.refreshToken
);
export const AdminRoutes = router;
