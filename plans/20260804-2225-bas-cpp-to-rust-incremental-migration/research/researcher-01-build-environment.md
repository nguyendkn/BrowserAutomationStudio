# BAS Build Environment Requirements

## 1. Qt Version & Toolchain (basbuild repo)

**Status**: GitLab repo (https://gitlab.com/bablosoft/basbuild) returns HTTP 403 — private/authenticated. Cannot fetch README. [unverified]

**Inference from local .pro files**: Solution/*.pro files reference qmake syntax consistent with Qt 5.x–6.x (modern qmake, CONFIG += variables, standard Qt targets).

---

## 2. Windows-Only API Usage

**Engine module** (`Solution/Engine/`):
- `windows.h` in 8+ files: CrashHandler.h, openlinksfromfilesystem.cpp, webdriverchromewindowhide.cpp, databaseadmin.cpp, webinterfaceapi.cpp, processdeleter.cpp, memoryinfo.cpp
- WinAPI calls: `OpenProcess()`, `HANDLE`, `GetCurrentProcess()`, `INVALID_HANDLE_VALUE`
- WinSock: `winsock2.h` in mongodatabaseconnector.h (network IO)
- Process management: Windows-specific CreateProcess implementations in multiple comunicator factories

**ChromeWorker module** (`Solution/ChromeWorker/`):
- `windows.h` in 20+ files (fingerprintdetector, browsercontextmenu, fileexists, clipboard, main, etc.)
- Explicit `#if defined(_WIN32) || defined(WIN32) || defined(OS_WIN)` guards in sharedmemoryipc.cpp
- WinAPI: `OpenProcess()` in processcheck.h, Win32 tooltip definitions (_WIN32_IE)
- Verdict: **pervasive Windows dependency** — not isolated to one module

---

## 3. Recommendation: Build & Runtime on macOS

**Current Status**: Cannot build/run natively on macOS.

**Blocking Issues**:
- Qt not installed locally (user confirmed: `qmake` not found, no Qt via brew)
- `windows.h` & WinAPI calls are **unconditional** in ChromeWorker (no cross-platform guards in most includes)
- No evidence of CMake or autotools alternatives — qmake is sole build system

**Recommended Setup Path**:
1. **Windows VM / GitHub Actions** (fastest, lowest friction):
   - Install Qt on Windows (version TBD — fetch basbuild via GitHub API or ask maintainer)
   - Run `qmake && nmake` (MSVC) or MinGW equivalent
   - Rationale: Matches upstream (Windows target), avoids cross-compile complexity

2. **Cross-compile (mingw-w64 on macOS)** (not recommended):
   - Would require: Qt cross-compiled for mingw-w64, Wine for runtime testing
   - Impedance: Engine & ChromeWorker use direct WinAPI (`OpenProcess`, process handles) — not easily shimmed by mingw headers alone
   - Effort: High; risk: high (untested path)

3. **Rust port** (if migration is goal):
   - Rust has better cross-platform abstractions (std::process, parking_lot for sync primitives)
   - Can incrementally port modules (start with isolated utilities), test on macOS after each port
   - Build on existing Cargo infrastructure (user has rustc/cargo present)

---

## Open Questions

- **Qt version**: Exact version in basbuild (e.g. 5.15, 6.2) — requires authenticated access to repo or maintainer contact
- **Windows target**: Build for Windows 7, 10, 11? (affects API requirements, redistributables)
- **Cross-platform intent**: Are Qt conditional guards (#ifdef Q_OS_WIN) used elsewhere in non-greppable areas?

## Trade-offs

| Path | Effort | Risk | Portability |
|------|--------|------|-------------|
| Windows VM / GH Actions | Low | Low | Windows only (native) |
| MinGW cross-compile | High | High | Untested, complex toolchain |
| Rust port (incremental) | Medium–High | Medium | Cross-platform (eventual) |

---

**Citation**: Grep patterns across Solution/Engine and Solution/ChromeWorker source trees, 2026-08-04. (GitLab basbuild repo unreachable; no secondary sources consulted for Qt version.)
