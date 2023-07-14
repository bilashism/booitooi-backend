import { Secret } from 'jsonwebtoken';
import { ILoginUser, ILoginUserResponse } from './../auth/auth.interface';
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus, { NOT_FOUND, UNAUTHORIZED } from 'http-status';
import config from '../../../config';
import { ENUM_USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelper';
import { IAdmin } from './admin.interface';
import { Admin } from './admin.model';

const createAdmin = async (admin: IAdmin): Promise<IAdmin | null> => {
  // default password
  if (!admin.password) {
    admin.password = config.DEFAULT_ADMIN_PASS as string;
  }
  // set role
  admin.role = ENUM_USER_ROLES.ADMIN;

  const newAdmin = await Admin.create(admin);

  if (!newAdmin) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create admin.');
  }

  const result = await Admin.findById(newAdmin._id);
  return result;
};

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { phoneNumber, password } = payload;
  const isExistingUser = await Admin.isUserExist(phoneNumber);

  if (!isExistingUser || isExistingUser.role !== 'admin') {
    throw new ApiError(NOT_FOUND, 'Admin not found');
  }
  // match password
  const isPasswordMatched = await Admin.isPasswordMatched(
    password,
    isExistingUser.password
  );

  if (isExistingUser.password && !isPasswordMatched) {
    throw new ApiError(UNAUTHORIZED, 'password not matched');
  }

  //create access token & refresh token

  const { _id, role } = isExistingUser;
  const accessToken = jwtHelpers.createToken(
    { _id, role, phoneNumber: isExistingUser.phoneNumber },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { _id, role, phoneNumber: isExistingUser.phoneNumber },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }
  const { phoneNumber } = verifiedToken;

  // checking deleted user's refresh token

  const isUserExist = await Admin.isUserExist(phoneNumber);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin does not exist');
  }
  //generate new token
  const newAccessToken = jwtHelpers.createToken(
    {
      _id: isUserExist._id,
      role: isUserExist.role,
      phoneNumber: isUserExist.phoneNumber,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AdminService = {
  createAdmin,
  loginUser,
  refreshToken,
};
