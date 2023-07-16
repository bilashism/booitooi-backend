import { Model, ObjectId } from 'mongoose';
import { IBook } from '../book/book.interface';
import { IUser } from '../user/user.interface';

export type IOrderFilters = {
  searchTerm?: string;
};
export type IOrder = {
  cow: ObjectId | IBook;
  buyer: ObjectId | Extract<IUser, { role: 'buyer' }>;
};
export type OrderModel = Model<IOrder, Record<string, unknown>>;
