import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  _id: String,           // SAME id as RxDB
  item: String,
  price: Number,
  updatedAt: Number,
  deviceId: String
}, { timestamps: true });

export default mongoose.model("Sale", saleSchema);
