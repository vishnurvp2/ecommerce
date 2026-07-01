import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
let client: MongoClient;
let db: Db;

export const connectDB = async (): Promise<Db> => {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db("ecommerce"); // database name
    console.log("✅ Connected to MongoDB");
  }
  return db;
};

export const getDB = () => db;
export const getUsersCollection = () => getDB().collection("users");
