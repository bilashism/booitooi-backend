import { ENUM_USER_ROLES } from './../../../enums/user';
import { IUser } from './../user/user.interface';
/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { IUserRole } from '../user/user.interface';

export type UserName = {
  firstName: string;
  lastName: string;
};

export type IAdmin = Omit<IUser, 'role'> & {
  role: 'admin';
};

export type IExistingUser = {
  _id: Types.ObjectId;
  role: IUserRole;
  uid: string;
  email: string;
};
export type AdminModel = {
  isUserExist(phoneNumber: string): Promise<IExistingUser | null>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IAdmin>;

// export type AdminModel = Model<IAdmin, Record<string, unknown>>;

export type IAdminFilters = {
  searchTerm?: string;
  phoneNumber?: string;
  name?: string;
};
// export type ILoginUser = {
//   phoneNumber: string;
//   password: string;
// };
// export type ILoginUserResponse = {
//   accessToken: string;
//   refreshToken?: string;
// };
// export type IRefreshTokenResponse = {
//   accessToken: string;
// };
