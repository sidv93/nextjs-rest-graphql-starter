import { createLogger, format } from 'winston';
import DailyRotateFile = require('winston-daily-rotate-file');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `[${timestamp} ${label} ${level}] : ${message}`;
});

export const logger = createLogger({
    level: 'info',
    format: combine(
        label({ label: 'api' }),
        timestamp(),
        myFormat,
        format.json()),
    transports: [
        new DailyRotateFile({
            frequency: '24h',
            filename: 'api-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '15d',
            dirname: process.env.API_LOGS_PATH,
            auditFile: 'audit.json'
        })
    ]
});
