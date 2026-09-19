# BAS Server — Full Platform (queue + scheduler + workers)

C++/Qt 5.15.2, qmake monorepo `server/` (reuse `third_party/basbuild`).

```
server/
  server.pro          SUBDIRS core api worker scheduler
  core/               bascore.lib — TaskStore/RunStore (SQLite), IpcChannel
  api/                basapi.exe  — REST + WS, dashboard static
  worker/             basworker.exe — pool (QProcess) + poll loop
  scheduler/          basscheduler.exe — cron poll
  dashboard/          index.html (served at / and /dashboard/)
```

## Build

```powershell
. .\scripts\env-basbuild.ps1
qmake server/server.pro -r CONFIG+=release -o server/build/Makefile
# or: nmake after vcvars64
```

Artifacts: `server/build/{core,api,worker,scheduler}/release/`

## Run

```powershell
# single API (dashboard at http://127.0.0.1:18080/ )
.\scripts\run-server.ps1 -Port 18080

# or manual
server/build/api/release/basapi.exe --port 18080 --db C:\tmp\bas-server.db
server/build/worker/release/basworker.exe --api http://127.0.0.1:18080 --pool 2
server/build/scheduler/release/basscheduler.exe --api http://127.0.0.1:18080 --interval 60000
```

## API

| Method | Path | Notes |
|--------|------|-------|
| GET | /health /api/health | liveness |
| GET/POST | /tasks /api/tasks | list/create `{url,script}` |
| GET/PUT/DELETE | /tasks/:id | get/update/delete |
| POST | /tasks/:id/run | create Run, async done (~800ms) |
| GET | /tasks/:id/runs | runs for task |
| GET | /runs /runs/:id /api/runs | all runs |
| GET | /workers /api/workers | pool placeholder |
| GET | / /dashboard/ | dashboard SPA |
| WS | ws://host:port+1 | EventHub task.* events |
| Auth | `Authorization: Bearer $BAS_SERVER_TOKEN` | bypass /health |

Persistence: `bas-server.db` (SQLite, next to exe) or `--db` flag.

## Verify

```powershell
curl http://127.0.0.1:18080/health
curl -X POST -H "Content-Type: application/json" -d "{\"url\":\"https://example.com\"}" http://127.0.0.1:18080/tasks
```
