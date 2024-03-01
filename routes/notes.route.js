const { Router } = require("express");
const Note = require("../model/Note");
const connect = require("../lib/connectDB");
const route = Router({ mergeParams: true });

// Search by id
route.get("/:id", async (req, res) => {
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

module.exports = route;
