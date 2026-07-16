import { beforeEach, describe, expect, it, vi } from "vitest";

const mongo = vi.hoisted(() => {
  const db = { collection: vi.fn() };
  const client = {
    close: vi.fn(async () => undefined),
    connect: vi.fn(),
    db: vi.fn(() => db),
  };
  client.connect.mockImplementation(async () => {
    await Promise.resolve();
    return client;
  });
  const MongoClient = vi.fn(function MongoClientMock() { return client; });
  return { client, db, MongoClient };
});

vi.mock("mongodb", () => ({ MongoClient: mongo.MongoClient }));

describe("MongoDB connection", () => {
  beforeEach(() => {
    delete (globalThis as Record<string, unknown>).mongoClient;
    delete (globalThis as Record<string, unknown>).mongoDb;
    delete (globalThis as Record<string, unknown>).mongoConnection;
    mongo.MongoClient.mockClear();
    mongo.client.connect.mockClear();
    mongo.client.db.mockClear();
    process.env.MONGODB_URI = "mongodb://test.invalid/stayrwanda";
  });

  it("shares one initialization across concurrent callers", async () => {
    const { getDb } = await import("@/lib/mongodb");
    const [first, second] = await Promise.all([getDb(), getDb()]);

    expect(first).toBe(mongo.db);
    expect(second).toBe(mongo.db);
    expect(mongo.client.connect).toHaveBeenCalledTimes(1);
    expect(mongo.client.db).toHaveBeenCalledTimes(1);
  });
});
