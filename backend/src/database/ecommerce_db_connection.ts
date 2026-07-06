import { MongoClient } from "mongodb";
const connectionString = process.env.MONGODB_ATLAS_URI || "";
const client = new MongoClient(connectionString);
let conn;
try {
  conn = await client.connect();
  await client.db("ecommerce").command({ ping: 1 });
  console.log("Connected to MongoDB");
} catch (e) {
  console.error("Failed to connect to MongoDB: ", e);
  process.exit(1);
}
let db = conn.db("ecommerce");
export default db;
