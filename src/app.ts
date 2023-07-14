import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import httpStatus from 'http-status';
import {
  IGlobalErrorResponse,
  globalErrorHandler,
} from './app/middlewares/globalErrorHandler';
import { appRouter } from './app/routes';
import config from './config';
import cookieParser from 'cookie-parser';
const app: Application = express();

// standard middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Application routes
app.use(`${config.API_PREFIX}`, appRouter);

// global error handler (must come after all routes middleware)
app.use(globalErrorHandler);

// not found routes handler
app.use((req: Request, res: Response) => {
  const notFoundResponseData: IGlobalErrorResponse = {
    success: false,
    message: 'The requested route was not found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'The requested route does not exist',
      },
    ],
    stack: undefined,
  };
  res.status(httpStatus.NOT_FOUND).json(notFoundResponseData);
});

export default app;
