const winston = require('winston');

// instantiate a new Winston Logger with the settings defined above
const logger = new winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
  ),
  timestamp: true,
  defaultMeta: { service: 'web-app' },    
  transports: [
    new winston.transports.Console()
  ],
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by transports (console in our case)
    logger.info(message);
  },
};

module.exports = logger;