import { MongoClient, type Db } from "mongodb";

const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient;
  mongoDb?: Db;
  mongoConnection?: Promise<Db>;
};

export async function getDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri || (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://"))) {
    throw new Error("MONGODB_URI is not configured or invalid");
  }
  if (globalForMongo.mongoDb) return globalForMongo.mongoDb;

  if (!globalForMongo.mongoConnection) {
    const client = new MongoClient(uri);
    globalForMongo.mongoClient = client;
    globalForMongo.mongoConnection = client.connect()
      .then((connectedClient) => {
        const db = connectedClient.db(process.env.MONGODB_DB || "stayrwanda");
        globalForMongo.mongoDb = db;
        return db;
      })
      .catch(async (error) => {
        globalForMongo.mongoClient = undefined;
        globalForMongo.mongoDb = undefined;
        globalForMongo.mongoConnection = undefined;
        await client.close().catch(() => undefined);
        throw error;
      });
  }

  return globalForMongo.mongoConnection;
}

export async function getMongoClient() {
  await getDb();
  return globalForMongo.mongoClient!;
}
