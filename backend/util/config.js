require("dotenv").config();

// setup different
const MONGODB_URI =
  process.env === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

const { PORT } = process.env;

module.exports = { MONGODB_URI, PORT };
