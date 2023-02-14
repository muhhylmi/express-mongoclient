const winston = require('winston');
const config = require('./../config/config');


const consoleFormat = winston.format.combine(
  winston.format.timestamp({format:'YYYY-MM-DD hh:mm:ss'}),
  winston.format.colorize(),
  winston.format.printf((info) => {
    if (info.data) {
      return `${info.timestamp} [${info.level}][${info.context}][${info.scope}] ${info.message}\n${info.data}`;
    }

    return `${info.timestamp} [${info.level}][${info.context}][${info.scope}] ${info.message}`;
  })
);

const transports = [
  new winston.transports.Console({
    format: consoleFormat,
    handleExceptions: true
  })
];

const logger = winston.createLogger({
  silent: true,
  level: config.get('/env') !== 'production' ? 'debug' : 'info',
  transports: transports,
  exitOnError: false
});

const enableLogging = () => {
  logger.silent = false;
};

const sanitizeInput = (value) => {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  return JSON.stringify(value);
};

const buildLogFields = (context, message, scope, data) => {
  return {
    message: sanitizeInput(message),
    fields: {
      context: sanitizeInput(context),
      scope: sanitizeInput(scope),
      data: sanitizeInput(data),
    }
  };
};

const error = (context, message, scope, data) => {
  const values = buildLogFields(context, message, scope, data);
  logger.error(values.message, values.fields);
};

const warn = (context, message, scope, data) => {
  const values = buildLogFields(context, message, scope, data);
  logger.warn(values.message, values.fields);
};

const info = (context, message, scope, data) => {
  const values = buildLogFields(context, message, scope, data);
  logger.info(values.message, values.fields);
};

const http = (context, message, scope, data) => {
  const values = buildLogFields(context, message, scope, data);
  logger.http(values.message, values.fields);
};

const verbose = (context, message, scope, data) => {
  const values = buildLogFields(context, message, scope, data);
  logger.verbose(values.message, values.fields);
};

const debug = (context, message, scope, data) => {
  const values = buildLogFields(context, message, scope, data);
  logger.debug(values.message, values.fields);
};

const log = (context, message, scope, data) => {
  const values = buildLogFields(context, message, scope, data);
  logger.debug(values.message, values.fields);
};

module.exports = {
  enableLogging,
  error,
  warn,
  info,
  http,
  verbose,
  debug,
  log
};
