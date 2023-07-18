import { z } from 'zod';
import { bookGenres, bookLabel } from './book.constant';

const createBookZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'book name is required' }),
    author: z.string({ required_error: 'author name is required' }),
    description: z.string({ required_error: 'book description is required' }),
    genre: z.enum([...bookGenres] as [string, ...string[]], {
      required_error: 'genre is required',
    }),
    publicationDate: z.string({
      required_error: 'Date is required',
    }),
  }),
});
const updateBookZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    author: z.string().optional(),
    description: z.string().optional(),
    publicationDate: z.string().optional(),
    genre: z.enum([...bookGenres] as [string, ...string[]]).optional(),
    label: z.enum([...bookLabel] as [string, ...string[]]).optional(),
    reviews: z
      .record(
        z.object({
          reviewer: z.string().optional(),
          rating: z.number().optional(),
          content: z.string().optional(),
        })
      )
      .optional(),
  }),
});
const addBookReviewZodSchema = z.object({
  body: z.object({
    bookId: z.string({
      required_error: 'bookId required',
    }),
    reviewer: z.string({
      required_error: 'reviewer required',
    }),
    rating: z
      .number({
        required_error: 'rating required',
      })
      .min(0, 'rating cannot be negative')
      .max(5, 'rating cannot be more than 5'),
    content: z.string({
      required_error: 'content required',
    }),
  }),
});

export const BookValidation = {
  createBookZodSchema,
  updateBookZodSchema,
  addBookReviewZodSchema,
};
