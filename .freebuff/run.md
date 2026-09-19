# HirePulse — local run guide (preview workspace)

Two processes: Express API (`backend-Node`, port 3000) and Vite React frontend (`frontend`, port 5173).
Frontend calls the API at `VITE_API_URL_NODE=http://localhost:3000` (CORS allowlist includes `http://localhost:5173`).

## 1. Reproduce uncommitted artifacts (fresh worktree)

1. Copy `backend-Node/.env` from the main checkout `D:\projects\hirepulse freebuff node js version\HirePulse-main`
   (contains `MONGO_URI` (Atlas, password included), `JWT_SECRET`, `PORT=3000`, `NODE_ENV`, `FRONTEND_URL`).
   `GOOGLE_API_KEY` / `RAPIDAPI_KEY` are optional — AI routes fall back to offline mode without them.
   Fill them by editing the file directly; never paste secrets into chat.
2. Copy `frontend/.env` from the main checkout (`VITE_API_URL_NODE=http://localhost:3000`).
3. If `node_modules` is missing: `npm install` in `backend-Node/` and in `frontend/` (npm; both have lockfiles in the checkout).

## 2. Run the servers

Start backend FIRST (DB must connect before the frontend gets traffic):

- Backend (from `backend-Node/`): `npm start` → expect `MongoDB Connected: <host>` then `Server listening on port: 3000`.
  - ⚠️ This sandbox sets env `PORT=0`; always launch with an explicit `PORT=3000` (e.g. `PORT=3000 node index.js`).
  - Health check: `curl http://localhost:3000/api/users/get` → `backend working`.
- Frontend (from `frontend/`): `npm run dev` → expect `VITE ready` and `Local: http://localhost:5173/`.
  - `vite.config.js` sets `server.host: true` — binds both IPv4+IPv6 (default localhost bind is IPv6-only, which breaks `127.0.0.1` clients).
  - Health check: `curl http://127.0.0.1:5173` → HTTP 200.

Detached start (Windows, per preview recipe — stdout/stderr MUST go to different files):

```
powershell -NoProfile -Command "(Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev' -WorkingDirectory '<abs path>\frontend' -RedirectStandardOutput '<log>' -RedirectStandardError '<log>.err' -WindowStyle Hidden -PassThru).Id"
```

Backend equivalent: `FilePath 'node.exe'`, `ArgumentList 'index.js'`, `-WorkingDirectory '<abs path>\backend-Node'`.

⚠️ Known quirk: the `Start-Process` launcher can report a tool timeout even when it succeeds —
check `netstat -ano | findstr :5173` / the log file before retrying, or you'll double-spawn
(and Vite would silently move to 5174).

Stop: `taskkill //F //IM node.exe` (kills backend + vite together).
