import { z } from 'zod';
import { userRole } from './user.constant';
import { User } from './user.model';

const createUserZodSchema = z.object({
  body: z
    .object({
      // password: z.string({
      //   required_error: 'password is required',
      // }),
      email: z.string({ required_error: 'email is required' }),
      uid: z.string({ required_error: 'uid is required' }),
      emailVerified: z.boolean({ required_error: 'email status is required' }),
      displayName: z.string().optional(),
      role: z.string().optional(),
    })
    .refine(
      async user => {
        // Check if email is unique
        const isExisting = await User.findOne({
          email: user?.email,
        }).lean();
        return isExisting ? false : true;
      },
      { message: 'email already exists' }
    ),
});
const updateUserZodSchema = z.object({
  body: z.object({
    name: z
      .object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      })
      .optional(),
    role: z
      .enum([...userRole.filter(role => role !== 'admin')] as [
        string,
        ...string[]
      ])
      .optional(),
    address: z.string().optional(),
    phoneNumber: z.string().optional(),
    password: z.string().optional(),
    budget: z.number().optional(),
    income: z.number().optional(),
  }),
});

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
};
