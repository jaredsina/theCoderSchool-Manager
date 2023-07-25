const User = require("../models/user");

const testData = [
  {
    username: "testuser1",
    name: "Test User 1",
    password: "testpassword1",
  },
  {
    username: "testuser2",
    name: "Test User 2",
    password: "testpassword2",
  },
];

const usersInDB = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = { testData, usersInDB };
