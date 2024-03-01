require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const connect = require("./lib/connectDB");
const Note = require("./model/Note");
// const User = require("./model/User");
const cors = require("cors");
const index = require("./routes/index");

app.use(cors());
app.use(express.json());
app.use("/", index);

// moved to route spliting
// app.get("/", async (req, res) => {
//   await connect();
//   const notes = await Note.find().populate("user", "name");
//   if (!notes.length) {
//     return res.json({ message: "Notes not found" });
//   }

//   res.json(notes);
// });

app.get("/users", async (req, res) => {
  await connect();
  const notes = await Note.find().populate("user", "name");

  if (!notes.length) {
    return res.json({ message: "Notes not found" });
  }

  res.json(notes);
});

// Search by id
app.get("/:id", async (req, res) => {
  await connect();
  const { id } = req.params;

  try {
    const content = await Note.find({ _id: id });
    if (!content) {
      return res.json({ message: "Note not found" });
    }

    res.json(content);
  } catch (error) {
    res.status(500).send({ message: "User not found" });
  }
});

// Delete by id
app.delete("/:user/:note", async (req, res) => {
  await connect();
  const { user, note } = req.params;

  const { _id, userId } = (await Note.findOne({ name: user })) || { _id: null };

  if (!userId) {
    return res.json({ message: "Could not find the user." });
  }

  const { _id: noteId, user: userOfNote } = (await Note.findOne({
    _id: note,
  }).populate("user", "name")) || { _id: null };

  if (!noteId || userOfNote !== user) {
    return res.json({ message: "Couldent find the note." });
  }

  const { acknowledged, deletedCount } = await Note.deleteOne({ _id: note });
  if (!acknowledged || !deletedCount) {
    return res.json({ message: "Note not found" });
  }
  res.json({
    acknowledged,
    deletedCount,
  });
});

// Edit by id
app.put("/:noteId", async (req, res) => {
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

// Search note by a search query

app.get("/search/:q", async (req, res) => {
  try {
    await connect();
    const { q } = req.params;

    if (!q) {
      return res.json({ message: "Note not found" });
    }
    const note = await Note.find({ content: { $regex: q, $options: "i" } });
    res.json(note);
  } catch (error) {
    console.error("Error searching notes:", error);
    res.status(500).send("Internal Server Error");
  }
});

// - Create a user if it doesnt exists
// - Create a new note
// - Add the note to the user
// - Return the user with the new note
// app.post("/:user", async (req, res) => {
//   await connect();
//   const { user } = req.params;

//   // check user exists
//   if (user) {
//     let { _id: userId } = (await User.findOne({ name: user })) || {
//       _id: null,
//     };

//     // create new user if it doesnt exists
//     if (!userId) {
//       const { _id: newUserId } = (await User.create({
//         name: user,
//       })) || { _id: null };
//       userId = newUserId;
//     }

//     // Add the note to the user
//     const { content } = req.body;
//     if (content) {
//       const { _id } = await Note.create({
//         content,
//         user: userId,
//       });
//       // Return the user with the new note
//       return res.json({ id: _id, message: "Note successfully created" });
//     } else {
//       return res.json({ error: "Note not created, Content is missing." });
//     }
//   }
//   res.json({ message: "Could not create note, User not found" });
// });

const server = app.listen(port, () =>
  console.log(`Express app listening on port ${port}!`)
);

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
