import { z } from 'zod';
import { userRole } from './user.constant';
import { User } from './user.model';

const createUserZodSchema = z.object({
  body: z
    .object({
      name: z.object({
        firstName: z.string({
          required_error: 'first name is required',
        }),
        lastName: z.string({
          required_error: 'last name is required',
        }),
      }),
      role: z.enum(
        [...userRole.filter(role => role !== 'admin')] as [string, ...string[]],
        {
          required_error: 'role is required',
        }
      ),
      address: z.string({ required_error: 'address is required' }),
      phoneNumber: z.string({ required_error: 'phoneNumber is required' }),
      password: z.string().optional(),
      budget: z.number().optional(),
      income: z.number().optional(),
    })
    .refine(
      async user => {
        // Check if phoneNumber is unique
        const isExisting = await User.findOne({
          phoneNumber: user?.phoneNumber,
        }).lean();
        return isExisting ? false : true;
      },
      { message: 'Phone number already exists' }
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
