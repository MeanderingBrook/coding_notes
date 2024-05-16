const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
  summary: { type: String, required: true },
  text: { type: String, required: true },
  language: [{ type: Schema.Types.ObjectId, ref: "Language" }],
  component: [{ type: Schema.Types.ObjectId, ref: "Component" }],
  date_created: { type: Date },
});

// Virtual for Note URL
NoteSchema.virtual("url").get(function () {
  return `/catalog/note/${this._id}`;
});

// Virtual for Date Created
NoteSchema.virtual("date_created_formatted").get(function() {
  // return DateTime.fromJSDate(this.date_created).toLocaleString(DateTime.DATE_MED);
  return this.date_created ? DateTime.fromJSDate(this.date_created).toLocaleString(DateTime.DATE_MED) : '';
});

module.exports = mongoose.model("Note", NoteSchema);