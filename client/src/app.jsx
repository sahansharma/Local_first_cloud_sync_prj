import React, { useEffect, useState } from "react";
import { createSale, getAllSales, getPendingSales, clearSales } from "./features/sales.service";
import { syncWithServer, getLastSync } from "./services/sync.services";

export default function App() {
	const [sales, setSales] = useState([]);
	const [pendingCount, setPendingCount] = useState(0);
	const [item, setItem] = useState("");
	const [price, setPrice] = useState("");
	const [status, setStatus] = useState("idle");
	const [lastSync, setLastSync] = useState(null);
	const [serverDocs, setServerDocs] = useState([]);

	const load = async () => {
		const docs = await getAllSales();
		setSales(docs.map((d) => d.toJSON()));
		const pending = await getPendingSales();
		setPendingCount(pending.length);
	};

	useEffect(() => {
		load();
	}, []);

	const onAdd = async () => {
		if (!item || !price) return;
		setStatus("adding");
		await createSale({ item, price: Number(price) });
		setItem("");
		setPrice("");
		await load();
		setStatus("idle");
	};

	const onSync = async () => {
		setStatus("syncing");
		const res = await syncWithServer();
		// refresh local view
		await load();
		setLastSync(new Date(getLastSync()).toLocaleString());
		setStatus(res.errors && res.errors.length ? "error" : "synced");
		// show server docs for visibility
		try {
			const r = await fetch("http://localhost:4000/sync/pull?since=0");
			const data = await r.json();
			setServerDocs(data);
		} catch (e) {
			console.warn("Failed to fetch server docs", e);
		}
	};

	const onClear = async () => {
		await clearSales();
		await load();
	};

	return (
		<div style={{ padding: 20, fontFamily: "Inter, system-ui, sans-serif", maxWidth: 900 }}>
			<h1 style={{ marginBottom: 6 }}>Local-First Sales — Prototype</h1>
			<div style={{ marginBottom: 12, color: "#333" }}>
				<strong>Status:</strong> <span style={{ marginLeft: 6 }}>{status}</span>
				<span style={{ marginLeft: 16 }}><strong>Pending:</strong> {pendingCount}</span>
				<span style={{ marginLeft: 16 }}><strong>Last sync:</strong> {lastSync || "never"}</span>
			</div>

			<div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
				<input placeholder="Item" value={item} onChange={(e) => setItem(e.target.value)} />
				<input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: 100 }} />
				<button onClick={onAdd}>Add (local)</button>
				<button onClick={onSync}>Sync Now</button>
				<button onClick={onClear}>Clear Local</button>
			</div>

			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
				<section>
					<h3>Local Sales</h3>
					<table style={{ width: "100%", borderCollapse: "collapse" }}>
						<thead>
							<tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
								<th>Item</th>
								<th>Price</th>
								<th>Updated</th>
								<th>Synced</th>
							</tr>
						</thead>
						<tbody>
							{sales.map((s) => (
								<tr key={s._id} style={{ borderBottom: "1px solid #fafafa" }}>
									<td>{s.item}</td>
									<td>${s.price}</td>
									<td>{new Date(s.updatedAt).toLocaleString()}</td>
									<td>{s.syncedAt ? new Date(s.syncedAt).toLocaleString() : "—"}</td>
								</tr>
							))}
						</tbody>
					</table>
				</section>

				<section>
					<h3>Server Documents (visible after sync)</h3>
					<ul>
						{serverDocs.map((d) => (
							<li key={d._id}>{d.item} — ${d.price} • updated: {new Date(d.updatedAt).toLocaleString()}</li>
						))}
					</ul>
				</section>
			</div>
		</div>
	);
}
