import { z } from 'zod';

const loginZodSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'email is required',
    }),
    uid: z.string({ required_error: 'uid is required' }),
  }),
});
const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
});
export const authValidation = {
  loginZodSchema,
  refreshTokenZodSchema,
};
