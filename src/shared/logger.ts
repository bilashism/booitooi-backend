import path from 'path';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
const { combine, timestamp, label, printf } = format;

const logFormat = printf(({ level, message, label, timestamp }) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${date.toDateString()} ${hours}:${minutes}:${seconds} [${label}] ${level}: ${message}`;
});

const rotateFileSharedConfig = {
  datePattern: 'DD-MM-YYYY--HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
};

const logFormatter = (lbl: string) =>
  combine(label({ label: lbl }), timestamp(), logFormat);

const infoLogger = createLogger({
  level: 'info',
  format: logFormatter('UMA'),

  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join(process.cwd(), 'logs/winston/info/%DATE%.log'),
      ...rotateFileSharedConfig,
    }),
  ],
});

const errorLogger = createLogger({
  level: 'error',
  format: logFormatter('UMA'),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join(process.cwd(), 'logs/winston/error/%DATE%.log'),
      ...rotateFileSharedConfig,
    }),
  ],
});

export { infoLogger, errorLogger };
