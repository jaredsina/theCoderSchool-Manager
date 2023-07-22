const express = require("express");

//setup port and mongodb uri for the app
const config = require("./util/config");
const logger = require("./util/logger");
const app = express();

app.listen(config.PORT, () => {
  logger.info(`Server running on ${config.PORT}`);
});
