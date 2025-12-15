import Sale from "../models/sale.js";
import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// In-memory fallback store when MongoDB is not available (useful for prototype/demo)
const inMemoryStore = new Map();

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

// PUSH local → cloud
router.post("/push", async (req, res) => {
  const docs = req.body.docs || [];

  if (isDbConnected()) {
    for (const doc of docs) {
      try {
        const existing = await Sale.findById(doc._id).exec();
        if (existing) {
          // Keep the doc with the latest updatedAt
          if (!existing.updatedAt || doc.updatedAt >= existing.updatedAt) {
            await Sale.findByIdAndUpdate(doc._id, doc, { upsert: true });
          }
        } else {
          await Sale.create(doc);
        }
      } catch (e) {
        console.warn("Failed to upsert doc", doc._id, e?.message || e);
      }
    }
  } else {
    for (const doc of docs) {
      inMemoryStore.set(doc._id, doc);
    }
  }

  res.json({ ok: true, received: docs.length });
});

// PULL cloud → local
router.get("/pull", async (req, res) => {
  const { since } = req.query;
  const sinceTs = Number(since || 0);

  if (isDbConnected()) {
    const docs = await Sale.find({ updatedAt: { $gt: sinceTs } });
    return res.json(docs);
  }

  // Return in-memory docs
  const docs = Array.from(inMemoryStore.values()).filter((d) => d.updatedAt > sinceTs);
  res.json(docs);
});

// Status endpoint: quick info about server-side data
router.get("/status", async (req, res) => {
  if (isDbConnected()) {
    try {
      const latest = await Sale.findOne().sort({ updatedAt: -1 }).exec();
      const count = await Sale.countDocuments();
      return res.json({ ok: true, count, latestUpdatedAt: latest ? latest.updatedAt : null });
    } catch (e) {
      return res.json({ ok: false, error: e.message });
    }
  }

  const vals = Array.from(inMemoryStore.values());
  const latest = vals.sort((a, b) => b.updatedAt - a.updatedAt)[0];
  return res.json({ ok: true, count: vals.length, latestUpdatedAt: latest ? latest.updatedAt : null });
});

export default router;
