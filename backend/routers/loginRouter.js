const loginRouter = require("express").Router();
const loginController = require("../controllers/loginController");

loginRouter.post("/", loginController.validateLogin);

module.exports = loginRouter;
