import mongoose from 'mongoose';
import { ErrorMessage } from '../interfaces/error';
import { ErrorResponse } from '../interfaces/errorResponse';

export const handleValidationError = (
  err: mongoose.Error.ValidationError
): ErrorResponse => {
  const errors: ErrorMessage[] = Object.values(err?.errors).map(
    (
      error: mongoose.Error.ValidatorError | mongoose.Error.CastError
    ): ErrorMessage => {
      return {
        path: error?.path,
        message: error?.message,
      };
    }
  );
  const statusCode = 400;

  return {
    statusCode,
    errorMessages: errors,
    message: 'Validation Error',
  };
};
