const Program = require("../models/program");

const getAll = async (request, response) => {
  const programs = await Program.find({});
  response.status(200).json(programs);
};

const postNew = async (request, response) => {
  const newProgram = request.body;
  const addedProgram = await Program.create(newProgram);
  response.status(200).json(addedProgram);
};
module.exports = { getAll, postNew };
