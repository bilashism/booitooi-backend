import { Model, ObjectId } from 'mongoose';
import { ICow } from '../cow/cow.interface';
import { IUser } from '../user/user.interface';

export type IOrderFilters = {
  searchTerm?: string;
};
export type IOrder = {
  cow: ObjectId | ICow;
  buyer: ObjectId | Extract<IUser, { role: 'buyer' }>;
};
export type OrderModel = Model<IOrder, Record<string, unknown>>;
