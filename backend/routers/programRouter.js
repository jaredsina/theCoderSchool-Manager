const programRouter = require("express").Router();
const programController = require("../controllers/programController");

programRouter.get("/", programController.getAll);
programRouter.post("/", programController.postNew);
programRouter.put("/:id", programController.replace);
module.exports = programRouter;
