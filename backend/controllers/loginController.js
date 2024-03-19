const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

// checks if login is valid
const validateLogin = async (request, response) => {
  // get username and password from request body
  const { username, password } = request.body;

  // find user with the username
  const user = await User.findOne({ username });

  // check if password is correct
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  // if user does not exist or password is incorrect, return error
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }
  // if password is correct, create token
  const userForToken = {
    username: user.username,
    id: user._id,
  };
  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60, // expires in 1 hour
  });

  // return token and user info
  response
    .status(200)
    .send({ token, username: user.username, name: user.name });

  return null;
};

module.exports = { validateLogin };
