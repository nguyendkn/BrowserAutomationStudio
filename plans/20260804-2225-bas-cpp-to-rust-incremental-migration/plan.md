---
title: "BAS C++/Qt → Rust Incremental Migration"
description: "Cross-platform-first, module-by-module migration of BrowserAutomationStudio from C++/Qt to Rust — unblock a macOS build first via surgical fixes, then continue the incremental full-module migration."
status: pending
priority: P1
effort: ~26 weeks (12 phases)
lane: high-risk
branch: main
tags: [refactor, infra, cross-platform]
created: 2026-08-04
---

## Overview

**Primary goal: cross-platform, and the FIRST milestone is getting BAS to build and launch on macOS.** Rust is the *means*, not the end. Qt is already cross-platform — it is NOT the blocker; the real blocker is pervasive raw WinAPI/COM-pattern usage across nearly every module (Engine, ChromeWorker, and, to a lesser and now-corrected degree, Modules — see Phase 1/2). Phases 1-2 do a narrow, surgical, evidence-cited fix of ONLY the specific call sites blocking a macOS build — not a full rewrite of any module (that stays incremental, Phase 4 onward, never big-bang). A Windows CI reference build exists as a **supporting task inside Phase 1**, capturing a pre-change behavior snapshot for characterization tests — it is not itself a gating phase; the actual first gate is Phase 2's "clean checkout builds and launches on macOS."

Starting with `bas-platform` in Phase 2, every new Rust crate adds a macOS + Linux CI build/test leg alongside Windows — cross-platform readiness is an incremental, per-crate checkpoint, continuing past the Phase 2 milestone. Test coverage is near-zero (1 file, Engine resources only) — every module gets characterization tests before its own migration, never after.

## Architecture: Rust Workspace (9 crates, justified from the scout dependency map + the Phase 1 repo-wide WinAPI scan)

Not a 1:1 mirror of the 12 C++ modules (fragmentation risk) and not one monolith. 8 crates map to the scout dependency map's module groupings (unchanged from the original design); a 9th, `bas-platform`, is added because Phase 1's full-repo scan found cross-platform-primitive needs (process info, portable export macros, OS-specific-trait fallbacks) spanning FIVE+ modules (ChromeWorker, Engine, Modules, plus smaller ones) — no single module crate should own that shared concern; ⚠ flags crates carrying WinAPI logic to replace.

