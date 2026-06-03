/**
 * Kabadiwala — Vercel Serverless Function (CommonJS)
 * POST /api/pickup — Stores pickup form submissions in MongoDB
 */

const { MongoClient, ServerApiVersion } = require("mongodb");

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME     = process.env.MONGODB_DB || "kabadiwala";

let cachedClient = null;

async function connectMongo() {
  if (cachedClient) return cachedClient;
  if (!MONGODB_URI) throw new Error("MONGODB_URI is not set.");

  const client = new MongoClient(MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });

  await client.connect();
  cachedClient = client;
  return client;
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    // Validation
    const errors = [];
    if (!body?.name?.trim())               errors.push("name is required");
    if (!body?.address?.trim())            errors.push("address is required");
    if (!Array.isArray(body?.wasteTypes) || body.wasteTypes.length === 0)
                                           errors.push("at least one wasteType is required");
    if (!body?.date)                       errors.push("date is required");
    if (!body?.time)                       errors.push("time is required");

    if (errors.length > 0) {
      return res.status(400).json({ success: false, error: "Validation failed", details: errors });
    }

    const document = {
      name:          body.name.trim(),
      address:       body.address.trim(),
      wasteTypes:    body.wasteTypes,
      date:          body.date,
      time:          body.time,
      notes:         body.notes?.trim() || "",
      status:        "Scheduled",
      pointsAwarded: 50,
      createdAt:     new Date(),
      userEmail:     body.userEmail || null,
    };

    const client     = await connectMongo();
    const collection = client.db(DB_NAME).collection("pickups");
    const result     = await collection.insertOne(document);

    return res.status(201).json({
      success: true,
      id:      result.insertedId,
      message: "Pickup scheduled successfully",
    });

  } catch (err) {
    console.error("[/api/pickup] Error:", err.message);
    return res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error. Please try again.",
    });
  }
};
