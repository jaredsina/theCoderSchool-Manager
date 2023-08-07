const Program = require("../models/program");
const Partner = require("../models/partner");
// fetches all resources in the collection
const getAll = async (request, response) => {
  const programs = await Program.find({}).populate("partner", {
    programs: 0,
  });
  response.status(200).json(programs);
};

// fetches a single resource from the collection
const getOne = async (request, response) => {
  const { id } = request.params;
  const program = await Program.findById(id).populate("partner", {
    programs: 0,
  });
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

  // if a partner is assigned to the program, add the program to the partner's programs array
  if (addedProgram.partner) {
    const partner = await Partner.findById(addedProgram.partner);
    partner.programs = partner.programs.concat(addedProgram._id);
    await partner.save();
  }

  response.status(200).json(addedProgram);
};

// replaces the entire identified resource with the request data
const replace = async (request, response) => {
  const newProgram = request.body;
  const oldProgram = await Program.findById(newProgram.id);
  if (!oldProgram) {
    response.status(404).json({ error: "Program was not found" });
    const error = new Error("Program does not exist");
    throw error;
  }
  if (oldProgram) {
    const addedProgram = await Program.findOneAndReplace(
      { _id: newProgram.id },
      newProgram,
      {
        new: true,
      },
    );
    // if the programs partner was updated to a different partner, remove the program from the old partner's programs array
    // and add it to the new partner's programs array
    let oldPartnerName;
    if (!oldProgram.partner) {
      oldPartnerName = "";
    } else {
      oldPartnerName = oldProgram.partner.toString();
    }
    if (oldPartnerName !== newProgram.partner) {
      // check if old partner exists
      if (oldProgram.partner) {
        const oldPartner = await Partner.findById(oldProgram.partner);
        oldPartner.programs = oldPartner.programs.filter(
          (program) => program.toString() !== oldProgram.id,
        );
        await oldPartner.save();
      }
      // check if new partner exists
      if (newProgram.partner) {
        const newPartner = await Partner.findById(newProgram.partner);
        newPartner.programs = newPartner.programs.concat(newProgram.id);
        await newPartner.save();
      }
    }
    response.status(200).json(addedProgram);
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
