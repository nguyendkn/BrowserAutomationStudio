# Fidelity Lens - Round 1

## Commands Run
- `find plans/20260804-2225-bas-cpp-to-rust-incremental-migration -type f`
- `grep -n "Related Code Files\|Create:\|Modify:\|^- \`" phase-*.md`
- `ls -la Solution/Solution.pro Solution/Engine/Engine.pro Solution/ChromeWorker/ChromeWorker.pro Solution/WebInterfaceBrowser/WebInterfaceBrowser.pro Solution/SchedulerBrowser/SchedulerBrowser.pro Solution/Scheduler/Scheduler.pro Solution/Updater/Updater.pro Solution/RemoteExecuteScript/RemoteExecuteScript.pro Solution/Modules/ Solution/FastExecuteScript/ Solution/Studio/ Solution/ShopViewer/ Solution/Tests/ README.md Solution/Engine/scriptworker.cpp Solution/ChromeWorker/lodepng.cpp`
- `find . -iname "lodepng*"`
- `find Solution/Tests -type f`
- `wc -l Solution/Tests/unit/resources/tst_copyresourcestests.cpp`
- `cat Solution/Solution.pro`
- `ls rust`, `ls .github/workflows`, `ls docs`, `ls docs/decisions`, `find . -iname "Cargo.toml"`
- `ls docs/engine-boundary-map.md docs/system-architecture.md docs/build-baseline.md`
- `find . -iname "*.pro"` (full list)
- `find . -iname "Development.bat"`
- `ls -la Solution/Modules/ | grep ^d | wc -l` + `ls Solution/Modules/`
- `find Solution/Engine -name "*.cpp"|wc -l`, `find Solution/Engine -name "*.h"|wc -l`
- `find Solution/ChromeWorker -name "*.cpp"|wc -l`, `find Solution/ChromeWorker -name "*.h"|wc -l`
- `grep -rl "TEMPLATE = subdirs" --include="*.pro" .`
- `grep -n "docs/decisions\|ADR" plan.md phase-*.md`
- `ls Solution/Tests/<CharacterizationDir>` / `ls rust/<crate>` for each Create-target (collision spot-check)

## Checklist Results

**1. Existing "modify" targets actually exist at stated path** — FAIL (one target wrong)
- All top-level `.pro`/dir targets (Solution.pro, Engine.pro, ChromeWorker.pro, WebInterfaceBrowser.pro, SchedulerBrowser.pro, Scheduler/, Updater/, RemoteExecuteScript/, Modules/, FastExecuteScript/, Studio/, ShopViewer/, Tests/, README.md, scriptworker.cpp) verified present — PASS for those.
- `Solution/ChromeWorker/lodepng.cpp` (phase-05 line 34) does NOT exist — real path is `Solution/ChromeWorker/png/lodepng.cpp` (confirmed via `find` and `ChromeWorker.pro:110,284`). FAIL for this one target.

**2. "Create:" targets do not already collide** — PASS
- `rust/`, `.github/workflows/`, `docs/` (incl. `docs/decisions/`, `docs/build-baseline.md`, `docs/engine-boundary-map.md`, `docs/system-architecture.md`), all per-phase `rust/bas-*` crate dirs, and all `Solution/Tests/*Characterization/` dirs confirmed absent. No `Cargo.toml` anywhere in repo.

**3. Approach fits repo's actual build structure** — FAIL
- qmake confirmed as sole build system (only `TEMPLATE = subdirs` file is `Solution/Solution.pro`; 21 total `.pro` files found).
- No existing `rust/`/`Cargo.toml` conflict, no existing `.github/workflows` conflict — clean.
- BUT `Solution/Solution.pro`'s `SUBDIRS` only lists `Studio, Engine, FastExecuteScript, Updater, RemoteExecuteScript, ShopViewer` — it does NOT include `ChromeWorker`, `WebInterfaceBrowser`, `SchedulerBrowser`, `Scheduler`, `Modules`, or `Tests`. Phase 1's sole build step ("run qmake against Solution/Solution.pro, run nmake/jom") will not produce binaries for those 6 excluded targets, yet Phase 2 (WebInterfaceBrowser/SchedulerBrowser characterization), Phase 4 (Scheduler), Phase 5 (ChromeWorker) all depend on Phase 1's CI baseline build producing exactly those binaries.

