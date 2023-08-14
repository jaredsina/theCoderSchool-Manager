const Partner = require("../models/partner");
const Program = require("../models/program");
const File = require("../models/file");

const getPartners = async (request, response) => {
  const partners = await Partner.find({}).populate("programs", {
    partner: 0,
  });
  response.status(200).json(partners);
};
const getOne = async (request, response) => {
  const { id } = request.params;
  const partner = await Partner.findById(id).populate("programs", {
    partner: 0,
  });
  if (partner) {
    response.status(200).json(partner);
  }
  if (!partner) {
    response.status(404).json({ error: "Partner was not found" });
    const error = new Error("Partner does not exist");
    error.status = 404;
    throw error;
  }
};

const createPartner = async (request, response) => {
  const newPartner = request.body;
  const addedPartner = await Partner.create(newPartner);
  response.status(200).json(addedPartner);
};

const updatePartner = async (request, response) => {
  const newPartner = request.body;
  const oldPartner = await Partner.findById(newPartner.id);
  if (oldPartner) {
    const addedPartner = await Partner.findOneAndUpdate(
      { _id: newPartner.id },
      newPartner,
      {
        new: true,
      },
    );
    response.status(200).json(addedPartner);
  }
  if (!oldPartner) {
    response.status(404).json({ error: "Partner was not found" });
    const error = new Error("Partner does not exist");
    throw error;
  }
};

const deletePartner = async (request, response) => {
  const { id } = request.params;
  const deletedPartner = await Partner.findByIdAndDelete(id);
  // should return an error if partner was not found
  if (!deletedPartner) {
    response.status(404).json({ error: "Partner was not found" });
    const error = new Error("Partner does not exist");
    throw error;
  }

  // should return the deleted partner if successful
  if (deletedPartner) {
    // remove partner from all programs
    const programs = await Program.find({ partner: deletedPartner.id });
    programs.forEach(async (program) => {
      program.partner = null;
      await program.save();
    });

    // if partner has files, remove the files from the files collection
    if (deletedPartner.files.length > 0) {
      deletedPartner.files.forEach(async (file) => {
        await File.findByIdAndDelete(file);
      });
    }

    response.status(200).json(deletedPartner);
  }
};

const replacePartner = async (request, response) => {
  const newPartner = request.body;
  const oldPartner = await Partner.findById(newPartner.id);
  // should return an error with missing partner name
  if (!newPartner.name) {
    response.status(400).json({ error: "Partner name is required" });
    const error = new Error("Partner name is required");
    throw error;
  }
  if (oldPartner) {
    const addedPartner = await Partner.findOneAndReplace(
      { _id: newPartner.id },
      newPartner,
      {
        new: true,
      },
    ).populate("programs", {
      partner: 0,
    });

    response.status(200).json(addedPartner);
  }
  if (!oldPartner) {
    response.status(404).json({ error: "Partner was not found" });
    const error = new Error("Partner does not exist");
    throw error;
  }
};

module.exports = {
  getPartners,
  createPartner,
  updatePartner,
  deletePartner,
  replacePartner,
  getOne,
};
