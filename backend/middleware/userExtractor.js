const User = require("../models/user");

// middleware to extract user id from token
const userExtractor = async (request, response, next) => {
  request.user = await User.findById(request.decodedToken);
  next();
};

module.exports = userExtractor;