| Crate | Responsibility | Justification |
|---|---|---|
| `bas-platform` ⚠ | Cross-platform OS primitives (process, portable export macros, `#[cfg(target_os)]` fallback trait) | Phase 1 scan: shared need across ChromeWorker/Engine/Modules/smaller modules — built FIRST (Phase 2), reused by `bas-chromeworker`/`bas-engine-core` later |
| `bas-contracts` | Shared serializable DTOs, zero logic | Prevents Engine's 100+-API surface leaking into every consumer |
| `bas-browser-shell` | WebInterfaceBrowser + SchedulerBrowser (CEF, no Qt) | ~29 files combined, independent — 2 crates = over-fragmentation |
| `bas-scheduling` | Scheduler + Updater + RemoteExecuteScript | Shared HTTP/ZIP/task logic, no Qt dep on Engine, cohesive |
| `bas-chromeworker` ⚠ | ChromeWorker (CDP, fingerprinting, tab/input) | Scout: "self-contained... isolated"; researcher-04: "tightly coupled" (high cohesion); 36 `windows.h` files (Phase 1 count) — primary cross-platform blocker, Tier 1 in Phase 2 |
| `bas-engine-core` ⚠ | Engine: resource mgmt, DB connectivity, browser-control | Non-scripting/registry primitives; carries Engine's WinAPI/WinSock (process mgmt, Mongo net, `CrashHandler`/`devicescalemanager`) |
| `bas-engine-script` | Engine: script compilation/execution | Largest, highest-risk file (scriptworker.cpp, 116KB) — no WinAPI dep |
| `bas-engine-plugin` | Engine: script-function/plugin registry | 40 Modules block only on this integration point; the DLL-LOADING mechanism itself (`modulemanager.cpp`'s `QLibrary`) is already cross-platform per Phase 1 — this crate owns registration/dispatch, not necessarily a loader rewrite |
| `bas-modules` ⚠ | ~40 plugin DLLs' script functions, consolidated | Low-coupling, ~600KB total; ImageProcessing (GDI) needs cross-platform swap; export-macro fix already done in Phase 2 |

`FastExecuteScript` gets no dedicated *library* crate — thin wrapper, becomes `bas-fastexecute`, a `[[bin]]`-only 10th workspace member linking `bas-engine-script` directly (Phase 11), not an 11th responsibility-bearing crate. Studio + ShopViewer excluded from the committed 9 (negligible value) — optional 11th crate or stays C++ wrapping Rust via CXX-Qt, decided at Phase 12.

**Deliberate override of researcher-04's grouping:** researcher-04 suggested merging Scheduler + SchedulerBrowser + FastExecuteScript + RemoteExecuteScript into one utility crate. This plan splits it along scout's actual domain lines instead: SchedulerBrowser is CEF-based, no Qt (same domain as WebInterfaceBrowser → `bas-browser-shell`); Scheduler is an HTTP/task server (same domain as Updater/RemoteExecuteScript → `bas-scheduling`) — protocol/runtime domain, not just "utility," drives cohesion here. FastExecuteScript joins neither: scout labels it a blocked thin wrapper with no logic of its own, not a peer utility module.

## Migration Order Reasoning

Order now weighs THREE factors: (0) **unblock macOS building first** (Phases 1-2, narrow surgical fixes, ahead of everything else — this is the user's explicit reprioritization); (1) isolated, cheaply-testable modules before Engine; (2) cross-platform-blocking modules are prioritized even when larger/riskier, within the Phase 3+ full-migration sequence. ChromeWorker gets its blocking call sites fixed FIRST within Phase 2 (Tier 1, 36 files — the largest real count after Phase 1 corrected the original "Modules COM" framing) and its full logic migrates 3rd — counting only full-module-migration phases (Phase 4 `bas-browser-shell` = 1st, Phase 5 `bas-scheduling` = 2nd, Phase 6 `bas-chromeworker` = 3rd; Phase 3 doesn't count, it only writes characterization tests, no crate) — ahead of what Qt-coupling alone would suggest — because it's the single biggest cross-platform blocker outside Engine. Within Engine, `core` (⚠ WinAPI/WinSock, also fixed early in Phase 2's Tier 2) goes first among its 3 sub-crates for the same reason, ahead of `script`/`plugin-registry` which carry no WinAPI dependency. Modules depend only on the registry seam, so it stabilizes last regardless of the cross-platform factor; Modules' OWN blocking call sites (Tier 3, cheap) are fixed in Phase 2 despite the full Modules migration coming last (Phase 11) — the fix is small enough not to need sequencing after Engine.

## Phases

| # | Phase | File |
|---|---|---|
| 1 | Windows-Dependency Inventory & Classification | [phase-01-windows-dependency-inventory-classification.md](phase-01-windows-dependency-inventory-classification.md) |
| 2 | Migrate macOS-Blocking Call Sites ⚠ PRIMARY GATE: macOS build+launch | [phase-02-migrate-macos-blocking-call-sites.md](phase-02-migrate-macos-blocking-call-sites.md) |
| 3 | Characterization Tests — Browser Shell | [phase-03-characterization-tests-browser-shell.md](phase-03-characterization-tests-browser-shell.md) |
| 4 | Workspace Bootstrap + Browser-Shell Migration (PoC) | [phase-04-workspace-bootstrap-browser-shell-migration.md](phase-04-workspace-bootstrap-browser-shell-migration.md) |
| 5 | Scheduling Utilities Migration | [phase-05-scheduling-utilities-migration.md](phase-05-scheduling-utilities-migration.md) |
| 6 | ChromeWorker Migration (remaining logic) ⚠ | [phase-06-chromeworker-migration.md](phase-06-chromeworker-migration.md) |
| 7 | Engine Internal Boundary Discovery | [phase-07-engine-boundary-discovery.md](phase-07-engine-boundary-discovery.md) |
| 8 | Engine Migration: Core (remaining logic) ⚠ | [phase-08-engine-core-migration.md](phase-08-engine-core-migration.md) |
| 9 | Engine Migration: Scripting | [phase-09-engine-script-migration.md](phase-09-engine-script-migration.md) |
| 10 | Engine Migration: Plugin Registry | [phase-10-engine-plugin-registry-migration.md](phase-10-engine-plugin-registry-migration.md) |
| 11 | Plugin Modules Migration | [phase-11-modules-migration.md](phase-11-modules-migration.md) |
| 12 | Final Consolidation & Cleanup | [phase-12-consolidation-cleanup.md](phase-12-consolidation-cleanup.md) |

