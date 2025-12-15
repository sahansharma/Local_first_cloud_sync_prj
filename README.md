
# Local_first_cloud_sync_prj
<<<<<<< HEAD
This is a project that enable's local first design for users (10 to 10k)
<img width="1211" height="515" alt="image" src="https://github.com/user-attachments/assets/61a11f42-86c7-47f2-81a9-3cceca9606a0" />
<img width="1032" height="566" alt="image" src="https://github.com/user-attachments/assets/5a3f36bf-a1ad-466d-b62f-c24e1c1abf53" />
<img width="999" height="696" alt="image" src="https://github.com/user-attachments/assets/717610cd-2cc3-4189-84cf-2beead2ffa16" />
<img width="131" height="362" alt="image" src="https://github.com/user-attachments/assets/f1739281-fd48-4f85-86ed-9b17d71df871" />
=======

This repository contains a prototype demonstrating a local-first data architecture: the client keeps canonical data locally (RxDB) and syncs to the cloud via push/pull endpoints exposed by a small Express server.

# Local_first_cloud_sync_prj

This repository contains a prototype demonstrating a local-first data architecture: the client keeps canonical data locally (RxDB) and syncs to the cloud via push/pull endpoints exposed by a small Express server.

## Quick setup & run

Prerequisites:
- Node.js (v16+)
- npm
- (Optional) Docker & Docker Compose to run MongoDB locally

### Backend (server)

1. Create an optional `.env` for persistent storage (or skip to use in-memory fallback):

```bash
cd server
cat > .env <<'EOF'
MONGO_URI=mongodb://localhost:27017/local_first_sync_demo
PORT=4000
EOF
```

2. Install and run the server:

```bash
# Local_first_cloud_sync_prj

This repository contains a prototype demonstrating a local-first data architecture: the client keeps canonical data locally (RxDB) and syncs to the cloud via push/pull endpoints exposed by a small Express server.

## Quick setup & run

Prerequisites:
- Node.js (v16+)
- npm
- (Optional) Docker & Docker Compose to run MongoDB locally

### Backend (server)

1. Create an optional `.env` for persistent storage (or skip to use in-memory fallback):

```bash
cd server
cat > .env <<'EOF'
MONGO_URI=mongodb://localhost:27017/local_first_sync_demo
PORT=4000
EOF
```

2. Install and run the server:

```bash
# from repository root
cd server
npm install
# dev (auto-restart)
npx nodemon src/index.js
# or run directly
node src/index.js
```

Server will be available at `http://localhost:4000`. Health check: `GET /health`.

### Frontend (client)

The `client/src` folder contains React source that expects to run inside a standard React app (Vite/CRA). To quickly run it with Vite:

```bash
cd client
# scaffold a minimal Vite React app (runs in current folder)
npm init vite@latest . -- --template react
npm install
npm run dev
```

Then open the dev URL printed by Vite (usually `http://localhost:5173`). The frontend will use RxDB (IndexedDB) locally and the sync service will call the server at `http://localhost:4000` by default.

## Docker (optional)

You can run MongoDB locally using Docker Compose. A minimal `docker-compose.yml` is provided in the repo. To start Mongo:

```bash
docker-compose up -d
# Wait a few seconds, then set `MONGO_URI` in `server/.env` as:
# MONGO_URI=mongodb://localhost:27017/local_first_sync_demo
```

To stop and remove the container(s):

```bash
docker-compose down
```

If you'd like me to scaffold the Vite frontend inside `client` and start it for you, or add Docker Compose to start everything, say so and I'll proceed.
