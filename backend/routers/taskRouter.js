const taskRouter = require("express").Router();
const {
  getAll,
  getOne,
  postNew,
  getParentTasks,
  replace,
  deleteOne,
} = require("../controllers/taskController");

// get all tasks
taskRouter.get("/", getAll);

// get all tasks for a specific parent
taskRouter.get("/parentTasks/:parentId", getParentTasks);

// get a single task
taskRouter.get("/:id", getOne);

// post a new task
taskRouter.post("/", postNew);

// replace a task
taskRouter.put("/", replace);

// delete a task
taskRouter.delete("/:id", deleteOne);

module.exports = taskRouter;
