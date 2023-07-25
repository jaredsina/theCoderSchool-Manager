const express = require("express");
const mongoose = require("mongoose");

// no try/catch blocks for aync/await
require("express-async-errors");

// setup modules for app
const config = require("./util/config");
const logger = require("./util/logger");
const requestLogger = require("./middleware/requestLogger");

// setup routers
const programRouter = require("./routers/programRouter");
const userRouter = require("./routers/userRouter");
const loginRouter = require("./routers/loginRouter");

// setup error middleware
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

// setup routes
app.use("/api/login", loginRouter);
app.use("/api/users", userRouter);
app.use("/api/programs", programRouter);

// setup middleware for handling unknown endpoints and errors
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
