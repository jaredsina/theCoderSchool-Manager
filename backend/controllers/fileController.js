const File = require("../models/file");
const Program = require("../models/program");
const Partner = require("../models/partner");
const { bucket } = require("../util/googlecloudstorage");

// get all files for a program or partner
const getFiles = async (request, response) => {
  // retrive the parent id from the params sent in the request
  const { parentId } = request.params;
  // find all files that have a relationship with the parent
  const files = await File.find({
    $or: [{ programId: parentId }, { partnerId: parentId }],
  });
  // for each file in files, generate a signed url and add it to the file object
  const filesInfo = await Promise.all(
    files.map(async (file) => {
      const url = await bucket.file(file.filename).getSignedUrl({
        action: "read",
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      });
      const fileObject = {
        filename: file.filename,
        contentType: file.contentType,
        size: file.size,
        id: file.id,
        date: file.date,
        programId: file.programId,
        partnerId: file.partnerId,
        url: url[0],
      };
      return fileObject;
    }),
  );
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
    // generate a signed url for the file
    const url = await bucket.file(file.filename).getSignedUrl({
      action: "read",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });
    return response.status(200).json(url[0]);
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
  // file must be attached to a program or partner
  if (!request.body.programId && !request.body.partnerId) {
    response.status(400).json({ error: "Program or Partner ID is missing" });
    const error = new Error("Program or Partner ID is missing");
    error.status = 400;
    throw error;
  }

  const newFile = {
    filename: request.file.originalname,
    contentType: request.file.mimetype,
    size: request.file.size,
    programId: request.body.programId,
    partnerId: request.body.partnerId,
  };

  // add file to database
  const addedFile = await File.create(newFile);

  // upload to google cloud storage
  await bucket.file(request.file.originalname).save(request.file.buffer, {
    contentType: request.file.mimetype,
  });

  // generate signed url for file
  const url = await bucket.file(addedFile.filename).getSignedUrl({
    action: "read",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  });

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
  // respond with file data and signed url
  // convert _id to id and remove _id before responding to properly set the id
  response.status(200).json({
    ...addedFile._doc,
    url: url[0],
    id: addedFile._id.toString(),
    _id: undefined,
  });
};

// TODO:What if something happens after uploading it to google and before adding it to the program/partner?
const deleteFile = async (request, response) => {
  const { id } = request.params;
  const deletedFile = await File.findByIdAndDelete(id);

  // delete file from google cloud storage
  await bucket.file(deletedFile.filename).delete();

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