No top-level Parallel Execution Matrix: phases are strictly sequential by design. Phase 11 documents internal parallel batching for the 40 modules. "Remaining logic" tags on Phases 6/8 mean: their module's macOS-blocking call sites were already fixed in Phase 2 — these phases port the REST of the module's business logic to Rust.

## Unresolved Questions

1. Engine's exact core/scripting/plugin-registry sub-boundaries — only fully discoverable during Phase 7's spike; the phase's boundary map is a hypothesis until validated.
2. ~~Windows VM vs GitHub Actions `windows-latest`~~ — **RESOLVED** via validation interview: Windows VM (interactive debugging weighed over CI reproducibility). Phase 1's supporting reference-build task description should be updated to target a VM as primary, not `windows-latest` CI, before that task executes.
3. Whether Studio ever adopts CXX-Qt or stays C++ indefinitely wrapping a Rust backend — deferred to Phase 12, no decision needed until Engine migration is done. Confirmed via validation interview: stays open/deferred, no change.
4. Qt version in `basbuild` repo (GitLab 403, unreachable) — needed to pin the Phase-1 reference-build toolchain. Confirmed via validation interview: user will supply access before Phase 1 executes; plan keeps the placeholder as-is.
5. Which ChromeWorker fingerprinting internals (if any) are inherently OS-specific and need a long-term per-platform abstraction rather than a full cross-platform rewrite — needs deeper ChromeWorker-internals research beyond this plan's scope; tracked in Phase 6.
6. Whether Phase 1's closing sanity check finds any genuine category-(d) "architecturally significant redesign" case (none found in this plan's own drafting pass — the original "Modules COM" claim was falsified with evidence) — if one surfaces, its exact redesign shape is unknown until investigated; this plan can only scope the investigation, not prescribe the fix, until Phase 1 actually runs against the live repo.

## Automatic Validation

**Rounds run:** 3 (deep r1 + 2 delta) | **Outcome:** CLEAN (lane exit rule met — 2 consecutive clean rounds)

### Round Log
| Round | Type | Structural | Consistency | Fidelity | Testability | BLOCKERs | Clean |
|---|---|---|---|---|---|---|---|
| 1 | deep | PASS | 0 BLOCKER/1 MINOR | 2 BLOCKER/1 MINOR | PASS | 2 | no |
| 2 | delta | PASS | carried PASS (r1, MINOR fixed) | PASS | carried PASS (r1) | 0 | yes |
| 3 | delta | PASS | carried PASS (r2) | carried PASS (r2) | carried PASS (r1) | 0 | yes |

Round 1 findings (fixed in one pass, hygiene-grepped clean): phase-08 misattributed `OpenProcess`/`HANDLE` to `processdeleter.cpp`/`memoryinfo.cpp` instead of the real `webdriverprocesscomunicatorfactory.cpp`; Modules' `windows.h` count was undercounted (1→2, missing `Timezones/dll/maxminddb.c`); phase-01's COM-pattern claim needed a C/C++-source-only scope qualifier; ChromeWorker's migration-order ordinal was inconsistent between plan.md and phase-06 (now both state "3rd, counting only full-module-migration phases"). Full round artifacts: `reports/validation-round-*.md` (round 1's original per-lens files renamed `*.stale.md` — bundle changed too much after two mid-drafting reprioritizations to remain valid; superseded by this fresh 3-round pass).

## Validation Summary

**Validated:** 2026-08-04 | **Questions asked:** 4

### Confirmed Decisions
- `basbuild` repo access (403): user will supply access/credentials before Phase 1 executes — placeholder in the plan stands as-is.
- Windows reference-build environment: **Windows VM** (not GitHub Actions `windows-latest`) — interactive debugging weighed over CI reproducibility.
- Studio's long-term fate (CXX-Qt vs stays C++): left open, deferred to Phase 12 as already planned.
- Scope/timeline: proceed with the full 12-phase plan (~26 weeks) — no early stop after Phase 2's macOS-unblock milestone.

### Action Items
- [ ] Update Phase 1's supporting "Windows reference build" task to target a Windows VM as the primary environment (not `windows-latest` CI) before that task is executed.

No other plan changes required — all other answers confirm the plan as drafted.
