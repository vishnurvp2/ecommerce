import "./preload.js";
import express from "express";
import { runGetStarted } from "./mongodb.js";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  // log the url of the server to the console
  console.log(`Server running at http://localhost:${port}/`);
});

runGetStarted().catch(console.dir);
