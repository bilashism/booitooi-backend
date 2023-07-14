import { z } from 'zod';

const updateAdmin = z.object({
  body: z.object({
    name: z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
    }),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
  }),
});
const createAdminZodSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    role: z.string({
      required_error: 'role must be provided',
    }),
    name: z.object({
      firstName: z.string({
        required_error: 'First name is required',
      }),
      lastName: z.string({
        required_error: 'Last name is required',
      }),
    }),

    phoneNumber: z.string({
      required_error: 'Contact number is required',
    }),

    address: z.string({
      required_error: 'Present address is required',
    }),

    // .refine(
    //   async value => {
    //     // Check if email is unique
    //     const isExisting = await Admin.findOne({
    //       email: value?.email,
    //     }).lean();
    //     return isExisting ? false : true;
    //   },
    //   { message: 'Email already exists' }
    // ),
  }),
});

export const AdminValidation = {
  updateAdmin,
  createAdminZodSchema,
};
