# Phase 04: Rust Workspace Bootstrap + Browser-Shell Migration (Proof of Concept)

## Context Links
- `research/researcher-02-interop-tooling.md` — `cxx` for both FFI directions, `cbindgen` for pure-Rust-to-C-ABI, qmake `QMAKE_EXTRA_TARGETS` + Cargo static-lib pattern, panic-across-FFI = UB (need `catch_unwind`/`C-unwind`).
- `research/researcher-03-qt-rust-case-studies.md` — leaf-module-first pattern (Android/Firefox), narrow FFI boundaries.
- `research/researcher-04-crate-architecture.md` — crate granularity principles (cohesion/coupling heuristic).
- `phase-03-characterization-tests-browser-shell.md` — golden-file regression gate this phase must keep green.
- `plan.md` — workspace layout table.

## Overview
- **Priority:** P1 — first FULL-MODULE Rust crate in the repo (and, under the Windows-first ordering, the workspace root’s creator — `bas-platform` Phase 2 is a deferred hardening track and may not exist yet, so count it as a point-fix crate, not a module migration); validates the entire interop pattern every later module-migration phase reuses.
- **Status:** pending.
- Scope: create the Cargo workspace, implement `bas-contracts` + `bas-browser-shell`, port WebInterfaceBrowser + SchedulerBrowser's CEF handler logic to Rust, wire qmake to link the resulting static lib, keep the C++ CEF/Qt shell (if any) as a thin caller.

## Key Insights
- Both modules are CEF-based with NO Qt coupling (scout) — this is exactly the "isolated leaf module" case study C recommends starting with. If the interop pattern has flaws, they surface here cheaply (~29 files), not in ChromeWorker (320 files) or Engine (760 files).
- `cxx` handles both directions in one crate — no need for `cbindgen` here since the C++ side is NOT calling into a "new self-contained Rust module via plain C ABI"; it's a genuine bidirectional bridge (CEF C++ callbacks ↔ Rust handler logic).
- Panics crossing the CEF-callback→Rust boundary are UB — every `extern "Rust"` function exposed to C++ must either be panic-free by construction or wrapped in `catch_unwind` at the boundary, converting to a C++-visible error code/result.
- Per plan.md's cross-platform-first goal: both modules have only minimal WinAPI/COM usage (scout) — mostly tray-icon integration and filesystem hooks. Tray-icon logic should use a cross-platform crate (e.g. `tray-icon`) rather than raw Win32 tray APIs, establishing the "cross-platform crate by default" pattern this early even though this module isn't the primary blocker (that's ChromeWorker/Engine-core, Phases 6/8) — cheaper to set the convention here than retrofit it later.

## Requirements
- Functional: WebInterfaceBrowser + SchedulerBrowser's custom-URL-scheme handling, filesystem hooks, screenshot/screencast, and tray-icon logic move to Rust (`bas-browser-shell`); the CEF/OS integration points that MUST stay native (CEF's own C++ object lifecycle, OS tray APIs if no safe Rust equivalent) stay as a thin C++ shim calling into Rust via `cxx`.
- Non-functional: Phase 3's golden-file harness passes unchanged (proves behavior-preserving migration); build integrates into the Phase-1 qmake pipeline via `QMAKE_EXTRA_TARGETS`; every FFI boundary function has explicit panic handling.
- Tray-icon/filesystem-hook logic uses a cross-platform crate (`tray-icon`, `std::fs`) rather than a 1:1 WinAPI wrap, per plan.md's Overview — even though this module isn't the plan's primary cross-platform blocker.
- `bas-contracts` and `bas-browser-shell` build and unit-test on macOS + Linux in CI, alongside Windows — a cross-platform readiness checkpoint in the plan (if `bas-platform` Phase 2 has already run it was the first; otherwise this is the first; plan.md Overview: "every new Rust crate adds a macOS + Linux CI leg").

