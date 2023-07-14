import { Request, RequestHandler, Response } from 'express';
import httpStatus, { OK } from 'http-status';
import config from '../../../config';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import {
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './../auth/auth.interface';
import { IAdmin } from './admin.interface';
import { AdminService } from './admin.service';
const createAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const admin: IAdmin = req.body;
    const result = await AdminService.createAdmin(admin);

    sendResponse<IAdmin>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin created successfully!',
      data: result,
    });
  }
);

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AdminService.loginUser(loginData);
  const { refreshToken, ...others } = result;

  // set refresh token into cookie

  const cookieOptions = {
    secure: config.ENV === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: others,
    message: 'Login successful',
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AdminService.refreshToken(refreshToken);

  // set refresh token into cookie

  const cookieOptions = {
    secure: config.ENV === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: OK,
    success: true,
    message: 'User logged in successfully !',
    data: result,
  });
});

export const AdminController = {
  createAdmin,
  loginUser,
  refreshToken,
};
