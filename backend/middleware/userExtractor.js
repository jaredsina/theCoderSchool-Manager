const User = require("../models/user");

// middleware to extract user id from token
const userExtractor = (request, response, next) => {
  request.user = User.findById(request.decodedToken);

  next();
};

module.exports = userExtractor;
