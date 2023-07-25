const userRouter = require("express").Router();
const { getUser, postUser } = require("../controllers/userController");

// get a single user
userRouter.get("/:id", getUser);

// post a new user
userRouter.post("/", postUser);

module.exports = userRouter;
