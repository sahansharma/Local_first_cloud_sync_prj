import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./db.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

const start = async () => {
	try {
		if (process.env.MONGO_URI) {
			await connectDB();
			console.log("Connected to MongoDB");
		} else {
			console.warn("MONGO_URI not set — server will run but persistence is disabled");
		}

		app.listen(PORT, () => console.log(`API on :${PORT}`));
	} catch (err) {
		console.error("Failed to start server:", err);
		process.exit(1);
	}
};

start();
