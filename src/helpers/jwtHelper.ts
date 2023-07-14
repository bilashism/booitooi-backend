import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { IUserRole } from '../app/modules/user/user.interface';
export type ICreateTokenPayload = {
  _id: Types.ObjectId;
  role: IUserRole;
  phoneNumber: string;
};
export type IVerifiedUserToken = JwtPayload & ICreateTokenPayload;

const createToken = (
  payload: ICreateTokenPayload,
  secret: Secret,
  expireTime: string
): string => {
  return jwt.sign(payload, secret, {
    expiresIn: expireTime,
  });
};

const verifyToken = (token: string, secret: Secret): IVerifiedUserToken => {
  return jwt.verify(token, secret) as IVerifiedUserToken;
};

export const jwtHelpers = {
  createToken,
  verifyToken,
};
