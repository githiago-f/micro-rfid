import winston from 'winston';

const { combine, timestamp, printf } = winston.format;

const formatter = combine(
    timestamp(),
    printf((data) => `${data.timestamp} [${data.service}] ${data.level.toUpperCase()}: ${data.message}`)
);

export function Logger(service) {
    return winston.createLogger({
        format: formatter,
        defaultMeta: { service },
        transports: [new winston.transports.Console()],
        level: process.env.LOG_LEVEL ?? 'debug'
    });
}
