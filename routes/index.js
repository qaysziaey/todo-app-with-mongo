const { Router } = require("express");
const Note = require("../model/Note");
const connect = require("../lib/connectDB");
const userRoute = require("./users.route");

const route = Router();
route.use("/:user", userRoute);

route.get("/", async (req, res) => {
  await connect();
  const notes = await Note.find().populate("user", "name");
  console.log(notes);
  if (!notes.length) {
    return res.json({ message: "Notes not found" });
  }

  res.json(notes);
});

route.get("/users", async (req, res) => {
  await connect();
  const notes = await Note.find().populate("user", "name");

  if (!notes.length) {
    return res.json({ message: "Notes not found" });
  }

  res.json(notes);
});
module.exports = route;
