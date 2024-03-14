import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf } = format;

const formatter = combine(
    timestamp(),
    printf((data) => `${data.timestamp} [${data.service}] ${data.level.toUpperCase()}: ${data.message}`)
);

export function Logger(service) {
    return createLogger({
        format: formatter,
        defaultMeta: { service },
        transports: [new transports.Console()],
        level: process.env.LOG_LEVEL ?? 'debug'
    });
}