**4. Scout/research claims spot-check** — mostly PASS, one non-load-bearing staleness
- Engine file count: scout claims 358 .cpp + 402 .h (~760 total) — `find` confirms exactly 358 .cpp / 402 .h. Accurate.
- Modules subdirectory count: scout claims "~40 plugin DLLs" — actual 43 subdirectories. Close enough (rounding), not load-bearing.
- ChromeWorker file count: scout claims 148 .cpp + 172 .h (~320) — actual 148 .cpp + 167 .h (315). Off by 5 in header count; MINOR, non-load-bearing.
- docs/decisions/ absence: repo has no `docs/` directory at all; plan's inline "## ADR Rationale" per-phase-file choice is consistent with this — no issue.
- Test coverage claim ("1 test file, Engine resources only"): `Tests.pro` SOURCES confirms only `tst_copyresourcestests.cpp` is wired into the automated Qt test build — accurate for automated/CI-registered tests. Note: `Solution/Tests/integration/{Browser,modules/{FTP,SMS,Excel,SQL}}/*.xml` also exist (7 files) but are BAS-script project fixtures not referenced by any `.pro`/build file — not automated tests, so scout's claim holds for its intended (CI-registered) meaning. Flagged below as low-severity "needs confirmation" since the plan doesn't acknowledge these exist as potential characterization-test source material.

## Findings

1. **BLOCKER** — `phase-05-chromeworker-migration.md:34`: `` `/Users/nguyendk/Documents/projects/me/bas/Solution/ChromeWorker/lodepng.cpp` — candidate for retirement ``. Repo evidence: `find . -iname "lodepng*"` → only `./Solution/ChromeWorker/png/lodepng.cpp` and `./Solution/ChromeWorker/png/lodepng.h` exist; `Solution/ChromeWorker/ChromeWorker.pro:110` lists `png/lodepng.cpp \` and `:284` lists `png/lodepng.h \`. The stated path is one directory level wrong (missing `png/`). Repeated as bare `lodepng.cpp` at lines 17, 29, 46, 49, 61, 66, 70, 90 of the same file — those don't state a full path so aren't independently wrong, but line 34's explicit path is the one enumerable "Related Code Files" entry and it's incorrect.
   - Variant check: grepped all phase files for other bare-filename "Related Code Files" entries with full paths (`scriptworker.cpp` in phase-08 — confirmed correct path via `ls`; no other single-file full-path entries found besides this one). No siblings found.

2. **BLOCKER** — `phase-01-environment-setup-build-verification.md:26,30,39`: plan's sole CI build step is "run `qmake` against `Solution/Solution.pro`, run `nmake`/`jom`" and lists `Solution.pro` as the "top-level qmake project ... (build target)". Repo evidence: `cat Solution/Solution.pro` → `TEMPLATE = subdirs` / `SUBDIRS += Studio Engine FastExecuteScript Updater RemoteExecuteScript ShopViewer` — this list excludes `ChromeWorker`, `WebInterfaceBrowser`, `SchedulerBrowser`, `Scheduler`, `Modules`, and `Tests` (all of which have their own standalone `.pro` files per `find . -iname "*.pro"`, but none is reachable transitively from `Solution.pro`'s SUBDIRS — confirmed via `grep -rl "TEMPLATE = subdirs" --include="*.pro" .` returning only `Solution.pro` itself). Building only `Solution.pro` will not produce `ChromeWorker.exe`, `WebInterfaceBrowser.exe`, `SchedulerBrowser` binary, or `Scheduler` binary. This is load-bearing: `phase-02-characterization-tests-browser-shell.md:5` states "this phase's tests run against the Phase 1 CI baseline build" for WebInterfaceBrowser/SchedulerBrowser, and Phase 4/Phase 5 similarly assume Scheduler/ChromeWorker binaries exist from Phase 1's baseline. No phase file acknowledges the SUBDIRS gap or adds a step to build these sub-projects individually (e.g. `qmake` per sub-`.pro`, or extending `SUBDIRS`).

3. **MINOR / needs confirmation** — `scout-01-module-map.md:96-101` / `plan.md:18`: "Test coverage is near-zero (1 file, Engine resources only)". Repo evidence: `Solution/Tests/unit/resources/Tests.pro` confirms only 1 automated test source file (accurate for CI-registered tests), but `find Solution/Tests -type f` also shows 7 `integration/**/*.xml` fixture files (Browser, FTP, SMS, Excel x2, SQL) not referenced by any `.pro`/build config — i.e. genuinely not automated, so the claim technically holds, but the plan never surfaces these as candidate seed material for Phase 2/10's new characterization-test corpora. Non-load-bearing (doesn't break any phase's correctness), flagged as an opportunity-cost note only.

4. **NONE** (checklist items 2, and most of 1/3/4) — no other mismatches found; see Checklist Results above for the PASS evidence per sub-item.

## Unresolved Questions
- Whether Phase 1 intends to add per-module `qmake`/`SUBDIRS` build steps for ChromeWorker/WebInterfaceBrowser/SchedulerBrowser/Scheduler as an implicit "of course we'd build those too" — if so it should be stated explicitly in Phase 1's Implementation Steps/Related Code Files, since as written the CI workflow described only builds 6 of the ~12 top-level modules.
