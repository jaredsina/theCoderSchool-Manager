// bcrypt is used to hash the password
const bcrypt = require("bcrypt");
const User = require("../models/user");

// creates a new user
const postUser = async (request, response) => {
  const { username, name, password } = request.body;

  // salt rounds are how many times the password is hashed
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const newUser = new User({
    username,
    name,
    passwordHash,
  });
  const savedUser = await newUser.save();
  response.status(200).json(savedUser);
};

// gets a single user
const getUser = async (request, response) => {
  const { id } = request.params;
  const user = await User.findById(id);
  if (user) {
    response.status(200).json(user);
  }
  if (!user) {
    response.status(404).json({ error: "User was not found" });
    const error = new Error("User does not exist");
    error.status = 404;
    throw error;
  }
};

module.exports = { postUser, getUser };
