const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// Middle Ayer
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`My home kitchen server port ${port}`);
});
