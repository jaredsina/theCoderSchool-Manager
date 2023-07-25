const programRouter = require("express").Router();
const programController = require("../controllers/programController");

// get all programs
programRouter.get("/", programController.getAll);

// post a new program
programRouter.post("/", programController.postNew);

// replace a program
programRouter.put("/:id", programController.replace);

// update a program
programRouter.patch("/:id", programController.update);

// delete a program
programRouter.delete("/:id", programController.deleteProgram);
module.exports = programRouter;
