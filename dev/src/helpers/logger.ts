import winston from "winston";

const logFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.errors({ stack: true }),
    logFormat);

const transports = [new winston.transports.Console({format: winston.format.colorize({ all: true })}),
    new winston.transports.File({ filename: 'error.log', level: 'error'}),
    new winston.transports.File({ filename: 'event.log', level: 'info'}),
    new winston.transports.File({ filename: 'warn.log', level: 'warn'}),
];

export const logger = winston.createLogger({ format, transports });
