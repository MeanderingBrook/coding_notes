const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ComponentSchema = new Schema({
  name: { type: String, required: true, minLength: 2, maxLength: 10 },
  description: { type: String, required: true, minLength: 10 },
});

// Virtual for Language URL
ComponentSchema.virtual("url").get(function () {
  // Arrow Function is NOT used so Object can be accessed
  return `/catalog/component/${this._id}`;
});

module.exports = mongoose.model("Component", ComponentSchema);