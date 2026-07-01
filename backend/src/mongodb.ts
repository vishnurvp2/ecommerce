import { MongoClient, ServerApiVersion } from "mongodb";
// get environment variable MONGODB_URI
const uri = process.env.MONGODB_URI || "";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function runGetStarted() {
  try {
    const database = client.db("sample_mflix");
    const movies = database.collection("movies");

    // Queries for a movie that has a title value of 'Back to the Future'
    const query = { title: "Back to the Future" };
    const movie = await movies.findOne(query);
    console.log(movie);
  } finally {
    await client.close();
  }
}
