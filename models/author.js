const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_joined: { type: Date },
});

// Virtual for Author's Full Name
AuthorSchema.virtual("name").get(function () {
  // Returns an empty Strings for Authors lacking First or Family Name
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }

  return fullname;
});

// Virtual for Author URL
AuthorSchema.virtual("url").get(function () {
  // Arrow Function is NOT used so Object can be accessed
  return `/catalog/author/${this._id}`;
});

// Virtual for Author Date Joined
AuthorSchema.virtual("date_joined_formatted").get(function () {
  return DateTime.fromJSDate(this.date_joined).toLocaleString(DateTime.DATE_MED);
})

// Export Model
module.exports = mongoose.model("Author", AuthorSchema);