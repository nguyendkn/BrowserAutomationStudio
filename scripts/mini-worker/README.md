# Mini Worker stub

`stub.cpp` là Worker.exe minimal chỉ để **unblock Record** khi CEF thật chưa có.

- Giao thức: `\.\pipe\basworkerpipes<PID>` (PipesProcessComunicator). Worker stub gửi `<Key>key</Key>` để Engine emit `ProcessStarted`, làm spinner "Starting Record ..." biến mất và tạo cửa sổ placeholder.
- Build: `cl /EHsc /O2 /MT /FeWorker/Worker.exe stub.cpp /link user32.lib gdi32.lib shell32.lib` (sau khi `vcvars64.bat`).
- Copy: `Worker/Worker.exe` + `Worker.1/Worker.exe` + `browser_versions.json` (id=1).
- Để có browser thật: tải CEF manual (Spotify CDN đang 404), build `ChromeWorker` full và thay thế Worker.exe.

Không commit `Worker/*.exe` — giữ `.gitignore`.
