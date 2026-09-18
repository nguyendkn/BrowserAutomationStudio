---
title: "BAS C++/Qt → Rust Incremental Migration"
description: "Windows-first, module-by-module migration of BrowserAutomationStudio from C++/Qt to Rust — validate the incremental migration on Windows (BAS's real production platform), with macOS/Linux cross-platform readiness as non-blocking follow-on hardening."
status: pending
priority: P1
effort: ~26 weeks (12 phases)
lane: high-risk
branch: main
tags: [refactor, infra, cross-platform]
created: 2026-08-04
---

## Overview

**Primary goal: Windows-first.** BAS's actual, current, production platform is Windows — v25.8.0 ships today and builds fine there with the existing MSVC/Qt toolchain (confirmed: no WinAPI blocker on Windows, that's the native platform). Rust is the *means*, not the end. The plan's actual first milestone is: stand up the Rust workspace and validate the incremental migration builds, links, and launches on Windows — the platform that already works — continuing the module-by-module migration order below (isolated modules → Engine → Modules), with per-crate Windows CI/build as the checkpoint at every phase.

Qt is already cross-platform — macOS/Linux are NOT blocked by Qt; the blocker there is pervasive raw WinAPI/COM-pattern usage across nearly every module (Engine, ChromeWorker, and, to a lesser and now-corrected degree, Modules — see Phase 1). That macOS-blocking-call-site work is **not dropped** — it stays in the plan as documented follow-on cross-platform hardening (Phase 1's classification, the `bas-platform` crate, `macx{}` qmake blocks) — but it is explicitly **not a gate** in front of Phase 3's module migrations. It runs as a parallelizable/deferred track alongside or after the Windows-validated migration proceeds, per the user's explicit reprioritization (2026-09-18): Windows first, then continue the migration; cross-platform readiness is secondary/deferred, not the plan's first gate.

Starting with `bas-platform`, every new Rust crate adds a macOS + Linux CI build/test leg alongside Windows where feasible — cross-platform readiness stays an incremental, per-crate, non-blocking checkpoint. Test coverage is near-zero (1 file, Engine resources only) — every module gets characterization tests before its own migration, never after.

## Architecture: Rust Workspace (9 crates, justified from the scout dependency map + the Phase 1 repo-wide WinAPI scan)

Not a 1:1 mirror of the 12 C++ modules (fragmentation risk) and not one monolith. 8 crates map to the scout dependency map's module groupings (unchanged from the original design); a 9th, `bas-platform`, is added because Phase 1's full-repo scan found cross-platform-primitive needs (process info, portable export macros, OS-specific-trait fallbacks) spanning FIVE+ modules (ChromeWorker, Engine, Modules, plus smaller ones) — no single module crate should own that shared concern; ⚠ flags crates carrying WinAPI logic to replace.

| Crate | Responsibility | Justification |
|---|---|---|
| `bas-platform` ⚠ | Cross-platform OS primitives (process, portable export macros, `#[cfg(target_os)]` fallback trait) | Phase 1 scan: shared need across ChromeWorker/Engine/Modules/smaller modules — owned by the non-gating Phase-2 hardening track; `bas-chromeworker`/`bas-engine-core` depend on it IF it exists by then, else they implement their own `platform` submodule and Phase 2 consolidates later (see Phase 6/8) |
| `bas-contracts` | Shared serializable DTOs, zero logic | Prevents Engine's 100+-API surface leaking into every consumer |
| `bas-browser-shell` | WebInterfaceBrowser + SchedulerBrowser (CEF, no Qt) | ~29 files combined, independent — 2 crates = over-fragmentation |
| `bas-scheduling` | Scheduler + Updater + RemoteExecuteScript | Shared HTTP/ZIP/task logic, no Qt dep on Engine, cohesive |
| `bas-chromeworker` ⚠ | ChromeWorker (CDP, fingerprinting, tab/input) | Scout: "self-contained... isolated"; researcher-04: "tightly coupled" (high cohesion); 36 `windows.h` files (Phase 1 count) — builds and runs on Windows as-is (native platform); Tier 1 of Phase 2's deferred cross-platform hardening |
| `bas-engine-core` ⚠ | Engine: resource mgmt, DB connectivity, browser-control | Non-scripting/registry primitives; carries Engine's WinAPI/WinSock (process mgmt, Mongo net, `CrashHandler`/`devicescalemanager`) |
| `bas-engine-script` | Engine: script compilation/execution | Largest, highest-risk file (scriptworker.cpp, 116KB) — no WinAPI dep |
| `bas-engine-plugin` | Engine: script-function/plugin registry | 40 Modules block only on this integration point; the DLL-LOADING mechanism itself (`modulemanager.cpp`'s `QLibrary`) is already cross-platform per Phase 1 — this crate owns registration/dispatch, not necessarily a loader rewrite |
| `bas-modules` ⚠ | 41 plugin DLLs' script functions, consolidated | Low-coupling, ~600KB total; builds on Windows unchanged; ImageProcessing (GDI) cross-platform swap and the `__declspec` export-macro portability fix are Phase 2's deferred hardening scope, not a Phase 11 precondition |

`FastExecuteScript` gets no dedicated *library* crate — thin wrapper, becomes `bas-fastexecute`, a `[[bin]]`-only 10th workspace member linking `bas-engine-script` directly (Phase 11), not an 11th responsibility-bearing crate. Studio + ShopViewer excluded from the committed 9 (negligible value) — optional 11th crate or stays C++ wrapping Rust via CXX-Qt, decided at Phase 12.

**Deliberate override of researcher-04's grouping:** researcher-04 suggested merging Scheduler + SchedulerBrowser + FastExecuteScript + RemoteExecuteScript into one utility crate. This plan splits it along scout's actual domain lines instead: SchedulerBrowser is CEF-based, no Qt (same domain as WebInterfaceBrowser → `bas-browser-shell`); Scheduler is an HTTP/task server (same domain as Updater/RemoteExecuteScript → `bas-scheduling`) — protocol/runtime domain, not just "utility," drives cohesion here. FastExecuteScript joins neither: scout labels it a blocked thin wrapper with no logic of its own, not a peer utility module.

## Migration Order Reasoning

Order now weighs THREE factors, reprioritized 2026-09-18 per the user's explicit instruction: (0) **Windows-native validation at every phase** — Windows is the platform that already works today, so each phase's crate must build, link, and (where applicable) launch on Windows as its checkpoint, ahead of any cross-platform concern; (1) isolated, cheaply-testable modules before Engine; (2) cross-platform-blocking modules (ChromeWorker, Engine `core`, Modules' two `windows.h` files — Phase 1's classification) are still prioritized for their classification/refactor work, but that work is now a **parallelizable/deferred hardening track**, not a blocking gate before Phase 3+ starts. ChromeWorker's full logic migrates 3rd — counting only full-module-migration phases (Phase 4 `bas-browser-shell` = 1st, Phase 5 `bas-scheduling` = 2nd, Phase 6 `bas-chromeworker` = 3rd; Phase 3 doesn't count, it only writes characterization tests, no crate) — ahead of what Qt-coupling alone would suggest, because it carries the largest WinAPI-touching surface outside Engine and benefits from early cross-platform-primitive extraction (`bas-platform`) even though that extraction is no longer gating. Within Engine, `core` (⚠ WinAPI/WinSock) goes first among its 3 sub-crates for the same reason, ahead of `script`/`plugin-registry` which carry no WinAPI dependency. Modules depend only on the registry seam, so it stabilizes last regardless of the cross-platform factor; Modules' own two `windows.h` files (Phase 1's Tier 3) are cheap enough to fix opportunistically alongside the classification track without needing sequencing after Engine.

