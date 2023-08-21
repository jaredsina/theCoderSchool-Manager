const Task = require("../models/task");
const Program = require("../models/program");
const Partner = require("../models/partner");

// fetches all resources in the collection
const getAll = async (request, response) => {
  const tasks = await Task.find({});

  if (!tasks) {
    response.status(404).json({ error: "Tasks were not found" });
    const error = new Error("Tasks do not exist");
    error.status = 404;
    throw error;
  }

  response.status(200).json(tasks);
};

// fetches all resources in the collection associated with a parent
const getParentTasks = async (request, response) => {
  // get all tasks that have a relationship with the parent
  const { parentId } = request.params;

  // find all tasks that have a relationship with the parent
  const tasks = await Task.find({
    $or: [{ programId: parentId }, { partnerId: parentId }],
  });

  if (tasks) {
    response.status(200).json(tasks);
  }
  if (!tasks) {
    response.status(404).json({ error: "Tasks were not found" });
    const error = new Error("Tasks do not exist");
    error.status = 404;
    throw error;
  }
};

// fetches a single resource from the collection
const getOne = async (request, response) => {
  const { id } = request.params;
  const task = await Task.findById(id);
  if (task) {
    response.status(200).json(task);
  }
  if (!task) {
    response.status(404).json({ error: "Task was not found" });
    const error = new Error("Task does not exist");
    error.status = 404;
    throw error;
  }
};

// creates a new resource based on the request data
const postNew = async (request, response) => {
  const newTask = request.body;

  // convert the due date to a date object
  if (newTask.dueDate) {
    newTask.dueDate = new Date(newTask.dueDate);
  }

  const addedTask = await Task.create(newTask);
  // if a program is assigned to the task, add the task to the program's tasks array
  if (addedTask.programId) {
    const program = await Program.findById(addedTask.programId);
    program.tasks = program.tasks.concat(addedTask._id);
    await program.save();
  }
  // if a partner is assigned to the task, add the task to the partner's tasks array
  if (addedTask.partnerId) {
    const partner = await Partner.findById(addedTask.partnerId);
    partner.tasks = partner.tasks.concat(addedTask._id);
    await partner.save();
  }
  response.status(200).json(addedTask);
};

// replaces the entire identified resource with the request data
const replace = async (request, response) => {
  const newTask = request.body;
  const oldTask = await Task.findById(newTask.id);
  if (!oldTask) {
    response.status(404).json({ error: "Task was not found" });
    const error = new Error("Task does not exist");
    throw error;
  }
  if (oldTask) {
    const addedTask = await Task.findOneAndReplace(
      { _id: newTask.id },
      newTask,
      {
        new: true,
      },
    );
    response.status(200).json(addedTask);
  }
};

// deletes the identified resource
const deleteOne = async (request, response) => {
  const { id } = request.params;
  const deletedTask = await Task.findByIdAndDelete(id);

  // remove task from program
  if (deletedTask.programId) {
    const program = await Program.findById(deletedTask.programId);
    if (program) {
      program.tasks = program.tasks.filter(
        (task) => task.toString() !== deletedTask._id.toString(),
      );
      await program.save();
    }
  }
  // remove task from partner
  if (deletedTask.partnerId) {
    const partner = await Partner.findById(deletedTask.partnerId);
    if (partner) {
      partner.tasks = partner.tasks.filter(
        (task) => task.toString() !== deletedTask._id.toString(),
      );
      await partner.save();
    }
  }

  if (deletedTask) {
    response.status(200).json(deletedTask);
  }
  if (!deletedTask) {
    response.status(404).json({ error: "Task was not found" });
    const error = new Error("Task does not exist");
    error.status = 404;
    throw error;
  }
};

module.exports = {
  getAll,
  getParentTasks,
  getOne,
  postNew,
  replace,
  deleteOne,
};
