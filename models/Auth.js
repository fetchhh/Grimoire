// Require
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Schema
const authSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

authSchema.plugin(uniqueValidator);
// Exports
module.exports = mongoose.model("Auth", authSchema);
