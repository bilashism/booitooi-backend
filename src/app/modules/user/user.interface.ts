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
export type IUserRole = 'admin' | 'user';
export type IUser = {
  email: string;
  // password: string;
  role?: IUserRole;
  uid: string;
  emailVerified: boolean;
  displayName?: string;
};
export type UserModel = {
  isUserExist(email: string): Promise<IExistingUser | null>;
  isPasswordMatched(givenUid: string, savedUid: string): Promise<boolean>;
} & Model<IUser>;

// export type UserModel = Model<IUser, Record<string, unknown>>;
