/* eslint-disable no-console */
import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './config/index';
import { errorLogger, infoLogger } from './shared/logger';

process.on('uncaughtException', error => {
  errorLogger.error(error);
  process.exit(1);
});

let server: Server;

async function bootstrap() {
  try {
    await mongoose.connect(config.DATABASE_URL as string);
    infoLogger.info(`🛢 Database is connected successfully`);

    server = app.listen(config.PORT, () => {
      const host = server.address();
      const protocol = 'http';
      let address = '';
      if (host && typeof host !== 'string') {
        address = host.address === '::' ? 'localhost' : host.address;
      }

      infoLogger.info(
        `🌐 Server is running at: ${protocol}://${address}:${config.PORT}`
      );
    });
  } catch (err) {
    infoLogger.info('Failed to connect to the database', err);
  }

  // Gracefully off your server

  process.on('unhandledRejection', error => {
    console.log('Gracefully closing the server...');
    if (server) {
      server.close(() => {
        console.log('closing');
        errorLogger.error(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

bootstrap();

process.on('SIGTERM', () => {
  infoLogger.info('SIGTERM is received');
  if (server) {
    server.close();
  }
});
