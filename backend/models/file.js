const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  content: {
    type: Buffer,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  size: {
    type: Number,
  },
  contentType: {
    type: String,
  },
  encoding: {
    type: String,
  },
  path: {
    type: String,
  },
});

fileSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    const updatedObject = returnedObject;
    updatedObject.id = returnedObject._id.toString();
    delete updatedObject._id;
    delete updatedObject.__v;
    return updatedObject;
  },
});

const File = mongoose.model("File", fileSchema);

module.exports = File;
