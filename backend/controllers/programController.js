const Program = require("../models/program");
// fetches all resources in the collection
const getAll = async (request, response) => {
  const programs = await Program.find({});
  response.status(200).json(programs);
};

// fetches a single resource from the collection
const getOne = async (request, response) => {
  const { id } = request.params;
  const program = await Program.findById(id);
  if (program) {
    response.status(200).json(program);
  }
  if (!program) {
    response.status(404).json({ error: "Program was not found" });
    const error = new Error("Program does not exist");
    error.status = 404;
    throw error;
  }
};

// creates a new resource based on the request data
const postNew = async (request, response) => {
  const newProgram = request.body;
  const addedProgram = await Program.create(newProgram);
  response.status(200).json(addedProgram);
};

// replaces the entire identified resource with the request data
const replace = async (request, response) => {
  const newProgram = request.body;
  const oldProgram = await Program.findById(newProgram.id);
  if (oldProgram) {
    const addedProgram = await Program.findOneAndReplace(
      { _id: newProgram.id },
      newProgram,
      {
        new: true,
      },
    );
    response.status(200).json(addedProgram);
  }
  if (!oldProgram) {
    response.status(404).json({ error: "Program was not found" });
    const error = new Error("Program does not exist");
    throw error;
  }
};

// let's you update a resource with the request data
const update = async (request, response) => {
  const newProgram = request.body;
  const oldProgram = await Program.findById(newProgram.id);
  if (oldProgram) {
    const addedProgram = await Program.findOneAndUpdate(
      { _id: newProgram.id },
      newProgram,
      {
        new: true,
      },
    );
    response.status(200).json(addedProgram);
  }
  if (!oldProgram) {
    response.status(404).json({ error: "Program was not found" });
    const error = new Error("Program does not exist");
    error.status = 404;
    throw error;
  }
};

// deletes a resource
const deleteProgram = async (request, response) => {
  const { id } = request.params;
  const program = await Program.findById(id);
  if (program) {
    const deletedProgram = await Program.findByIdAndRemove(id);
    response.status(200).json(deletedProgram);
  }
  if (!program) {
    response.status(404).json({ error: "Program was not found" });
    const error = new Error("Program does not exist");
    error.status = 404;
    throw error;
  }
};

module.exports = { getAll, postNew, replace, update, deleteProgram, getOne };
