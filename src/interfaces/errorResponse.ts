import { ErrorMessage } from './error';

export type ErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: ErrorMessage[];
};
