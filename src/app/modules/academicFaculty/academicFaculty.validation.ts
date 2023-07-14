import { z } from 'zod';

const createAcademicFacultyZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Please provide a title',
    }),
  }),
});

export const AcademicFacultyValidation = {
  createAcademicFacultyZodSchema,
};
