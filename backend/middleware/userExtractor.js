const User = require("../models/user");

// middleware to extract user id from token
const userExtractor = async (request, response, next) => {
  request.user = await User.findById(request.decodedToken, {
    passwordHash: 0,
    _id: 0,
    __v: 0,
  });
  next();
};

module.exports = userExtractor;
