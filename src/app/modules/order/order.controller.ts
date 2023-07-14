import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constants/pagination';
import { catchAsync } from '../../../shared/catchAsync';
import { pick } from '../../../shared/pick';
import { sendResponse } from '../../../shared/sendResponse';
import { IOrder } from './order.interface';
import { orderService } from './order.service';
import { orderFilterableFields } from './order.constant';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const order: IOrder = req.body;
  const result = await orderService.createOrder(order);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order created successfully!',
    data: result,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, orderFilterableFields);
  const paginationOptions = pick(req.query, PAGINATION_FIELDS);
  const result = await orderService.getAllOrders(
    filters,
    paginationOptions,
    req.user
  );
  sendResponse<IOrder[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

// const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
//   const id = req.params.id;
//   const result = await orderService.getSingleOrder(id);
//   sendResponse<IOrder>(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Order retrieved successfully',
//     data: result,
//   });
// });

// const updateOrder = catchAsync(async (req: Request, res: Response) => {
//   const id = req.params.id;
//   const updatedData = req.body;
//   const result = await orderService.updateOrder(id, updatedData);
//   sendResponse<IOrder>(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Order updated successfully',
//     data: result,
//   });
// });
// const deleteOrder = catchAsync(async (req: Request, res: Response) => {
//   const id = req.params.id;
//   const result = await orderService.deleteOrder(id);
//   sendResponse<IOrder>(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Order deleted successfully',
//     data: result,
//   });
// });

export const orderController = {
  createOrder,
  getAllOrders,
  // getSingleOrder,
  // updateOrder,
  // deleteOrder,
};
