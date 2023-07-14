import { z } from 'zod';
import { cowBreeds, cowCategory, cowLabel, cowLocations } from './cow.constant';

const createCowZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'name is required' }),
    age: z.number({ required_error: 'address is required' }),
    price: z.number({ required_error: 'price is required' }),
    weight: z.number({ required_error: 'weight is required' }),
    location: z.enum([...cowLocations] as [string, ...string[]], {
      required_error: 'location is required',
    }),
    breed: z.enum([...cowBreeds] as [string, ...string[]], {
      required_error: 'breed is required',
    }),
    label: z.enum([...cowLabel] as [string, ...string[]], {
      required_error: 'label is required',
    }),
    category: z.enum([...cowCategory] as [string, ...string[]], {
      required_error: 'category is required',
    }),
    seller: z.string({
      required_error: 'seller id is required',
    }),
  }),
});
const updateCowZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    age: z.number().optional(),
    price: z.number().optional(),
    weight: z.number().optional(),
    location: z.enum([...cowLocations] as [string, ...string[]]).optional(),
    breed: z.enum([...cowBreeds] as [string, ...string[]]).optional(),
    label: z.enum([...cowLabel] as [string, ...string[]]).optional(),
    category: z.enum([...cowCategory] as [string, ...string[]]).optional(),
    seller: z.string().optional(),
  }),
});

export const CowValidation = {
  createCowZodSchema,
  updateCowZodSchema,
};
