export const saleSchema = {
  title: "sale",
  version: 0,
  primaryKey: "_id",
  type: "object",
  properties: {
    _id: { type: "string" },
    item: { type: "string" },
    price: { type: "number" },
    updatedAt: { type: "number" },
    deviceId: { type: "string" },
    // optional: timestamp when this doc was successfully synced to the cloud
    syncedAt: { type: ["null", "number"] }
  },
  required: ["_id", "item", "price", "updatedAt"]
};

