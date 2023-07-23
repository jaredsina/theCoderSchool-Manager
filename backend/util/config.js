require("dotenv").config();

// setup different database for testing
const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

// hide port
const { PORT } = process.env;

module.exports = { MONGODB_URI, PORT };
