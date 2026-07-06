import "./load_environment_variables.js";
import express from "express";
import products from "./routes/productsRoute.js";
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the E-commerce Backend!");
});

app.use("/api/products", products);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
