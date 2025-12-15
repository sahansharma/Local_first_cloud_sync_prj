import { dbPromise } from "./db";
import { saleSchema } from "./schema";

export const getCollections = async () => {
	const db = await dbPromise;

	// Add sales collection if it doesn't exist yet
	if (!db.collections || !db.collections.sales) {
		await db.addCollections({
			sales: {
				schema: saleSchema
			}
		});
	}

	return db.collections;
};
