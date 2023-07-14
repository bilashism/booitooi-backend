import { z } from 'zod';
const createOrderZodSchema = z.object({
  body: z.object({
    cow: z.string({
      required_error: 'cow id is required',
    }),
    buyer: z.string({
      required_error: 'buyer id is required',
    }),
  }),
});
const updateOrderZodSchema = z.object({
  body: z.object({
    buyer: z.string().optional(),
    cow: z.string().optional(),
  }),
});
export const OrderValidation = {
  createOrderZodSchema,
  updateOrderZodSchema,
};
