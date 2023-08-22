const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
  },
  emailAlert: {
    type: Boolean,
  },
  emailSent: {
    type: Boolean,
    default: false,
  },
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Program",
  },
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Partner",
  },
});

taskSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    const updatedObject = returnedObject;
    updatedObject.id = returnedObject._id.toString();
    delete updatedObject._id;
    delete updatedObject.__v;
    return updatedObject;
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
