# Phase 08: Engine Migration — Core (`bas-engine-core`)

## Context Links
- `phase-07-engine-boundary-discovery.md` — this phase starts from `docs/engine-boundary-map.md`'s `core` interface (produced there, not re-derived here).
- `scout/scout-01-module-map.md` — Engine's resource management, DB connectivity (`mongodatabaseconnector.cpp`, 90KB), browser-control abstractions.
- `research/researcher-03-qt-rust-case-studies.md` — CXX-Qt for Rust-backend-to-Qt-GUI calls where a genuine Qt caller remains.

## Overview
- **Priority:** P1 — first Engine sub-crate; chosen first among the three because it has the fewest cross-cutting Qt signal/slot dependents (per Phase 7's classification) among core/scripting/plugin-registry.
- **Status:** pending. Depends on Phase 7's `core` interface extraction being complete and verified.
- Scope: port Engine's execution primitives, resource management, DB connectivity, and browser-control abstractions (everything Phase 7 classified as `core`, excluding `qt-ui-permanent`) to `bas-engine-core`.

## Key Insights
- This is the first phase where the C++ caller is NOT a thin throwaway shim — Engine's `qt-ui-permanent` layer (wizard/config dialogs, per scout) is a REAL, ongoing Qt GUI that must keep calling into this Rust core indefinitely. This is exactly researcher-03's CXX-Qt use case ("keep Qt GUI in C++, implement backend logic in Rust, call via CXX-Qt FFI").
- `mongodatabaseconnector.cpp` uses `winsock2.h` directly (researcher-01) — DB connectivity's networking must be re-verified against a Rust MongoDB driver's own connection/auth semantics, not assumed identical.
- This phase must NOT attempt to port `qt-ui-permanent` files — that boundary was decided in Phase 7 and is out of scope here by design (prevents scope creep back into "migrate all of Engine at once").
- **`bas-engine-core` is Engine's cross-platform blocker** (plan.md Overview): researcher-01 lists Engine's WinAPI files as `CrashHandler.h`, `openlinksfromfilesystem.cpp`, `webdriverchromewindowhide.cpp`, `databaseadmin.cpp`, `webinterfaceapi.cpp`, `processdeleter.cpp`, `memoryinfo.cpp` (as two separate lists — filenames, and WinAPI symbols used somewhere in Engine — without a per-file mapping). **Corrected per-file mapping, verified by reading each file (fidelity check during this plan's drafting):**
  - `OpenProcess`/`HANDLE`/`PROCESS_QUERY_LIMITED_INFORMATION` are NOT in `processdeleter.cpp`/`memoryinfo.cpp` — they're in `Engine/webdriverprocesscomunicatorfactory.cpp:15,55` (`#include <Windows.h>`; `HANDLE process = OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, FALSE, pid);`), a file not previously named anywhere in this plan.
  - `processdeleter.cpp` includes `<windows.h>` (line 2) but its actual body only calls `QProcess::kill()`/`QProcess::deleteLater()` (Qt, already portable) — the include is dead/unused. **Category (a) incidental, not a real blocker** — remove the include, no crate/trait needed.
  - `memoryinfo.cpp` calls `GlobalMemoryStatusEx` (not `OpenProcess`/`HANDLE`), and it's ALREADY guarded by `#ifdef Q_OS_WIN` with a non-Windows fallback (`return 4*1024*1024;` — a hardcoded placeholder, not a real cross-platform value). **Category (b)**: already compiles cross-platform today; the fix here is replacing the hardcoded fallback with a real `sysinfo`-crate-backed value, not unblocking a build failure.
  - Every one of these (corrected list: `CrashHandler.h`, `openlinksfromfilesystem.cpp`, `webdriverchromewindowhide.cpp`, `databaseadmin.cpp`, `webinterfaceapi.cpp`, `memoryinfo.cpp`, `webdriverprocesscomunicatorfactory.cpp`) maps to `core`, not `scripting`/`plugin-registry`. This is why `core` is prioritized first among the 3 Engine sub-crates for TWO independent reasons now (plan.md Migration Order Reasoning): fewest Qt dependents AND it carries all of Engine's cross-platform-blocking WinAPI/WinSock code.
- Per plan.md's cross-platform mandate: process-existence checks (`webdriverprocesscomunicatorfactory.cpp`'s `OpenProcess`/`HANDLE`) map to the cross-platform `sysinfo` crate, not a `windows-rs` re-wrap; `memoryinfo.cpp`'s `GlobalMemoryStatusEx` maps to `sysinfo`'s memory-info API too (replacing its hardcoded fallback with a real cross-platform value). Mongo connectivity's WinSock usage is replaced by a standard cross-platform Rust MongoDB driver (e.g. the `mongodb` crate, built on `tokio`, portable by construction) — this ALSO resolves the WinSock-vs-driver-semantics risk already flagged below, since the cross-platform driver doesn't touch WinSock at all. `CrashHandler.h`/`webdriverchromewindowhide.cpp` are the likelier candidates for genuine Windows-specific behavior (crash-dump APIs, window-hiding tricks) — triage during Implementation Steps, don't assume upfront.
- **Phase 2 already point-fixed `CrashHandler.cpp` (dbghelp.dll crash-dump) and `devicescalemanager.cpp` (Shcore.dll DPI-scaling)** via `bas-platform`'s `platform_trait` — confirmed genuine category-(c) OS-specific cases (Phase 1's investigation). This phase integrates those existing `bas-platform` calls into `bas-engine-core`'s proper module structure and depends on `bas-platform` directly rather than re-triaging or reinventing a `windows-rs`-first design for them.

