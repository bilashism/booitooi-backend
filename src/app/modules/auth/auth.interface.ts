export type ILoginUser = {
  email: string;
  uid: string;
};
export type ILoginUserResponse = {
  accessToken: string;
  refreshToken?: string;
};
export type IRefreshTokenResponse = {
  accessToken: string;
};
