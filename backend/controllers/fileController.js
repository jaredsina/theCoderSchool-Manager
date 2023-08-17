const File = require("../models/file");
const Program = require("../models/program");
const Partner = require("../models/partner");

// get all files for a program or partner
const getFiles = async (request, response) => {
  // retrive the parent id from the params sent in the request
  const { parentId } = request.params;
  // find all files that have a relationship with the parent
  const files = await File.find({
    $or: [{ programId: parentId }, { partnerId: parentId }],
  });
  const filesInfo = files.map((file) => ({
    filename: file.filename,
    id: file.id,
    contentType: file.contentType,
    size: file.size,
    date: file.date,
    programId: file.programId,
    partnerId: file.partnerId,
    path: file.path,
  }));
  if (files) {
    response.status(200).json(filesInfo);
  }
  if (!files) {
    response.status(404).json({ error: "Files were not found" });
    const error = new Error("Files do not exist");
    error.status = 404;
    throw error;
  }
};

// get one file
const getFile = async (request, response) => {
  const { id } = request.params;
  const file = await File.findById(id);
  if (file) {
    return response.status(200).json(file);
  }
  if (!file) {
    response.status(404).json({ error: "File was not found" });
    const error = new Error("File does not exist");
    error.status = 404;
    throw error;
  }
};

// post a new file
const postFile = async (request, response) => {
  const newFile = {
    filename: request.file.originalname,
    contentType: request.file.mimetype,
    size: request.file.size,
    path: request.file.path,
    programId: request.body.programId,
    partnerId: request.body.partnerId,
  };
  // file must be attached to a program or partner
  if (!newFile.programId && !newFile.partnerId) {
    response.status(400).json({ error: "Program or Partner ID is missing" });
    const error = new Error("Program or Partner ID is missing");
    error.status = 400;
    throw error;
  }
  // add file to database
  const addedFile = await File.create(newFile);
  // add file to program
  if (addedFile.programId) {
    const program = await Program.findById(addedFile.programId);
    if (program) {
      program.files = program.files.concat(addedFile._id.toString());
      await program.save();
    }
  }

  // add file to partner
  if (addedFile.partnerId) {
    const partner = await Partner.findById(addedFile.partnerId);
    if (partner) {
      partner.files = partner.files.concat(addedFile._id.toString());
      await partner.save();
    }
  }

  response.status(200).json(addedFile);
};

const deleteFile = async (request, response) => {
  const { id } = request.params;
  const deletedFile = await File.findByIdAndDelete(id);
  // remove file from program
  if (deletedFile.programId) {
    const program = await Program.findById(deletedFile.programId);
    if (program) {
      program.files = program.files.filter(
        (file) => file.toString() !== deletedFile._id.toString(),
      );
      await program.save();
    }
  }
  // remove file from partner
  if (deletedFile.partnerId) {
    const partner = await Partner.findById(deletedFile.partnerId);
    if (partner) {
      partner.files = partner.files.filter(
        (file) => file.toString() !== deletedFile._id.toString(),
      );
      await partner.save();
    }
  }

  if (deletedFile) {
    response.status(200).json(deletedFile);
  }
  if (!deletedFile) {
    response.status(404).json({ error: "File was not found" });
    const error = new Error("File does not exist");
    error.status = 404;
    throw error;
  }
};

module.exports = { getFiles, postFile, getFile, deleteFile };
