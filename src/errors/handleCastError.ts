import httpStatus from 'http-status';
import { ErrorResponse } from '../interfaces/errorResponse';
import { CastError } from 'mongoose';
import { ErrorMessage } from '../interfaces/error';

export const handleCastError = (error: CastError): ErrorResponse => {
  const statusCode = httpStatus.NOT_FOUND;
  const errors: ErrorMessage[] = [
    {
      path: error.path,
      message: 'Invalid ID',
    },
  ];
  return {
    statusCode,
    message: 'CastError Error',
    errorMessages: errors,
  };
};
