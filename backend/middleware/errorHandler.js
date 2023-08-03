const logger = require("../util/logger");

/**
 * Middleware for handling errors
 * @param {*} error Error object
 * @param {*} request Request object
 * @param {*} response Response object
 * @param {*} next Next function
 * @returns {*} Response object or null
 */
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).json({ error: "malformatted id" });
  }
  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: error.message });
  }
  if (error.name === "TokenExpiredError") {
    return response.status(401).json({ error: "token expired" });
  }
  next(error);
  return null;
};

module.exports = errorHandler;
