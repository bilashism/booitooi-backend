/* eslint-disable no-console */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { handleCastError } from '../../errors/handleCastError';
import { handleValidationError } from '../../errors/handleValidationError';
import { handleZodError } from '../../errors/handleZodError';
import { ErrorMessage } from '../../interfaces/error';

export type IGlobalErrorResponse = {
  success: false;
  message: string;
  errorMessages: ErrorMessage[];
  stack?: string | undefined;
};

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  next
) => {
  // res.status(400).json({ err });
  if (config.ENV === 'development') {
    console.log('💔 global error handler ~ ', error);
  } else {
    console.log('💔 global error handler ~ ', error);
  }
  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorMessages: ErrorMessage[] = [];

  if (error?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error?.name === 'CastError') {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ApiError) {
    message = error?.message;
    statusCode = error?.statusCode;
    errorMessages = message ? [{ path: '', message }] : [];
  } else if (error instanceof Error) {
    message = error?.message;
    errorMessages = message ? [{ path: '', message }] : [];
  }

  const responseData: IGlobalErrorResponse = {
    success: false,
    message,
    errorMessages,
    stack: error?.stack,
    // stack: config.env !== 'production' ? error?.stack : undefined,
  };

  res.status(statusCode).json(responseData);
};
