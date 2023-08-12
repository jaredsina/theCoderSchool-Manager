const Program = require("../models/program");
const Partner = require("../models/partner");
const File = require("../models/file");

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
  let addedProgram = await Program.create(newProgram);
  // if a partner is assigned to the program, add the program to the partner's programs array
  if (addedProgram.partner) {
    const partner = await Partner.findById(addedProgram.partner);
    partner.programs = partner.programs.concat(addedProgram._id);
    await partner.save();
    // populate the partner field of the program
    addedProgram = await addedProgram.populate("partner", {
      programs: 0,
    });
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
    ).populate("partner", {
      programs: 0,
    });
    // if old program partner exists and new program partner exists and they are not the same
    if (
      oldProgram.partner &&
      newProgram.partner &&
      oldProgram.partner.toString() !== newProgram.partner
    ) {
      // check if old partner exists
      if (oldProgram.partner) {
        const oldPartner = await Partner.findById(oldProgram.partner);
        oldPartner.programs = oldPartner.programs.filter(
          (program) => program.toString() !== oldProgram.id,
        );
        await oldPartner.save();
      }
      // check if new partner exists and add the program to the new partner's programs array
      if (newProgram.partner) {
        const newPartner = await Partner.findById(newProgram.partner);
        newPartner.programs = newPartner.programs.concat(newProgram.id);
        await newPartner.save();
      }
    }
    // if old program partner exists and new program partner does not exist
    if (oldProgram.partner && !newProgram.partner) {
      // remove program from old partner's programs array
      const oldPartner = await Partner.findById(oldProgram.partner);
      oldPartner.programs = oldPartner.programs.filter(
        (program) => program.toString() !== oldProgram.id,
      );
      await oldPartner.save();
    }
    // if old program partner does not exist and new program partner exists
    if (!oldProgram.partner && newProgram.partner) {
      // add program to new partner's programs array
      const newPartner = await Partner.findById(newProgram.partner);
      newPartner.programs = newPartner.programs.concat(newProgram.id);
      await newPartner.save();
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
    // if program has a partner, remove the program from the partner's programs array
    if (deletedProgram.partner) {
      const partner = await Partner.findById(deletedProgram.partner);
      partner.programs = partner.programs.filter(
        (programInPartner) => programInPartner.toString() !== deletedProgram.id,
      );
      await partner.save();
    }
    // if program has files, remove the files from the files collection
    if (deletedProgram.files.length > 0) {
      deletedProgram.files.forEach(async (file) => {
        const deletedFile = await File.findByIdAndRemove(file);
      });
    }
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
