# Phase 05: Scheduling Utilities Migration (Scheduler + Updater + RemoteExecuteScript)

## Context Links
- `scout/scout-01-module-map.md` — Scheduler (~47 files, 16 Q_OBJECT, headless Qt HTTP server, no Engine dep); Updater (~60 files, 19 Q_OBJECT, HTTP+ZIP, links Engine only for logging); RemoteExecuteScript (~25 files, low Qt, shares HTTP/ZIP code with Updater).
- `phase-04-workspace-bootstrap-browser-shell-migration.md` — reused interop pattern (`cxx`, qmake `QMAKE_EXTRA_TARGETS`, panic-safety) and `bas-contracts`.
- `plan.md` — `bas-scheduling` crate definition.

## Overview
- **Priority:** P1 — second migration wave, proves the pattern scales to Qt-coupled (not just Qt-free) modules.
- **Status:** pending.
- Scope: consolidate Scheduler, Updater, RemoteExecuteScript's portable business logic (HTTP server/client, task persistence, ZIP extraction, update/download-resume logic) into `bas-scheduling`. Qt UI/event-loop glue (Scheduler's WebSocket handling if UI-bound, Updater's progress UI) stays C++ where it is genuinely Qt-signal/slot-bound; the underlying logic it calls moves to Rust.

## Key Insights
- None of these three modules depend on Engine except Updater's "logging, lite" link (scout) — this is the FIRST time this migration touches a module with even a thin Engine dependency; must decouple that logging call (either duplicate a tiny logging shim in Rust, or keep a thin C++ call for logging only) rather than pull Engine into scope prematurely.
- Updater and RemoteExecuteScript already share HTTP/ZIP code (scout) — consolidating them into one crate directly reduces duplicate logic rather than porting the duplication into Rust as two copies.
- Scheduler's moderate Qt coupling (16 Q_OBJECT files) is its HTTP server + task manager's event handling — Rust's async ecosystem (tokio) replaces the Qt event loop for the server logic itself; only genuinely UI-facing Qt code (if any — Scheduler is headless per scout) would need to stay.
- Zero existing test coverage for all three (scout) — characterization tests are mandatory here too, scoped to this phase (not a separate global phase), per Requirements below.
- WinAPI/COM usage across Scheduler/Updater/RemoteExecuteScript is NONE (scout) — this crate is already cross-platform-clean by construction. The only requirement is not to REGRESS that: use `tokio`/portable HTTP + ZIP crates (already the natural Rust choice here), no Windows-only crate creeps in.

