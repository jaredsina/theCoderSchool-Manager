const express = require("express");
const mongoose = require("mongoose");

// no try/catch blocks for async/await
require("express-async-errors");

// cors allows requests from other origins
const cors = require("cors");

// setup modules for app
const config = require("./util/config");
const logger = require("./util/logger");

// setup middleware
const requestLogger = require("./middleware/requestLogger");
const userExtractor = require("./middleware/userExtractor");
const tokenExtractor = require("./middleware/tokenExtractor");
const tokenValidator = require("./middleware/tokenValidator");
const fileUpload = require("./middleware/fileUpload");

// setup routers
const programRouter = require("./routers/programRouter");
const userRouter = require("./routers/userRouter");
const loginRouter = require("./routers/loginRouter");
const partnerRouter = require("./routers/partnerRouter");
const fileRouter = require("./routers/fileRouter");
const taskRouter = require("./routers/taskRouter");

// setup error middleware
const errorHandler = require("./middleware/errorHandler");
const unknownEndpoint = require("./middleware/unknownEndpoint");

const app = express();

// setup connection to mongodb
logger.info("Trying to connect to database");
mongoose.connect(config.MONGODB_URI);

// setup cron job to send email reminders
const emailReminder = require("./util/emailReminder");

emailReminder.start();

// parse json data in request body and convert to js object
app.use(express.json());

// setup cors
app.use(cors());

// log requests made to the app
app.use(requestLogger);

// setup different endpoints for the app
app.use("/api/login", loginRouter);
app.use("/api/users", userRouter);
app.use(
  "/api/programs",
  tokenExtractor,
  tokenValidator,
  userExtractor,
  programRouter,
);
app.use(
  "/api/files",
  tokenExtractor,
  tokenValidator,
  userExtractor,
  fileUpload.single("file"),
  fileRouter,
);
app.use(
  "/api/tasks",
  tokenExtractor,
  tokenValidator,
  userExtractor,
  taskRouter,
);

app.use(
  "/api/partners",
  tokenExtractor,
  tokenValidator,
  userExtractor,
  partnerRouter,
);
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
