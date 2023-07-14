import { ZodError, ZodIssue } from 'zod';
import { ErrorMessage } from '../interfaces/error';
import { ErrorResponse } from '../interfaces/errorResponse';

export const handleZodError = (error: ZodError): ErrorResponse => {
  const errors: ErrorMessage[] = error.issues.map((issue: ZodIssue) => {
    return {
      message: issue.message,
      path: issue.path[issue.path.length - 1],
    };
  });
  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation Error',
    errorMessages: errors,
  };
};
