import { getCollections } from "../collections";

export const createSale = async ({ item, price, deviceId = "device-001" }) => {
	const { sales } = await getCollections();

	const doc = {
		_id: (typeof crypto !== "undefined" && crypto.randomUUID)
			? crypto.randomUUID()
			: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
		item,
		price,
		updatedAt: Date.now(),
		deviceId,
		syncedAt: null
	};

	return sales.insert(doc);
};

export const getAllSales = async () => {
	const { sales } = await getCollections();
	// RxDB query builders may not support `.sort` in all storage backends.
	// Fetch results first, then sort in JavaScript while keeping RxDocument instances.
	const docs = await sales.find().exec();
	return docs.sort((a, b) => {
		const aTs = (a && typeof a.toJSON === 'function') ? a.toJSON().updatedAt : (a.updatedAt || 0);
		const bTs = (b && typeof b.toJSON === 'function') ? b.toJSON().updatedAt : (b.updatedAt || 0);
		return bTs - aTs;
	});
};

export const getPendingSales = async () => {
	const { sales } = await getCollections();
	return sales.find({ selector: { syncedAt: { $eq: null } } }).exec();
};

export const markSalesAsSynced = async (ids, ts = Date.now()) => {
	const { sales } = await getCollections();
	for (const id of ids) {
		const doc = await sales.findOne(id).exec();
		if (doc) {
			await doc.incrementalPatch({ syncedAt: ts });
		}
	}
};

export const clearSales = async () => {
	const { sales } = await getCollections();
	const docs = await sales.find().exec();
	for (const d of docs) await d.remove();
};