## Phases

Phase numbering is unchanged from the pre-reprioritization draft (deliberately — renumbering would churn every cross-reference in 12 files for no analytical gain). What changed is which phases GATE: Phases 1-2 are now the **non-blocking cross-platform hardening track** (they may run before, alongside, or after Phases 3-12; nothing in Phase 3 onward waits on them), and the Windows-validated migration sequence Phase 3 → 12 is the plan's critical path.

| # | Phase | Track | File |
|---|---|---|---|
| 1 | Windows-Dependency Inventory & Classification (+ Windows reference build, PRIMARY validation target) | X-plat groundwork, non-gating | [phase-01-windows-dependency-inventory-classification.md](phase-01-windows-dependency-inventory-classification.md) |
| 2 | Cross-Platform Hardening: macOS-Blocking Call Sites | X-plat hardening, non-gating, deferred | [phase-02-migrate-macos-blocking-call-sites.md](phase-02-migrate-macos-blocking-call-sites.md) |
| 3 | Characterization Tests — Browser Shell | **Windows critical path (start here)** | [phase-03-characterization-tests-browser-shell.md](phase-03-characterization-tests-browser-shell.md) |
| 4 | Workspace Bootstrap + Browser-Shell Migration (PoC) — **owns `rust/Cargo.toml` creation** | Windows critical path | [phase-04-workspace-bootstrap-browser-shell-migration.md](phase-04-workspace-bootstrap-browser-shell-migration.md) |
| 5 | Scheduling Utilities Migration | Windows critical path | [phase-05-scheduling-utilities-migration.md](phase-05-scheduling-utilities-migration.md) |
| 6 | ChromeWorker Migration ⚠ | Windows critical path | [phase-06-chromeworker-migration.md](phase-06-chromeworker-migration.md) |
| 7 | Engine Internal Boundary Discovery | Windows critical path | [phase-07-engine-boundary-discovery.md](phase-07-engine-boundary-discovery.md) |
| 8 | Engine Migration: Core ⚠ | Windows critical path | [phase-08-engine-core-migration.md](phase-08-engine-core-migration.md) |
| 9 | Engine Migration: Scripting | Windows critical path | [phase-09-engine-script-migration.md](phase-09-engine-script-migration.md) |
| 10 | Engine Migration: Plugin Registry | Windows critical path | [phase-10-engine-plugin-registry-migration.md](phase-10-engine-plugin-registry-migration.md) |
| 11 | Plugin Modules Migration | Windows critical path | [phase-11-modules-migration.md](phase-11-modules-migration.md) |
| 12 | Final Consolidation & Cleanup | Windows critical path | [phase-12-consolidation-cleanup.md](phase-12-consolidation-cleanup.md) |

