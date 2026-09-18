# BAS Server (monorepo `server/`)

Full platform: queue + scheduler + workers. C++/Qt 5.15.2, qmake.
- core/ static lib (taskstore, ipcchannel)
- api/ basapi.exe REST /health /tasks /workers + WS :18081
- worker/ basworker.exe stub
- scheduler/ basscheduler.exe stub

Build: . scripts/env-basbuild.ps1; qmake server/server.pro -r CONFIG+=release && nmake
Run: server/api/release/basapi.exe --port 18080
