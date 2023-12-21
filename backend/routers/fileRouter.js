const fileRouter = require("express").Router();

const {
  getFiles,
  postFile,
  getFile,
  deleteFile,
  getParentFiles,
  getFilesWithUrls,
} = require("../controllers/fileController");

// get all files for a specific parent
fileRouter.get("/parent/:parentId", getParentFiles);

// get all files with urls
fileRouter.get("/urls", getFilesWithUrls);

// get all files
fileRouter.get("/", getFiles);

// post a new file
fileRouter.post("/", postFile);

// get a single file
fileRouter.get("/:id", getFile);

// delete a file
fileRouter.delete("/:id", deleteFile);

module.exports = fileRouter;
