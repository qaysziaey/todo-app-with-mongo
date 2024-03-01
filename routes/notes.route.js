const { Router } = require("express");
const Note = require("../model/Note");
const connect = require("../lib/connectDB");
const route = Router({ mergeParams: true });

// Search by id
route.get("/", async (req, res) => {
  await connect();
  const { noteId } = req.params;

  try {
    const content = await Note.find({ _id: noteId });
    if (!content) {
      return res.json({ message: "Note not found" });
    }

    res.json(content);
  } catch (error) {
    res.status(500).send({ message: "User not found" });
  }
});
// Edit by id
route.put("/", async (req, res) => {
  await connect();
  const { noteId } = req.params;
  const { content } = req.body;
  const note = await Note.find({ _id: noteId });
  const updateNote = await Note.replaceOne({ content: content });

  if (!note) {
    return res.json({ message: "Note not found" });
  }
  res.json(updateNote);
  res.json({ message: "Note successfully updated" });
});

// Delete by id
route.delete("/", async (req, res) => {
  await connect();
  const { user, noteId: note_id } = req.params;

  const { _id: userId } = (await Note.findOne({ name: user })) || { _id: null };

  if (!userId) {
    return res.json({ message: "Could not find the user." });
  }

  const { _id: noteId, user: userOfNote } = (await Note.findOne({
    _id: note_id,
  }).populate("user", "name")) || { _id: null };

  if (!note_id || userOfNote !== user) {
    return res.json({ message: "Couldent find the note." });
  }

  const { acknowledged, deletedCount } = await Note.deleteOne({ _id: note_id });
  if (!acknowledged || !deletedCount) {
    return res.json({ message: "Note not found" });
  }
  res.json({
    acknowledged,
    deletedCount,
  });
});

module.exports = route;
