const mongoose = require("mongoose");
const { Schema } = mongoose;

const NoteSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

// model the collection

const Note = mongoose.models.Note || mongoose.model("Note", NoteSchema);

module.exports = Note;
