import httpStatus, { NOT_FOUND, UNAUTHORIZED } from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelper';
import { User } from '../user/user.model';
import { ILoginUser, ILoginUserResponse } from './auth.interface';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, uid } = payload;
  const isExistingUser = await User.isUserExist(email);

  if (!isExistingUser) {
    throw new ApiError(NOT_FOUND, 'User not found');
  }
  // match password
  const isPasswordMatched = await User.isPasswordMatched(
    uid,
    isExistingUser?.uid
  );
  if (isExistingUser.uid && !isPasswordMatched) {
    throw new ApiError(UNAUTHORIZED, 'uid not matched');
  }

  //create access token & refresh token

  const { _id, role, uid: eUid } = isExistingUser;
  const accessToken = jwtHelpers.createToken(
    { _id, role, uid: eUid, email: isExistingUser.email },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { _id, role, uid, email: isExistingUser.email },
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

  const { email } = verifiedToken;

  // checking deleted user's refresh token

  const isUserExist = await User.isUserExist(email);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  //generate new token
  const newAccessToken = jwtHelpers.createToken(
    {
      _id: isUserExist._id,
      role: isUserExist.role,
      email: isUserExist.email,
      uid: isUserExist.uid,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

export const authService = { loginUser, refreshToken };
