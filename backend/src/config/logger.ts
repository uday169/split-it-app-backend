import winston from 'winston';
import fs from 'fs';
import path from 'path';
import config from './config';

// Vercel and other serverless platforms have a read-only filesystem.
// File transports are only used when the logs directory can be created.
const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

const fileTransports: winston.transport[] = [];

if (!isServerless) {
  const logsDir = path.resolve('logs');
  try {
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    fileTransports.push(
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' })
    );
  } catch {
    // Filesystem is read-only; fall back to console-only logging
  }
}

const logger = winston.createLogger({
  level: config.nodeEnv === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'split-it-backend' },
  transports: [
    // Always log to console; on serverless this is the only transport
    new winston.transports.Console({
      format:
        config.nodeEnv !== 'production'
          ? winston.format.combine(winston.format.colorize(), winston.format.simple())
          : winston.format.json(),
    }),
    ...fileTransports,
  ],
});

export default logger;
