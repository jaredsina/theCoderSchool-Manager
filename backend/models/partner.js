const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  schoolname: { type: String },
  website: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  primarycontact: { type: String },
  primarycontactemail: { type: String },
  primarycontactphone: { type: String },
  files: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
  ],
  programs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
    },
  ],
});

partnerSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    const updatedObject = returnedObject;
    updatedObject.id = returnedObject._id.toString();
    delete updatedObject._id;
    delete updatedObject.__v;
    return updatedObject;
  },
});

const Partner = mongoose.model("Partner", partnerSchema);

module.exports = Partner;
