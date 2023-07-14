import httpStatus, { NOT_FOUND, UNAUTHORIZED } from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelper';
import { User } from '../user/user.model';
import { ILoginUser, ILoginUserResponse } from './auth.interface';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { phoneNumber, password } = payload;
  const isExistingUser = await User.isUserExist(phoneNumber);

  if (!isExistingUser) {
    throw new ApiError(NOT_FOUND, 'User not found');
  }
  // match password
  const isPasswordMatched = await User.isPasswordMatched(
    password,
    isExistingUser?.password
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

  const isUserExist = await User.isUserExist(phoneNumber);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
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

export const authService = { loginUser, refreshToken };
