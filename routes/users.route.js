const { Router } = require("express");
const Note = require("../model/Note");
const connect = require("../lib/connectDB");
const User = require("../model/User");
const route = Router({ mergeParams: true });
const noteRoute = require("./notes.route");

route.use("/:noteId", noteRoute);

// - Create a user if it doesnt exists
// - Create a new note
// - Add the note to the user
// - Return the user with the new note
route.post("/", async (req, res) => {
  await connect();
  const { user } = req.params;

  // check user exists
  if (user) {
    let { _id: userId } = (await User.findOne({ name: user })) || {
      _id: null,
    };

    // create new user if it doesnt exists
    if (!userId) {
      const { _id: newUserId } = (await User.create({
        name: user,
      })) || { _id: null };
      userId = newUserId;
    }

    // Add the note to the user
    const { content } = req.body;
    if (content) {
      const { _id } = await Note.create({
        content,
        user: userId,
      });
      // Return the user with the new note
      return res.json({ id: _id, message: "Note successfully created" });
    } else {
      return res.json({ error: "Note not created, Content is missing." });
    }
  }
  res.json({ message: "Could not create note, User not found" });
});

// Search by name
route.get("/users/", async (req, res) => {
  await connect();
  const { userName } = req.params;
  console.log(userName);
  try {
    const content = await Note.find({ name: userName });
    if (!content) {
      return res.json({ message: "Note not found" });
    }
    res.json(content);
  } catch (error) {
    res.status(500).send({ message: "User not found" });
  }
});

module.exports = route;
