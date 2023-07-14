/* eslint-disable no-console */
import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './config/index';

process.on('uncaughtException', error => {
  console.log(error);
  process.exit(1);
});

let server: Server;

async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log(`🛢 Database is connected successfully`);

    server = app.listen(config.port, () => {
      const host = server.address();
      const protocol = 'http';
      let address = '';
      if (host && typeof host !== 'string') {
        address = host.address === '::' ? 'localhost' : host.address;
      }

      console.log(
        `🌐 Server is running at: ${protocol}://${address}:${config.port}`
      );
    });
  } catch (err) {
    console.log('Failed to connect to the database', err);
  }

  // Gracefully off your server

  process.on('unhandledRejection', error => {
    console.log('Gracefully closing the server...');
    if (server) {
      server.close(() => {
        console.log('closing');
        console.log(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

bootstrap();

process.on('SIGTERM', () => {
  console.log('SIGTERM is received');
  if (server) {
    server.close();
  }
});
