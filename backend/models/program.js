const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
  name: { type: String, required: true },
  students: { type: Number, required: true },
  weeks: { type: Number }, // number of weeks the program is on for
  description: { type: String },
  classes: { type: Number }, // number of classes the program has
  status: { type: Boolean, required: true, default: false },
  pricing: { type: Number, required: true },
  invoice: { type: Date },
  staff: {},
  files: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Partner",
  },
});

programSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    const updatedObject = returnedObject;
    updatedObject.id = returnedObject._id.toString();
    delete updatedObject._id;
    delete updatedObject.__v;
    return updatedObject;
  },
});

const Program = mongoose.model("Program", programSchema);

module.exports = Program;
