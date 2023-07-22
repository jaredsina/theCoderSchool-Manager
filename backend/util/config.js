require("dotenv").config();

//Different Database URI for different environments to make viewing test data simpler
const MONGODB_URI =
  process.env === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

const PORT = process.env.PORT;

module.exports = { MONGODB_URI, PORT };
