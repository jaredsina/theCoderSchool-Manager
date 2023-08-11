const fileRouter = require("express").Router();

const {
  getFiles,
  postFile,
  getFile,
} = require("../controllers/fileController");

// get all files
fileRouter.get("/", getFiles);

// post a new file
fileRouter.post("/", postFile);

// get a single file
fileRouter.get("/:id", getFile);

module.exports = fileRouter;
