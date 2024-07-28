import winston from 'winston';

const { combine, timestamp, printf } = winston.format;

const formatter = combine(
    timestamp(),
    printf((data) => `${data.timestamp} - ${data.service} [${data.level.toUpperCase()}]: ${data.message}`)
);

const consoleTransport = new winston.transports.Console({
    handleExceptions: true,
    json: true
});

export function Logger(service) {
    const logger = winston.createLogger({
        format: formatter,
        defaultMeta: { service },
        transports: [consoleTransport],
        level: process.env.LOG_LEVEL
    });

    logger.stream = {
        write: function(message, encoding) {
            message
            logger.info(message.replace('\n', ''));
        }
    }

    return logger;
}
