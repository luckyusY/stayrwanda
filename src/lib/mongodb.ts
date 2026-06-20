import { MongoClient, type Db } from "mongodb";

const globalForMongo = globalThis as unknown as { mongoClient?: MongoClient; mongoDb?: Db };

export async function getDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured");
  if (!globalForMongo.mongoClient) {
    globalForMongo.mongoClient = new MongoClient(uri);
    await globalForMongo.mongoClient.connect();
    globalForMongo.mongoDb = globalForMongo.mongoClient.db(process.env.MONGODB_DB || "stayrwanda");
  }
  return globalForMongo.mongoDb!;
}
