require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const connect = require("./lib/connectDB");
const Note = require("./model/Note");
const cors = require("cors");
const index = require("./routes/index");

app.use(cors());
app.use(express.json());
app.use("/", index);

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

const server = app.listen(port, () =>
  console.log(`Express app listening on port ${port}!`)
);

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
