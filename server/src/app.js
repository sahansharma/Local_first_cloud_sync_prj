import express from "express";
import cors from "cors";
import syncRouter from "./routes/sync.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => res.json({ ok: true }));

// Sync endpoints
app.use("/sync", syncRouter);

export default app;
