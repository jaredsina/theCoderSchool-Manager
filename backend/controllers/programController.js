const Program = require("../models/program");

// fetches all resources in the collection
const getAll = async (request, response) => {
  const programs = await Program.find({});
  response.status(200).json(programs);
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
      }
    );
    response.status(200).json(addedProgram);
  }
  if (!oldProgram) {
    response.status(404).json({ error: "Program was not found" });
    const error = new Error("Program does not exist");
    error.status = 401;
    throw error;
  }
};
module.exports = { getAll, postNew, replace };
