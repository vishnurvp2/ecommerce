import "./preload.js";
import express from "express";

const app = express();
// get port from environment variable PORT or use 3000 as default
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  // log the url of the server to the console
  console.log(`Server running at http://localhost:${port}/`);
});
