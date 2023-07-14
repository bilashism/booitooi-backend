import express from 'express';
import { ENUM_USER_ROLES } from '../../../enums/user';
import { auth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { orderController } from './order.controller';
import { OrderValidation } from './order.validation';
export const orderRouter = express.Router();

orderRouter.post(
  '/',
  validateRequest(OrderValidation.createOrderZodSchema),
  auth(ENUM_USER_ROLES.BUYER),
  orderController.createOrder
);

// orderRouter.get('/:id', orderController.getSingleOrder);
// orderRouter.delete('/:id', orderController.deleteOrder);
// orderRouter.patch(
//   '/:id',
//   validateRequest(OrderValidation.updateOrderZodSchema),
//   orderController.updateOrder
// );
orderRouter.get(
  '/',
  auth(
    ENUM_USER_ROLES.BUYER,
    ENUM_USER_ROLES.SELLER,
    ENUM_USER_ROLES.ADMIN,
    ENUM_USER_ROLES.SUPERUSER
  ),
  orderController.getAllOrders
);