## Requirements
- Functional: resource management, DB connectivity, browser-control abstraction logic moves to `bas-engine-core`, called from the remaining Qt GUI layer via CXX-Qt, and callable by `scripting`/`plugin-registry` (Phases 9-10) via plain `cxx`.
- Non-functional: characterization tests for `core`'s behaviors (resource copy/lookup — extending the ONE existing Engine test file's ~400 cases rather than replacing it; DB connectivity round-trips; browser-control abstraction calls) exist and pass before porting starts.
- The existing `Solution/Tests` suite (Engine resources, 400 cases) must still pass unchanged — this is the one place in the whole migration with pre-existing coverage; do not let it silently break.
- Process management and DB networking use cross-platform crates (`sysinfo`/`std::process`, a cross-platform Mongo driver) by default; a `#[cfg(target_os = "windows")]`-gated arm (in a `platform` submodule, same pattern as Phase 6) is used ONLY for call sites triaged as genuinely Windows-specific (e.g. crash-dump APIs) — never as a default shortcut.
- `bas-engine-core`'s non-Windows-specific code (the `resources`/`db`/`browser_control` modules minus any proven-necessary Windows-only arm) builds and unit-tests on macOS + Linux in CI — the cross-platform readiness checkpoint for this crate.

## Architecture
- **`bas-engine-core`** (`rust/bas-engine-core/`): modules `resources` (resource mgmt — the area the existing 400-case test suite covers), `db` (Mongo connectivity via a cross-platform `mongodb`/tokio-based driver, no WinSock), `browser_control` (abstractions ChromeWorker-facing code in Engine calls through), `process` (process existence/query via `sysinfo`, replacing `webdriverprocesscomunicatorfactory.cpp`'s `HANDLE`/`OpenProcess` call; memory info via `sysinfo`, replacing `memoryinfo.cpp`'s `GlobalMemoryStatusEx`+hardcoded-fallback). `processdeleter.cpp`'s dead `windows.h` include is simply removed, no Rust logic needed for it. Depends on `bas-platform` (Phase 2) for the `CrashHandler`/`devicescalemanager` OS-specific traits already built there, plus `webdriverchromewindowhide.cpp`'s triage result — no separate `platform` submodule needed unless a genuinely NEW OS-specific case is found during this phase that doesn't fit `bas-platform`'s existing trait set.
- CXX-Qt bridge for the `qt-ui-permanent` callers (wizard/config dialogs) — exposes Rust QObject-compatible types per researcher-03's CXX-Qt model, avoiding hand-written Qt-type marshalling.
- Plain `cxx` bridge (Phase 4's pattern) for calls FROM `scripting`/`plugin-registry` (still C++ at this point, Phases 9-10 not yet done) INTO `bas-engine-core`.
- Depends on `bas-contracts`.

## Related Code Files
- `/Users/nguyendk/Documents/projects/me/bas/Solution/Engine/` — modify: files classified `core` in `docs/engine-boundary-map.md` (exact list produced by Phase 7, not enumerable here). Known WinAPI-carrying candidates, verified per-file during this plan's drafting (confirm exact paths against current `Engine.pro` SOURCES at execution time too): `CrashHandler.h` (dbghelp.dll, fixed in Phase 2), `openlinksfromfilesystem.cpp`, `webdriverchromewindowhide.cpp`, `databaseadmin.cpp`, `webinterfaceapi.cpp`, `memoryinfo.cpp` (`GlobalMemoryStatusEx`, already `Q_OS_WIN`-guarded with a placeholder fallback), `webdriverprocesscomunicatorfactory.cpp` (`OpenProcess`/`HANDLE` — the file previously mis-attributed to `processdeleter.cpp`/`memoryinfo.cpp`), `mongodatabaseconnector.h`/`mongodatabaseconnector.cpp`. `processdeleter.cpp` is EXCLUDED from this list — its `windows.h` include is dead (body only calls portable `QProcess` methods); just delete the include, no crate/trait work needed.
- `/Users/nguyendk/Documents/projects/me/bas/Solution/Engine/Engine.pro` — modify: `QMAKE_EXTRA_TARGETS` + `LIBS` per Phase 4's pattern; add CXX-Qt's build-script requirements (per KDAB's CXX-Qt build docs — works with Cargo, integrate alongside the existing qmake+Cargo rule).
- `/Users/nguyendk/Documents/projects/me/bas/docs/engine-boundary-map.md` — read (Phase 7 output), update in place if the `core` boundary needs correction (per Phase 7's Risk Assessment).
- **Create:** `/Users/nguyendk/Documents/projects/me/bas/rust/bas-engine-core/{Cargo.toml,src/lib.rs,src/resources.rs,src/db.rs,src/browser_control.rs,src/bridge.rs,src/qt_bridge.rs}`.
- **Create:** `/Users/nguyendk/Documents/projects/me/bas/Solution/Tests/EngineCoreCharacterization/golden/` — DB connectivity + browser-control-abstraction golden fixtures (resource tests extend the EXISTING `Solution/Tests` suite instead of duplicating it).

## Implementation Steps
1. Confirm Phase 7's `core` interface still compiles/passes the existing 400-case test suite as the starting point (re-verify, don't assume it's still green after any intervening work).
2. Write DB-connectivity and browser-control-abstraction golden characterization tests (the two `core` sub-areas with NO existing coverage).
3. Build `bas-engine-core` skeleton, no-op link into `Engine.pro`, confirm CI green including the existing 400-case suite.
4. Set up the CXX-Qt bridge for the `qt-ui-permanent` callers first (riskiest integration point — validate it works on a trivial pass-through before porting real logic).
5. Port resource-management logic, running the EXISTING 400-case suite after each meaningful chunk (this suite is the closest thing this migration has to a pre-existing spec — treat it as authoritative).
6. Port DB connectivity logic onto a cross-platform Mongo driver (no WinSock), golden-test after; explicitly verify the new driver's auth/connection semantics against the current C++ WinSock-based implementation.
7. Port browser-control abstraction logic, golden-test after.
8. Triage the remaining WinAPI file candidates (Key Insights) NOT already fixed in Phase 2 (`openlinksfromfilesystem.cpp`, `webdriverchromewindowhide.cpp`, `databaseadmin.cpp`, `webinterfaceapi.cpp`, `memoryinfo.cpp`, `webdriverprocesscomunicatorfactory.cpp`, `mongodatabaseconnector`): each maps to `process`/`db` via a cross-platform crate, or is proven genuinely Windows-only and goes behind `bas-platform`'s `#[cfg(target_os = "windows")]` trait. Remove `processdeleter.cpp`'s dead `windows.h` include (category a, no crate/trait work). Document the reasoning per file.
9. Build `bas-engine-core`'s non-Windows-only code on macOS + Linux in CI; fix any cross-platform compile/test failure.
10. Remove dead ported C++ source; run full suite (existing 400 cases + new golden tests, Windows + macOS/Linux legs).

## Todo List
- [ ] Re-verify Phase 7's `core` interface still green
- [ ] Golden tests: DB connectivity + browser-control abstractions
- [ ] `bas-engine-core` skeleton + no-op link, CI green (incl. existing 400-case suite)
- [ ] CXX-Qt bridge trivial pass-through, verified
- [ ] Port resource management, re-run 400-case suite per chunk
- [ ] Port DB connectivity onto cross-platform Mongo driver, verify semantics vs old WinSock code
- [ ] Port browser-control abstractions
- [ ] Triage 7 WinAPI file candidates (corrected list incl. `webdriverprocesscomunicatorfactory.cpp`, excl. `processdeleter.cpp`): cross-platform crate vs justified `platform` Windows-only arm; delete `processdeleter.cpp`'s dead include
- [ ] `bas-engine-core` builds + unit-tests green on macOS + Linux CI (non-Windows-only code)
- [ ] Remove dead C++ source, full suite green (Windows + macOS/Linux legs)

## Success Criteria
- The EXISTING `Solution/Tests` 400-case suite passes unchanged against the Rust-ported resource-management code — this is the hard, non-negotiable regression gate (pre-existing coverage, must not regress).
- New DB-connectivity and browser-control golden tests pass.
- Qt GUI dialogs (wizard/config) function identically when calling into `bas-engine-core` via CXX-Qt — verified by manual/scripted GUI smoke test on the Phase-1 CI Windows environment.
- All 7 corrected WinAPI file candidates (`CrashHandler.h`, `openlinksfromfilesystem.cpp`, `webdriverchromewindowhide.cpp`, `databaseadmin.cpp`, `webinterfaceapi.cpp`, `memoryinfo.cpp`, `webdriverprocesscomunicatorfactory.cpp`) are triaged and documented; `bas-engine-core`'s non-Windows-only code (process existence via `sysinfo` in place of `webdriverprocesscomunicatorfactory.cpp`'s `OpenProcess`, memory info via `sysinfo` in place of `memoryinfo.cpp`'s `GlobalMemoryStatusEx`, DB connectivity via the cross-platform Mongo driver, resource/browser-control logic) builds and passes its unit-test suite on macOS and Linux in CI — the cross-platform readiness checkpoint for Engine's biggest WinAPI concentration (plan.md Overview).

## Risk Assessment
- **CXX-Qt's Qt-type marshaling for complex object hierarchies is untested at BAS's scale** — flagged as an open question in `research/researcher-03-qt-rust-case-studies.md` itself; mitigate by starting with the SIMPLEST wizard/config dialog first (trivial pass-through, step 4) before the most complex one, and be willing to keep a thin C++ adapter layer if CXX-Qt marshaling proves too costly for a specific complex dialog (documented exception, not silently forced).
- **Regressing the one existing test suite** — this is the single highest-visibility failure mode in the whole plan (it's the only pre-existing proof of correctness); mitigated by re-running it after every chunk (step 5), not once at the end.
- **MongoDB driver behavioral differences** (auth flow, connection pooling, timeout semantics) — mitigated by explicit golden tests for connection failure/retry scenarios, not just the happy path.

## Security Considerations
- DB connectivity carries credentials — ensure the Rust MongoDB driver's credential handling (env vars/config file reads) matches the current security posture (no credentials logged, no new plaintext-storage path introduced).
- CXX-Qt bridge surface between C++ GUI and Rust core is a new trust boundary internal to the process — not a security boundary in the traditional sense (same process, same privilege), but review for any newly-introduced `unsafe` misuse per Phase 4's established review discipline.

## Test Strategy & Quality Gate
Lane `high-risk`.
- **Spec:** Goal — port Engine's core layer to Rust, zero regression on the existing 400-case suite, new golden coverage for DB/browser-control. AC: Given the existing 400-case suite, When run against the Rust-ported resource logic, Then all 400 pass; Given DB-connectivity golden fixtures, When run against the ported code, Then behavior matches; Given a wizard/config dialog, When driven via CXX-Qt into Rust core, Then behavior is unchanged. I/O contract: resource-manager API surface, DB connection/query shapes, browser-control abstraction calls — all per current Engine public headers. Out-of-scope: `scripting`/`plugin-registry` layers (Phases 9-10), any `qt-ui-permanent` file content changes beyond the CXX-Qt call-site adaptation.
- **Pyramid:** ~70% unit, ~20% integration (CXX-Qt bridge + DB connectivity against a real test Mongo instance), ~10% e2e (existing 400-case suite + GUI smoke test).
- **E2E scenario:** existing `Solution/Tests` 400-case suite run end-to-end against the Rust-ported binary — the plan's most authoritative e2e gate so far (real pre-existing coverage, not newly invented).
- **Coverage target:** ≥90% line / ≥75% branch diff-coverage on `bas-engine-core` new code, via `cargo tarpaulin`. The existing 400-case suite's pass/fail is tracked separately as a hard gate, not folded into this percentage.
- **Evidence commands:** `Solution/Tests` suite run output (400/400), `cargo test -p bas-engine-core`, `cargo tarpaulin -p bas-engine-core --out Html`, CXX-Qt GUI smoke-test log, plus `cargo build -p bas-engine-core` / `cargo test -p bas-engine-core` on macOS + Linux CI runners for the non-Windows-only modules.

## ADR Rationale
**Decision:** Use CXX-Qt (not plain `cxx`, not a full Qt-widget rewrite in Rust) for the `qt-ui-permanent` ↔ `bas-engine-core` boundary.
**Why:** researcher-03 confirms CXX-Qt is production-ready specifically for this pattern ("expose Rust backend to Qt/QML... keep QObject/widget layer in C++") and is KDAB-maintained (same lineage as `cxx`, consistent tooling). Rewriting Engine's Qt wizard/dialog UI in Rust is explicitly rejected by every case study researcher-03 cites (Android, Firefox, curl) — GUI rewrites are the "broad cross-language refactor" pattern that consistently fails; this migration only ever moves BACKEND logic.
**Alternatives rejected:** full Qt-widget-to-Rust rewrite (rejected by all 3 case studies + user's constraint that "GUI stays C++ indefinitely" per researcher-03's guidance); plain `cxx` without CXX-Qt for the GUI boundary (would require hand-marshalling every Qt type crossing the boundary — CXX-Qt exists specifically to avoid that cost).

**Decision (cross-platform priority):** replace Engine's process-management (`webdriverprocesscomunicatorfactory.cpp`'s `OpenProcess`/`HANDLE`, `memoryinfo.cpp`'s `GlobalMemoryStatusEx`) and DB-networking (WinSock) WinAPI usage with cross-platform crates (`sysinfo`, a tokio-based Mongo driver) as part of THIS phase, rather than treating it as a follow-up cleanup after the language migration.
**Why:** plan.md's Overview states the migration's actual goal is cross-platform portability; Qt's own cross-platform nature means the GUI boundary (already handled via CXX-Qt above) was never the blocker. Engine's WinAPI/WinSock usage — concentrated almost entirely in `core` — IS the blocker for Engine's portability. Doing the replacement now (while the code is already being touched for the language port) avoids a second, separate migration pass over the same files later; deferring it would mean `bas-engine-core` compiles as Rust but still only RUNS on Windows, defeating the stated goal even though the language migration "succeeded."
**Alternatives rejected:** wrap `OpenProcess`/WinSock calls in `windows-rs` 1:1 and defer cross-platform work to a future phase (rejected — no later phase in this plan revisits `bas-engine-core` once done, so deferring means never doing it without a new plan); adopt `sysinfo`/Mongo-driver only where "convenient," keep `windows-rs` elsewhere in `core` without documented justification (rejected — inconsistent triage discipline, hard to audit later).

## Next Steps
- Phase 9 (`bas-engine-script`) depends on `bas-engine-core` existing — scripting execution calls into resource management and browser-control abstractions that now live in Rust.
- If the CXX-Qt marshaling risk (Risk Assessment) materializes for a specific dialog, document the thin-adapter exception here before Phase 9 starts, so it doesn't get rediscovered mid-way through scripting migration.