## Architecture
- **Workspace root:** `rust/Cargo.toml` (created HERE — this phase owns `rust/Cargo.toml`; Phase 2 only creates it in the unlikely case it runs first) — workspace members grow phase by phase; this phase adds `bas-contracts` and `bas-browser-shell`.
- **`bas-contracts`** (`rust/bas-contracts/`): plain serializable structs for URL-scheme request/response, screenshot metadata — no logic, no CEF/Qt deps. Depended on by `bas-browser-shell` and every later crate that needs to exchange data with it.
- **`bas-browser-shell`** (`rust/bas-browser-shell/`): `crate-type = ["staticlib"]`; `cxx` bridge module defining `extern "Rust"` fns (URL-scheme handler entry points, screenshot-capture entry points) called from the remaining C++ CEF glue, and `unsafe extern "C++"` blocks for any CEF C++ types Rust must call back into (if unavoidable).
- **Build integration:** `Solution/WebInterfaceBrowser/WebInterfaceBrowser.pro` and `Solution/SchedulerBrowser/SchedulerBrowser.pro` gain a `QMAKE_EXTRA_TARGETS` rule invoking `cargo build --release --manifest-path ../../rust/Cargo.toml -p bas-browser-shell`, then `LIBS += -L$$OUT_PWD/../../rust/target/release -lbas_browser_shell`.
- **Panic safety:** every `extern "Rust"` fn exposed to C++ wraps its body in `std::panic::catch_unwind`, converting `Err` to a sentinel/result type defined in `bas-contracts`; document this as the mandatory pattern for all future crates (Phase 5+ reuse it, not reinvent it).

## Related Code Files
- `Solution/WebInterfaceBrowser/` — modify: replace ported logic with calls into `bas-browser-shell`; exact file list confirmed against `WebInterfaceBrowser.pro` SOURCES during execution.
- `Solution/WebInterfaceBrowser/WebInterfaceBrowser.pro` — modify: add `QMAKE_EXTRA_TARGETS` + `LIBS`.
- `Solution/SchedulerBrowser/` — modify: same pattern.
- `Solution/SchedulerBrowser/SchedulerBrowser.pro` — modify: add `QMAKE_EXTRA_TARGETS` + `LIBS`.
- **Create:** `rust/Cargo.toml` — workspace manifest.
- **Create:** `rust/bas-contracts/{Cargo.toml,src/lib.rs}`.
- **Create:** `rust/bas-browser-shell/{Cargo.toml,src/lib.rs,src/bridge.rs,build.rs}`.
- **Modify:** `.github/workflows/build-windows.yml` — add Rust toolchain install (`rustup`) + `cargo build` step before the qmake step.

## Implementation Steps
1. Create `rust/` workspace with `bas-contracts` (empty structs first) and `bas-browser-shell` (empty `staticlib` crate that compiles and links a no-op into the existing qmake build) — prove the BUILD INTEGRATION works before porting any real logic.
2. Confirm Phase 2's CI workflow now also installs Rust and successfully runs `cargo build` + the existing qmake build with the no-op link — this is the interop-pattern smoke test, independent of behavior.
3. Port WebInterfaceBrowser's custom-URL-scheme handler logic to `bas-browser-shell`, one handler function at a time, wiring each through the `cxx` bridge, running Phase 3's golden-file harness after each function to catch regressions immediately (not batched at the end).
4. Port SchedulerBrowser's screenshot/screencast + tray-icon logic the same way.
5. Add `catch_unwind` wrapping to every `extern "Rust"` boundary fn; write one deliberate `panic!()` test proving the C++ side receives a clean error instead of UB/crash.
6. Remove the now-dead ported C++ source from `WebInterfaceBrowser`/`SchedulerBrowser` (keep only the thin CEF-glue shim that calls Rust).
7. Run Phase 3's full golden-file suite; confirm unchanged pass.
8. Add a macOS + Linux CI leg (`cargo build`/`cargo test` for `bas-contracts` + `bas-browser-shell`) alongside the Windows leg — the plan's first cross-platform checkpoint; fix any non-Windows compile issue (should be minimal given the tray-icon/filesystem choices in step 3-4).
9. Document the qmake+Cargo integration pattern, the panic-safety pattern, AND the cross-platform-crate-by-default convention in `rust/README.md` as the template for Phase 5/6/8-10.

## Todo List
- [ ] Create `rust/` workspace + `bas-contracts` skeleton
- [ ] Create `bas-browser-shell` skeleton, no-op link into qmake build
- [ ] CI: add Rust toolchain install + `cargo build` step
- [ ] Port WebInterfaceBrowser URL-scheme handlers, golden-test after each
- [ ] Port SchedulerBrowser screenshot/screencast + tray logic, golden-test after each
- [ ] Add `catch_unwind` to every FFI boundary fn
- [ ] Deliberate-panic test proves clean error propagation
- [ ] Remove dead ported C++ source
- [ ] Full golden-file suite green
- [ ] Write `rust/README.md` interop pattern doc