**Per-phase checkpoint (Phase 3 onward), replacing the old macOS gate:** each phase's Rust crate builds, its tests pass, and it integrates/links into a working Windows build — matching the codebase's real, current, working platform. macOS/Linux CI legs stay documented per phase but are explicitly **non-blocking** (plan.md's "incremental, per-crate checkpoint" language), and no Phase-3-onward phase may be held open solely on a non-Windows leg.

No top-level Parallel Execution Matrix for the critical path: Phases 3-12 are strictly sequential by design. The one genuine parallelism is track-level: the Phase 1-2 hardening track owns `docs/macos-blocker-classification.md`, `rust/bas-platform/**`, the `macx{}` blocks in `*.pro`, and `.github/workflows/build-macos.yml`; the critical path owns `rust/bas-{contracts,browser-shell,scheduling,chromeworker,engine-*,modules,fastexecute}/**` and `Solution/Tests/**` — disjoint except for the WinAPI-touching C++ call sites in ChromeWorker/Engine/Modules, which Phase 6/8/11 and Phase 2 both edit. Sequence that overlap rather than running it concurrently: whichever track reaches a given module first owns it (see Phase 2's Overview). Phase 11 documents internal parallel batching for its modules.

## Unresolved Questions

1. Engine's exact core/scripting/plugin-registry sub-boundaries — only fully discoverable during Phase 7's spike; the phase's boundary map is a hypothesis until validated.
2. ~~Windows VM vs GitHub Actions `windows-latest`~~ — **RESOLVED**: a real Windows build+launch (local dev machine or self-hosted Windows runner) is the PRIMARY validation target for the whole plan, not `windows-latest` CI. Applied to Phase 1's reference-build task 2026-09-18.
3. **OPEN — the Windows build environment is not yet provisioned on this machine.** Verified present: MSVC Build Tools 2022. Verified ABSENT: any Qt installation (`qmake` not on PATH, no `C:/Qt`), and the `basbuild`-provided dependency bundle every `.pro` file references via `$(BAS_PATH)`/`$(BAS_PATH_WORKER)` (confirmed present in `ChromeWorker.pro`, `Engine.pro`, `FastExecuteScript.pro`, `RemoteExecuteScript.pro`, `SchedulerBrowser.pro`, 4 `Modules/*/dll/moduledll.pro` files). Until Qt + that bundle are installed, no Windows reference build (Phase 1) or per-phase Windows checkpoint (Phase 3 onward) can actually be EXECUTED on this machine — a live environment blocker on the plan's own primary gate, unresolved as of this update, tied to question 5's `basbuild`-access blocker. Nothing in the plan's analysis depends on it; only execution does.
4. Whether Studio ever adopts CXX-Qt or stays C++ indefinitely wrapping a Rust backend — deferred to Phase 12, no decision needed until Engine migration is done. Confirmed via validation interview: stays open/deferred, no change.
5. Qt version in `basbuild` repo (GitLab 403, unreachable) — needed to pin the Phase-1 reference-build toolchain, AND to resolve question 3's Qt-install gap. Confirmed via validation interview: user will supply access before Phase 1 executes; plan keeps the placeholder as-is.
6. Which ChromeWorker fingerprinting internals (if any) are inherently OS-specific and need a long-term per-platform abstraction rather than a full cross-platform rewrite — needs deeper ChromeWorker-internals research beyond this plan's scope; tracked in Phase 6 (Windows-critical-path) and Phase 2 (deferred hardening).
7. Whether Phase 1's closing sanity check finds any genuine category-(d) "architecturally significant redesign" case (none found in this plan's own drafting pass — the original "Modules COM" claim was falsified with evidence) — if one surfaces, its exact redesign shape is unknown until investigated; this plan can only scope the investigation, not prescribe the fix, until Phase 1 actually runs against the live repo.

## Automatic Validation

**Rounds run:** 4 (deep r1 + 2 delta + delta r4 reprioritization) | **Outcome:** CLEAN (lane exit rule met — 3 consecutive clean rounds r2–r4)

### Round Log
| Round | Type | Structural | Consistency | Fidelity | Testability | BLOCKERs | Clean |
|---|---|---|---|---|---|---|---|
| 1 | deep | PASS | 0 BLOCKER/1 MINOR | 2 BLOCKER/1 MINOR | PASS | 2 | no |
| 2 | delta | PASS | carried PASS (r1, MINOR fixed) | PASS | carried PASS (r1) | 0 | yes |
| 3 | delta | PASS | carried PASS (r2) | carried PASS (r2) | carried PASS (r1) | 0 | yes |
| 4 | delta | PASS | PASS | PASS | PASS | 0 | yes |

Round 1 findings (fixed in one pass, hygiene-grepped clean): phase-08 misattributed `OpenProcess`/`HANDLE` to `processdeleter.cpp`/`memoryinfo.cpp` instead of the real `webdriverprocesscomunicatorfactory.cpp`; Modules’ `windows.h` count was undercounted (1→2, missing `Timezones/dll/maxminddb.c`); phase-01’s COM-pattern claim needed a C/C++-source-only scope qualifier; ChromeWorker’s migration-order ordinal was inconsistent between plan.md and phase-06 (now both state “3rd, counting only full-module-migration phases”). Full round artifacts: `reports/validation-round-*.md` (round 1’s original per-lens files renamed `*.stale.md` — bundle changed too much after two mid-drafting reprioritizations to remain valid; superseded by this fresh 3-round pass).

Round 4 (2026-09-18, Windows-first reprioritization): structural PASS (all 14 required sections present in all 12 phase files; frontmatter complete; 12 phase files match Phases table). Consistency PASS after fixes: demoted Phase 2’s “Primary gate: macOS build+launch” framing throughout its Requirements/Success Criteria/Test Strategy/ADR/Next Steps to a non-gating deferred hardening track; made `bas-platform`/CI-workflow dependencies conditional on Phase 2 having run (“if Phase 2 has already run, otherwise own `platform` submodule”) in phases 03/04/06/08/11; handed `rust/Cargo.toml` ownership from Phase 2 to Phase 4; rewired Phase 7’s “Phase 2’s smoke test” to Phase 1’s Windows reference build; corrected all “CI reference build” to “Windows reference build (PRIMARY validation target)” and “windows-latest” to local/self-hosted wording. Fidelity PASS: Engine `windows.h` count 14→13 and Modules subdir ~40→41 applied opportunistically; repo-relative paths (`Solution/…`, `rust/…`) already clean (no `/Users/nguyendk` residue). Testability PASS: every phase retains a Windows primary checkpoint; Phase 2 now has an explicit “Windows stays green” binding constraint. Zero BLOCKERs remaining.

## Validation Summary

**Validated:** 2026-09-18 | **Questions asked:** 4 + reprioritization (2026-09-18, no new interview needed)

### Confirmed Decisions
- `basbuild` repo access (403): user will supply access/credentials before Phase 1 executes — placeholder in the plan stands as-is.
- Windows reference-build environment: **real Windows build+launch (local dev machine or self-hosted Windows CI runner)** is the PRIMARY validation target (not `windows-latest` GitHub Actions) — reprioritized 2026-09-18 to reflect that BAS v25.8.0 ships on Windows today. Phase 1’s supporting task already updated.
- Studio’s long-term fate (CXX-Qt vs stays C++): left open, deferred to Phase 12 as already planned.
- Scope/timeline: full 12-phase plan (~26 weeks) — Phase 2’s macOS hardening is now a deferred, non-gating track scheduled after or alongside Phases 3–12 (recommended slot: after Phase 6), not a gate before them. No renumbering.

### Action Items
- [x] 2026-09-18: Phase 1’s “Windows reference build” retargeted to real Windows build+launch (local/self-hosted) — done in phase-01.
- [ ] Provision Qt + `basbuild` dependency bundle on the Windows build machine before Phase 1 executes (currently blocked: MSVC present, Qt/`$(BAS_PATH)` absent — see plan.md Unresolved Q3 and Q5).
- [ ] Pick an explicit schedule slot for the deferred Phase 2 hardening track and record it in plan.md’s Phases table (recommended: after Phase 6).

No other plan changes required.
