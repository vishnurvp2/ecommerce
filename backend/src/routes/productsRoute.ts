import express from "express";
const route = express.Router();
import { ObjectId } from "mongodb";
import db from "../database/ecommerce_db_connection.js";

const collection = db.collection("products");

route.get("/", async (req, res) => {
  const results = await collection.find({}).toArray();
  res.send(results).status(200);
});

route.get("/page", async (req, res) => {
  try {
    // 1. Extract query params and parse to numbers with safe defaults
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 50;

    // 2. Calculate skipping logic
    // Page 1 skips 0 items. Page 2 skips 50 items, etc.
    const skip = (page - 1) * limit;

    // 3. Fetch the specific slice from MongoDB
    const products = await db
      .collection("products")
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();

    // 4. Get the total count to determine if more pages exist
    const totalProducts = await db.collection("products").countDocuments({});
    const totalPages = Math.ceil(totalProducts / limit);
    const hasMore = page < totalPages;

    // 5. Respond with data and metadata
    res.json({
      products,
      metadata: {
        currentPage: page,
        limit,
        totalProducts,
        totalPages,
        hasMore,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

route.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }

    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(id) });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product).status(200);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

route.post("/", async (req, res) => {
  let newDocument = req.body;
  const results = await collection.insertOne(newDocument);
  res.send(results).status(204);
});

route.post("/bulk", async (req, res) => {
  try {
    // Expected payload: req.body = [{ name: "item1" }, { name: "item2" }]
    const dataToInsert = req.body;

    if (!Array.isArray(dataToInsert)) {
      return res.status(400).json({ error: "Payload must be an array" });
    }

    const result = await collection.insertMany(dataToInsert);

    res.status(201).json({
      message: "Successfully inserted",
      insertedCount: result.insertedCount,
      insertedIds: result.insertedIds,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

route.put("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const { _id, ...newProductData } = req.body;

    // Replace the entire document
    const result = await collection.replaceOne(
      { _id: new ObjectId(productId) },
      newProductData,
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product fully replaced", result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

route.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { _id, ...updateFields } = req.body; // Prevent overriding the ID

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }

    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }, // Only updates fields passed in the body
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res
      .json({ message: "Product fields updated successfully", result })
      .status(204);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

route.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate the string ID format
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }

    // 2. Delete the document matching the casted ObjectId
    const result = await db.collection("products").deleteOne({
      _id: new ObjectId(id),
    });

    // 3. Check if a document was actually deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // 4. Return success response
    res.json({ message: "Product successfully deleted", result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default route;
