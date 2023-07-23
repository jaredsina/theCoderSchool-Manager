const logger = require("../util/logger");

// log any requests to the server
const requestLogger = (request, response, next) => {
  logger.info("Method: ", request.method);
  logger.info("Path: ", request.path);
  logger.info("Body: ", request.body);
  logger.info("------");
  next();
};

module.exports = requestLogger;
