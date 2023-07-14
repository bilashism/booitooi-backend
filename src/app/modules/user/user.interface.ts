/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { IExistingUser } from '../admin/admin.interface';
export type IUserName = {
  firstName: string;
  lastName: string;
};
export type IUserFilters = {
  searchTerm?: string;
};
export type IUserRole = 'buyer' | 'seller' | 'admin';
export type IUser = {
  id: string;
  password: string;
  phoneNumber: string;
  role: IUserRole;
  name: IUserName;
  address: string;
  budget: number;
  income: number;
};
export type UserModel = {
  isUserExist(phoneNumber: string): Promise<IExistingUser | null>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;

// export type UserModel = Model<IUser, Record<string, unknown>>;