## Success Criteria
- CI builds the workspace (Rust + qmake/nmake) end to end and produces a working `BrowserAutomationStudio.exe` (or the relevant sub-executable) with WebInterfaceBrowser/SchedulerBrowser logic running from Rust.
- Phase 3's golden-file harness passes unchanged, evidenced by CI log.
- The deliberate-panic test proves no UB/crash crosses the FFI boundary — evidenced by test output showing a handled error, not a process crash.
- `rust/README.md` exists and is concrete enough that Phase 5 can follow it without re-deriving the pattern.
- `bas-contracts` + `bas-browser-shell` build and pass unit tests on macOS + Linux CI runners, not just Windows — evidenced by green CI legs for both non-Windows targets.

## Risk Assessment
- **cxx bridge friction with CEF C++ types** — CEF's own object model (ref-counted C++ objects) may not map cleanly onto cxx's restricted type set (no `Option`, `HashMap`, `Arc` bridges per researcher-02); mitigate by keeping the Rust side's public bridge surface in plain data types (via `bas-contracts`) and doing CEF object lifecycle entirely in the thin C++ shim, never passing CEF objects across the boundary directly.
- **Build time regression** — qmake+Cargo integration rebuilds Rust on every qmake invocation; mitigate with Cargo's incremental build cache, measure build time delta in CI and flag if it becomes a developer-experience blocker.
- **Golden-file harness gives false confidence** — if Phase 3's scenarios don't cover a behavior this migration touches, a regression could slip through; mitigate by re-reviewing Phase 3's scenario coverage against the actual ported functions before declaring this phase done.

## Security Considerations
- `unsafe` blocks on the C++ side of the `cxx` bridge (per researcher-02, C++ side is not 100% safe) must be reviewed for lifetime/ownership correctness — no raw pointer passed across the boundary without clear ownership semantics documented in the bridge module.
- No new network-facing surface is introduced by this phase (URL-scheme handling is local/IPC-facing) — confirm no new listening port or unauthenticated IPC channel is added inadvertently during the port.

## Test Strategy & Quality Gate
Lane `high-risk`.
- **Spec:** Goal — behavior-preserving Rust port of WebInterfaceBrowser + SchedulerBrowser with a working qmake+Cargo build. AC: Given Phase 3's golden scenarios, When run against the ported binary, Then output matches the golden baseline exactly (or within the documented screenshot tolerance); Given a deliberate panic in a bridge fn, When triggered, Then the C++ caller receives a defined error, not a crash. I/O contract: unchanged from Phase 3 (same scenario inputs/outputs). Out-of-scope: any behavior CHANGE (bug fixes deferred to a separate, reviewed change).
- **Pyramid:** ~70% unit (Rust-side `#[test]` for the ported logic in isolation), ~20% integration (bridge-level cxx tests), ~10% e2e (Phase 3's golden-file harness against the full binary).
- **E2E scenario:** Phase 3's golden-file suite run against the Rust-ported binary — primary regression gate.
- **Coverage target:** ≥90% line / ≥75% branch diff-coverage on the new `bas-browser-shell`/`bas-contracts` Rust code (via `cargo tarpaulin` or `grcov`), per `quality-gate.md` §5.
- **Evidence commands:** `cargo test -p bas-browser-shell -p bas-contracts` (green run output), `cargo tarpaulin --workspace --out Html` (or `grcov`) coverage report, CI log of the golden-file suite passing.

## ADR Rationale
**Decision:** `cxx` (hand-written bridge) for this crate, not `autocxx`; qmake `QMAKE_EXTRA_TARGETS` for build integration, not a full qmake→CMake migration.
**Why:** researcher-02 explicitly flags `autocxx` as unmaintained/not-recommended-for-production; `cxx` is stable and its static-analysis guarantees (no signature mismatch/ABI bugs) matter most on the FIRST crate, where a subtle FFI bug would poison the pattern every later phase copies. Migrating qmake to CMake to get `corrosion`'s native Cargo plugin is out of scope — YAGNI, adds a second build-system migration on top of a language migration, and researcher-02's documented `QMAKE_EXTRA_TARGETS` pattern is proven (cited blog + Cargo docs) and reversible.
**Alternatives rejected:** `autocxx` (unmaintained per researcher-02); qmake→CMake migration (scope creep, no case study calls for it, contradicts "narrow FFI boundary" lesson from case-study C by adding an unrelated build-system risk).

## Next Steps
- Phase 5 (`bas-scheduling`) reuses this phase's `bas-contracts` crate, the qmake+Cargo build pattern, and the panic-safety wrapper convention verbatim.
- `rust/README.md` becomes the canonical interop reference cited by every subsequent phase file instead of re-deriving the pattern.
