
import axios from "axios";
import { getCollections } from "../collections";
import { markSalesAsSynced } from "../features/sales.service";

let lastSync = 0;

export const getLastSync = () => lastSync;

export const syncWithServer = async (opts = {}) => {
	const baseUrl = opts.baseUrl || "http://localhost:4000";
	const { sales } = await getCollections();
	const result = { pushed: 0, pulled: 0, errors: [] };

	// PUSH local -> cloud (only docs that are not yet synced)
	const localDocs = await sales.find().exec();
	const pending = localDocs.filter((d) => !d.syncedAt).map((d) => d.toJSON());

	if (pending.length > 0) {
		try {
			await axios.post(`${baseUrl}/sync/push`, { docs: pending });
			// mark pushed docs as synced
			await markSalesAsSynced(pending.map((d) => d._id), Date.now());
			result.pushed = pending.length;
		} catch (err) {
			result.errors.push({ phase: "push", message: err?.message || err });
		}
	}

	// PULL cloud -> local
	try {
		const res = await axios.get(`${baseUrl}/sync/pull?since=${lastSync}`);
		for (const doc of res.data) {
			await sales.upsert(doc);
			result.pulled += 1;
		}
		lastSync = Date.now();
	} catch (err) {
		result.errors.push({ phase: "pull", message: err?.message || err });
	}

	return result;
};

export const setLastSync = (ts) => (lastSync = ts);
