const express = require("express");
const mongoose = require("mongoose");

// no try/catch blocks for aync/await
require("express-async-errors");

// setup port and mongodb uri for the app
const config = require("./util/config");
const logger = require("./util/logger");
const requestLogger = require("./middleware/requestLogger");
const programRouter = require("./routers/programRouter");
const errorHandler = require("./middleware/errorHandler");
const unknownEndpoint = require("./middleware/unknownEndpoint");

const app = express();

// setup connection to mongodb
logger.info("Trying to connect to database");
mongoose.connect(config.MONGODB_URI);

// parse json data in request body and convert to js object
app.use(express.json());

// log requests made to the app
app.use(requestLogger);

app.use("/api/programs", programRouter);

app.use(unknownEndpoint);

app.use(errorHandler);

// dont listen for requests until routes and middleware are set
const server = app.listen(config.PORT, () => {
  logger.info(`Server running on ${config.PORT}`);
});

if (process.env.NODE_ENV === "test") {
  // export server and app for testing
  module.exports = { app, server };
}