## Requirements
- Functional: HTTP server/API surface (Scheduler), download/resume/ZIP-extraction logic (Updater), HTTP dispatch + ZIP utilities (RemoteExecuteScript) move to `bas-scheduling` with byte-for-byte-equivalent external behavior (same HTTP responses, same task persistence format, same ZIP output).
- Non-functional: characterization tests (golden HTTP responses, ZIP round-trip fixtures, task-persistence snapshots) exist and pass BEFORE any port work starts (same rule as Phase 3, scoped to this phase's modules).
- Task persistence format (on-disk task DB) must remain readable by any in-flight/un-migrated task data — no silent format break for a running deployment.

## Architecture
- **`bas-scheduling`** (`rust/bas-scheduling/`): three internal modules — `scheduler` (HTTP server via a Rust HTTP crate, task manager, task persistence), `updater` (download/resume, ZIP extraction via a Rust zip crate), `remote_execute` (HTTP dispatch, shared ZIP utilities reused from `updater`'s module, not duplicated).
- Depends on `bas-contracts` for shared task/update DTOs.
- Qt-facing shims (only where a genuine Qt event-loop/UI dependency remains) call into `bas-scheduling`'s exported `extern "Rust"` functions via the same `cxx` + `catch_unwind` pattern from Phase 4.
- Async runtime choice: tokio (single runtime instance shared across `scheduler`/`updater`/`remote_execute` within the crate — avoids the "many runtimes" anti-pattern).

## Related Code Files
- `Solution/Scheduler/` — modify: HTTP server/task manager logic replaced with calls into `bas-scheduling::scheduler`; exact files confirmed against `Scheduler.pro` SOURCES during execution.
- `Solution/Updater/` — modify: download/ZIP logic replaced with calls into `bas-scheduling::updater`.
- `Solution/RemoteExecuteScript/` — modify: HTTP dispatch replaced with calls into `bas-scheduling::remote_execute`.
- **Create:** `rust/bas-scheduling/{Cargo.toml,src/lib.rs,src/scheduler.rs,src/updater.rs,src/remote_execute.rs,src/bridge.rs}`.
- **Create:** `Solution/Tests/SchedulingCharacterization/golden/` — golden HTTP/ZIP/task-persistence fixtures.
- **Modify:** `Solution/Scheduler/Scheduler.pro`, `Solution/Updater/Updater.pro`, `Solution/RemoteExecuteScript/RemoteExecuteScript.pro` — `QMAKE_EXTRA_TARGETS` + `LIBS` per Phase 4's pattern.

## Implementation Steps
1. Write characterization tests first (golden HTTP request/response pairs for Scheduler's API, ZIP round-trip fixtures + download-resume scenarios for Updater, dispatch scenarios for RemoteExecuteScript) against the CURRENT unmodified binaries — same discipline as Phase 3.
2. Decouple Updater's Engine logging dependency (thin shim decision, documented).
3. Build `bas-scheduling` skeleton, no-op link into all three `.pro` files, confirm CI still builds green.
4. Port Updater's shared HTTP/ZIP utilities first (used by both Updater and RemoteExecuteScript) — single implementation, golden-test after.
5. Port Updater's download/resume logic, golden-test after.
6. Port RemoteExecuteScript's dispatch logic (reusing step 4's utilities), golden-test after.
7. Port Scheduler's HTTP server + task manager (largest single piece), golden-test after each API endpoint migrated, not batched.
8. Verify on-disk task-persistence format compatibility with any pre-migration task data (round-trip an old-format file through the new Rust reader).
9. Add a macOS + Linux CI leg for `bas-scheduling` (`cargo build`/`cargo test`) — should pass with minimal friction given zero WinAPI/COM usage.
10. Remove dead ported C++ source; run full characterization suite.

## Todo List
- [ ] Golden HTTP/ZIP/task-persistence characterization tests (current binaries)
- [ ] Decouple Updater's Engine logging dependency
- [ ] `bas-scheduling` skeleton + no-op qmake link, CI green
- [ ] Port shared HTTP/ZIP utilities (Updater+RemoteExecuteScript)
- [ ] Port Updater download/resume logic
- [ ] Port RemoteExecuteScript dispatch logic
- [ ] Port Scheduler HTTP server + task manager, per-endpoint golden tests
- [ ] Verify task-persistence format backward-compatibility
- [ ] Remove dead C++ source, full suite green

## Success Criteria
- CI builds Scheduler/Updater/RemoteExecuteScript against `bas-scheduling`, all characterization tests pass unchanged.
- An old-format on-disk task file round-trips correctly through the Rust reader (evidenced by a test using a real pre-migration fixture file).
- No new Engine dependency introduced (Updater's logging decoupling documented, not deferred).
- `bas-scheduling` builds and passes its unit/integration test suite on macOS + Linux in CI, alongside Windows — expected to be the cheapest cross-platform checkpoint in the plan since scout found zero WinAPI/COM usage here.

## Risk Assessment
- **Task persistence format break** — mitigated by the explicit round-trip test in step 8; this is a data-loss-adjacent risk (running deployments have in-flight task data) so it gets its own Success Criteria line, not folded into general "characterization tests pass."
- **tokio runtime conflicts with any remaining Qt event loop in the same process** — mitigate by running tokio on dedicated threads, never blocking the Qt main thread, and testing under load (concurrent HTTP requests during a scheduled task) before declaring done.
- **HTTP API behavior drift** (header ordering, error-code semantics) — golden HTTP fixtures must capture full request/response including headers, not just body, to catch subtle drift.

## Security Considerations
- Scheduler's HTTP server is network-facing (internal + external API per scout) — the Rust port must preserve existing auth/access-control behavior exactly (no accidental widening of what the API accepts); add a golden test specifically for an unauthorized/malformed request to prove the rejection behavior is unchanged.
- Updater's download logic fetches and extracts ZIP archives — a Rust zip crate must be checked for path-traversal protections (zip-slip) at least as strong as the current C++ implementation; do not regress even if the current code has a latent gap (flag, don't silently fix beyond scope — if a gap is found, treat as a separate documented finding, not blocking this phase's completion criteria unless it's a NEW regression this port introduces).

## Test Strategy & Quality Gate
Lane `high-risk`.
- **Spec:** Goal — behavior-preserving migration of Scheduler/Updater/RemoteExecuteScript to `bas-scheduling`. AC: Given golden HTTP/ZIP/task fixtures, When run against the ported binaries, Then output matches byte-for-byte (HTTP bodies/headers) or structurally (extracted ZIP contents); Given an old-format task file, When read by the new code, Then it parses identically to the old reader. I/O contract: HTTP req/resp pairs, ZIP archive fixtures, task-persistence file format — all unchanged from pre-migration. Out-of-scope: new API endpoints, behavior changes.
- **Pyramid:** ~70% unit (Rust `#[test]` per function), ~20% integration (HTTP server started in-process, real requests), ~10% e2e (full characterization suite against the real binary).
- **E2E scenario:** "Scheduler API round-trip: submit task → poll status → verify persisted result" against the ported binary, diffed against the golden baseline.
- **Coverage target:** ≥90% line / ≥75% branch diff-coverage on `bas-scheduling` new code, via `cargo tarpaulin`.
- **Evidence commands:** `cargo test -p bas-scheduling` (green), `cargo tarpaulin -p bas-scheduling --out Html`, CI log of the SchedulingCharacterization suite passing, the task-persistence round-trip test output.

## ADR Rationale
**Decision:** Merge Scheduler + Updater + RemoteExecuteScript into ONE `bas-scheduling` crate, not three.
**Why:** scout shows Updater and RemoteExecuteScript already share HTTP/ZIP code, and all three share the "operational utility, portable business logic, moderate-or-no Qt" profile — cohesion-by-shared-responsibility (researcher-04's heuristic) beats mirroring three separate C++ modules into three separate crates, which would repeat Tokio's documented small-crate coordination overhead for ~130 files total (smaller than ChromeWorker alone).
**Alternatives rejected:** one crate per module (contradicts researcher-04's explicit anti-1:1-mirroring guidance); folding into `bas-browser-shell` (wrong cohesion — different domain, no shared code, would violate high-cohesion/low-coupling heuristic in the other direction).

## Next Steps
- Phase 6 (ChromeWorker) is next — larger and self-contained, now de-risked by two successful interop-pattern applications (Qt-free in Phase 4, lightly-Qt-coupled here).
- The tokio-runtime-per-crate convention set here is reused (not reinvented) by Phase 6 if ChromeWorker needs async I/O for CDP.
