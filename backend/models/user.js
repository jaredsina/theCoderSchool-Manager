const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// define schema for user
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, minlength: 3 },
  name: { type: String, required: true },
  passwordHash: { type: String, required: true },
});

// plugin for validating unique fields
userSchema.plugin(uniqueValidator);

// transform returned object
userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    const updatedObject = returnedObject;
    updatedObject.id = returnedObject._id.toString();
    delete updatedObject._id;
    delete updatedObject.__v;
    // passwordHash should not be revealed
    delete updatedObject.passwordHash;
    return updatedObject;
  },
});

// create model for user
const User = mongoose.model("User", userSchema);

// export model
module.exports = User;
