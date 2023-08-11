const fs = require("fs");
const File = require("../models/file");

// get all files
const getFiles = async (request, response) => {
  const files = await File.find({});
  const filesInfo = files.map((file) => ({
    filename: file.filename,
    id: file.id,
    contentType: file.contentType,
    size: file.size,
    date: file.date,
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
    response
      .status(200)
      .set("Content-Type", file.contentType)
      .send(file.content);
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
  // set buffer of file using the path to the file in the upload folder
  const buffer = fs.readFileSync(request.file.path);
  const newFile = {
    filename: request.file.originalname,
    contentType: request.file.mimetype,
    size: request.file.size,
    content: buffer,
    path: request.file.path,
  };
  const addedFile = await File.create(newFile);
  response.status(200).json(addedFile);
};

module.exports = { getFiles, postFile, getFile };
