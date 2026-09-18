# Phase 06: ChromeWorker Migration

## Context Links
- `scout/scout-01-module-map.md` — ChromeWorker (~320 files, CEF-based, NO Qt, 43 WinAPI/COM files, "self-contained... isolated from rest of codebase"). Largest files: `lodepng.cpp` (219KB), `mainapp.cpp` (173KB), `devtoolsconnector.cpp` (111KB).
- `research/researcher-04-crate-architecture.md` — "ChromeWorker: Keep as one crate (fingerprinting + browser control are tightly coupled; high cohesion)."
- `research/researcher-03-qt-rust-case-studies.md` — leaf-module-first; ChromeWorker fits "system services & libraries" tier once the leaf-module pattern is proven.
- `phase-04-workspace-bootstrap-browser-shell-migration.md` / `phase-05-scheduling-utilities-migration.md` — interop pattern now proven twice; this phase reuses it at scale.
- User's explicit example: "ChromeWorker fingerprint output snapshots" characterization tests.

## Overview
- **Priority:** P1 — largest single-module migration before Engine; validates the pattern at ~320-file scale.
- **Status:** pending.
- Scope: move Chrome DevTools Protocol client, browser fingerprinting, tab control, screenshot/screencast, input emulation, custom protocol handlers into `bas-chromeworker`. This is the single biggest phase by file count before Engine itself.

## Key Insights
- No Qt coupling at all (scout) — the ENTIRE module is a migration candidate, unlike Engine where only some files are portable. The blocker here is size + protocol complexity + WinAPI/COM marshalling, not language coupling.
- Fingerprinting output is the highest-value characterization target — it is BAS's core product differentiator and any drift is a silent product regression, not just a test failure (user explicitly names this as a required golden-snapshot target).
- `lodepng.cpp` (PNG codec, 219KB) is a good candidate to REPLACE with a mature Rust PNG crate rather than hand-port — porting a codec line-by-line is wasted effort when `png`/`image` crates exist and are widely used; verify output-format compatibility (same PNG variant/compression settings) via the golden-file screenshot tests before swapping.
- 43 WinAPI/COM files make ChromeWorker THE primary cross-platform blocker in the whole plan (plan.md Overview) — bigger than Engine's 31. Per plan.md's cross-platform-first goal, most of these are NOT genuinely OS-specific: process-existence checks (`processcheck.h`'s `OpenProcess`) map to the cross-platform `sysinfo` crate, clipboard access maps to `arboard`, file-exists checks are already portable via `std::fs` (the current WinAPI use there is legacy, not necessary). Only fingerprinting internals that must observe REAL OS-level signals (and the Win32 tooltip/`_WIN32_IE` UI bits, if genuinely Windows-UI-specific) may have no cross-platform equivalent — those get a `#[cfg(target_os)]`-gated trait, not a blanket `windows-rs` re-wrap. Exactly which fingerprint internals fall into that category is not yet known — tracked as plan.md Unresolved Q5.
- **Phase 2 already fixed ChromeWorker's macOS-blocking call sites** (its Tier-1 priority, 36 `windows.h` files, via the new `bas-platform` crate) — that was a narrow point-fix to unblock a macOS build, not a full logic port. This phase ports the REST of ChromeWorker's business logic (fingerprinting, CDP, tab/input, capture) to Rust, and REUSES `bas-platform` (Phase 2) for any remaining cross-platform-primitive need instead of building a new `platform` submodule from scratch — see Architecture.

## Requirements
- Functional: CDP client, fingerprinting logic, tab/input control, screenshot/screencast, custom protocol handlers move to `bas-chromeworker` with byte-identical (or documented-tolerance) external behavior, especially fingerprint output.
- Non-functional: fingerprint golden-snapshot tests exist and pass BEFORE porting starts; PNG codec replacement (if done) verified byte-compatible or documented as an intentional format change with sign-off.
- **Cross-platform first (plan.md Overview):** every WinAPI/COM call site is triaged into (a) has a cross-platform crate equivalent (`sysinfo` for process checks, `arboard` for clipboard, `std::fs` for file-exists) — MUST use it, not a `windows-rs` re-wrap; or (b) genuinely OS-specific with no equivalent — gets a `#[cfg(target_os)]`-gated trait in the `platform` submodule, `windows-rs` only inside the Windows arm. A 1:1 `windows-rs` wrap of something that has a cross-platform crate equivalent is a Requirements violation, not a valid shortcut.
- macOS + Linux CI leg: `bas-chromeworker`'s non-OS-specific code (fingerprint logic minus the OS-specific trait arm, CDP client, capture logic) must compile and unit-test on macOS and Linux in CI, even though the full CEF-integrated characterization suite stays Windows-only until CEF-level cross-platform work is in scope (out of this plan — CEF itself is already cross-platform upstream, but BAS's current ChromeWorker build/packaging is Windows-only for reasons beyond this crate).

## Architecture
- **`bas-chromeworker`** (`rust/bas-chromeworker/`): single cohesive crate (scout: "self-contained... isolated from rest of codebase"; researcher-04: fingerprinting and browser control are "tightly coupled," high cohesion — splitting would cut a cohesive unit for no coupling benefit). Internal modules: `cdp` (DevTools Protocol client), `fingerprint`, `browser_control` (tabs/input), `capture` (screenshot/screencast, PNG encode), `protocol_handlers`.
- Depends on `bas-contracts` for shared DTOs (fingerprint result shape, CDP message types if shared with other crates later) AND on `bas-platform` if Phase 2 has already run (otherwise this crate owns its own `platform` submodule and Phase 2 consolidates the duplication) for cross-platform process/export-macro/OS-specific-trait primitives — this crate does NOT reimplement those; it calls `bas-platform`'s existing trait implementations.
- `platform` submodule (this crate's OWN, distinct from `bas-platform`): a THIN adapter layer for ChromeWorker-specific OS-touching capabilities `bas-platform` doesn't already cover (e.g. any fingerprint-specific signal not already generalized into `bas-platform`'s trait set) — extends `bas-platform`'s `#[cfg(target_os = "windows")]` pattern rather than inventing a parallel one. All `unsafe` confined here, never leaking into `fingerprint`/`browser_control` logic.
- PNG encode/decode via the `image` or `png` crate, behind a thin adapter matching `lodepng`'s current call sites — swap verified via golden screenshot tests before removing `lodepng.cpp`.

## Related Code Files
- `Solution/ChromeWorker/` — modify: CDP/fingerprint/browser-control/capture logic replaced with calls into `bas-chromeworker`; exact files confirmed against `ChromeWorker.pro` SOURCES during execution.
- `Solution/ChromeWorker/ChromeWorker.pro` — modify: `QMAKE_EXTRA_TARGETS` + `LIBS` per Phase 4's pattern.
- `Solution/ChromeWorker/png/lodepng.cpp` (and `png/lodepng.h`) — candidate for retirement (replaced by Rust `image`/`png` crate), removed only after byte-compatibility verified.
- **Create:** `rust/bas-chromeworker/{Cargo.toml,src/lib.rs,src/cdp.rs,src/fingerprint.rs,src/browser_control.rs,src/capture.rs,src/protocol_handlers.rs,src/platform.rs,src/bridge.rs}`.
- **Create:** `Solution/Tests/ChromeWorkerCharacterization/golden/fingerprint/` — fingerprint output snapshots across a representative device/OS/browser-version matrix.
- **Create:** `Solution/Tests/ChromeWorkerCharacterization/golden/screenshots/` — screenshot golden files for PNG-codec-swap verification.

## Implementation Steps
1. Write fingerprint golden-snapshot tests FIRST, across a representative matrix (multiple OS/browser-version/device profiles the current binary supports) — this is the module's highest-value regression gate and must exist before any other porting step.
2. Write CDP client golden tests (representative protocol message exchanges) and screenshot/screencast golden tests.
3. Build `bas-chromeworker` skeleton, no-op link into `ChromeWorker.pro`, confirm CI green.
4. Port fingerprinting logic first (highest product value, most scrutinized) — golden-test after each fingerprint dimension ported (e.g. canvas, WebGL, font, audio fingerprint components ported incrementally, not as one atomic swap).
5. Port CDP client logic, golden-test after.
6. Port tab/input control logic, golden-test after.
7. Port screenshot/screencast capture with the new PNG crate behind the `capture` adapter; run screenshot golden tests to verify byte/structural compatibility before removing `lodepng.cpp`.
8. Port custom protocol handlers, golden-test after.
9. If Phase 2 already fixed ChromeWorker’s 36 call sites via `bas-platform`, integrate them into `bas-chromeworker`’s proper module structure — they were point-patched via `bas-platform` calls from still-C++ code; now the surrounding logic is Rust too, so route through `bas-platform` directly. (If Phase 2 hasn’t run, this sub-step is skipped — the Rust port handles those call sites natively.) Triage any ADDITIONAL WinAPI usage discovered during the full port that Phase 1’s scan missed (per-file classification, same a/b/c categories). Audit no `unsafe` leaks outside `platform`/`bas-platform`.
10. Build `bas-chromeworker` (minus the Windows-only trait arms) on macOS + Linux in CI; fix any non-Windows compile/test failure in the cross-platform-equivalent code before proceeding.
11. Remove dead ported C++ source (including `png/lodepng.cpp` once verified); run full characterization suite on Windows + the new macOS/Linux unit-test legs.

## Todo List
- [ ] Fingerprint golden-snapshot matrix (current binary)
- [ ] CDP + screenshot/screencast golden tests
- [ ] `bas-chromeworker` skeleton + no-op link, CI green
- [ ] Port fingerprinting logic, per-dimension golden tests
- [ ] Port CDP client
- [ ] Port tab/input control
- [ ] Port capture (screenshot/screencast) + PNG crate swap, verify byte compatibility
- [ ] Port custom protocol handlers
- [ ] Triage 43 WinAPI/COM sites: cross-platform-crate arm vs `#[cfg(target_os = "windows")]` arm, audit `unsafe` containment
- [ ] `bas-chromeworker` builds + unit-tests green on macOS + Linux CI (non-Windows-only code)
- [ ] Remove dead C++ source incl. `png/lodepng.cpp`, full suite green (Windows + macOS/Linux legs)

## Success Criteria
- CI builds ChromeWorker against `bas-chromeworker`; full fingerprint/CDP/screenshot characterization suite passes unchanged.
- Fingerprint output is snapshot-identical (or a documented, signed-off intentional change) across the full test matrix — this is the single most scrutinized criterion per user's explicit requirement.
- PNG codec swap verified byte/structurally compatible before `png/lodepng.cpp` is removed, or the swap is deferred with `png/lodepng.cpp` kept if incompatibility is found (documented decision, not silently forced through).
- All 43 WinAPI/COM call sites are triaged and documented (cross-platform-crate arm vs justified Windows-only arm); `bas-chromeworker`'s non-Windows-only code builds and passes its unit-test suite on macOS and Linux in CI — the cross-platform readiness checkpoint for this crate (plan.md Overview).

## Risk Assessment
- **Fingerprint drift is a silent product regression** — mitigated by treating the fingerprint golden-snapshot matrix as the phase's primary gate, reviewed dimension-by-dimension, not a single aggregate diff.
- **PNG codec swap changes output bytes even if visually identical** — mitigated by explicit byte/structural verification step before removing the old codec; if the crate can't match exactly, keep `png/lodepng.cpp` rather than force an incompatible swap (YAGNI — the codec swap is a nice-to-have, not required for the migration's core goal).
- **Triage misclassifies a genuinely-portable WinAPI call as "OS-specific"** (defaulting to `windows-rs` out of caution defeats the cross-platform goal) — mitigated by requiring a documented reason (not just "seemed safer") for every `#[cfg(target_os = "windows")]` arm, reviewed against plan.md's explicit mandate that Qt-style "already portable" reasoning applies here too.
- **Cross-platform crate (`sysinfo`/`arboard`) has different error/edge-case behavior than hand-written C++ WinAPI calls** — mitigate with explicit tests for known edge cases (process-not-found, permission-denied) in the `platform` submodule's default (cross-platform) arm.
- **Scale (320 files) increases chance of an incompletely-ported code path** — mitigate by per-dimension/per-endpoint golden tests (steps 4-8) rather than one big-bang port-then-test at the end, consistent with this plan's incremental philosophy even within a single phase.

## Security Considerations
- Fingerprinting logic often touches sensitive device/browser identifiers — ensure no new logging or telemetry path is introduced during the port that persists fingerprint data beyond its current lifecycle.
- CDP is a powerful browser-control protocol — the Rust CDP client must preserve any existing access-control/handshake behavior; add a golden test for a malformed/unauthorized CDP message to prove rejection behavior is unchanged.
- WinAPI/COM `unsafe` code confined to `platform` submodule (Architecture) enables focused security review of the smallest possible unsafe surface.

## Test Strategy & Quality Gate
Lane `high-risk`.
- **Spec:** Goal — behavior-preserving migration of ChromeWorker to `bas-chromeworker`, fingerprint-output-identical. AC: Given the fingerprint test matrix, When run against the ported binary, Then output matches golden snapshots exactly; Given a CDP protocol exchange fixture, When replayed, Then responses match; Given a screenshot scenario, When captured via the new PNG path, Then output is byte/structurally equivalent. I/O contract: fingerprint JSON schema, CDP message schema, PNG byte format — all per current behavior. Out-of-scope: new fingerprint dimensions, CDP protocol version upgrades.
- **Pyramid:** ~70% unit (per fingerprint-dimension, per CDP-message-type Rust tests), ~20% integration (CDP session end-to-end against a real headless Chrome instance), ~10% e2e (full characterization suite against the real ChromeWorker binary).
- **E2E scenario:** "Launch ChromeWorker → run fingerprint capture across test matrix → diff against golden snapshots" — the phase's primary e2e gate.
- **Coverage target:** ≥90% line / ≥75% branch diff-coverage on `bas-chromeworker` new code, via `cargo tarpaulin`.
- **Evidence commands:** `cargo test -p bas-chromeworker`, `cargo tarpaulin -p bas-chromeworker --out Html`, CI log of ChromeWorkerCharacterization suite (fingerprint + CDP + screenshot) passing on Windows, plus `cargo build -p bas-chromeworker --target x86_64-apple-darwin` / `--target x86_64-unknown-linux-gnu` (or the matching CI-runner-native targets) and `cargo test -p bas-chromeworker` on macOS/Linux runners for the non-Windows-only code.

## ADR Rationale
**Decision:** Keep ChromeWorker as ONE crate (`bas-chromeworker`), not split by sub-responsibility like Engine.
**Why:** scout ("self-contained... isolated from rest of codebase") and researcher-04 ("tightly coupled," explicit recommendation) together establish fingerprinting and browser control are high-cohesion — splitting would cut across internal APIs that change together, the opposite of Engine's case where sub-responsibilities (core/scripting/registry) are independently consumed by different callers (Modules only need the registry, not scripting internals). ChromeWorker has no equivalent "different external consumers need different slices" pressure.
**Alternatives rejected:** split by CDP/fingerprint/capture (researcher-04's cohesion heuristic argues against it — no external consumer needs only one slice); hand-port `png/lodepng.cpp` line-by-line instead of swapping to a maintained crate (wasted effort porting a codec Rust already has mature libraries for — but only if byte-compatibility holds, per Risk Assessment's fallback).

**Decision (cross-platform priority):** migrate ChromeWorker 3rd among full-module-migration phases (Phase 4 `bas-browser-shell` = 1st, Phase 5 `bas-scheduling` = 2nd, this phase = 3rd; per plan.md's Migration Order Reasoning, Phase 3's characterization-tests-only phase doesn't count toward this ordinal) — ahead of what pure isolation/testability ranking would suggest relative to Scheduler's smaller size — and replace its 43 WinAPI/COM call sites with cross-platform crates (`sysinfo`, `arboard`) by default, `windows-rs` only behind a proven-necessary `#[cfg(target_os)]` arm.
**Why:** plan.md's Overview reframes the whole migration's goal as cross-platform portability, not language modernization alone — Qt is already cross-platform, so the WinAPI/COM-heaviest modules are the actual blockers. Scout ranks ChromeWorker's 43 WinAPI/COM files as the largest concentration outside Engine; deferring it to "whenever it's convenient" would leave the biggest cross-platform blocker unresolved the longest. A 1:1 `windows-rs` wrap (this phase's original design) would have satisfied the language-migration goal but NOT the cross-platform goal — the crate would still only run on Windows.
**Alternatives rejected:** migrate ChromeWorker later, after Engine (would leave the largest cross-platform blocker unresolved for the plan's longest phase-stretch); wrap all 43 WinAPI/COM sites in `windows-rs` uniformly (fast to write, but achieves zero cross-platform progress — directly contradicts the user's stated end-goal).

## Next Steps
- Phase 7 begins Engine work — the interop pattern has now been proven at 3 scales (29 files, ~130 files, ~320 files); Engine's 760 files and 100+ public APIs are the last and hardest scale-up, hence the dedicated discovery sub-phase before any Rust code touches it.
- If the WinAPI triage (Implementation Steps step 9) finds fingerprint internals with no cross-platform equivalent, record exactly which ones in plan.md's Unresolved Q5 — that question stays open until this phase's triage produces a real answer, not a guess made before the code is read.
- Phase 8 (`bas-engine-core`) reuses this phase's `platform`-submodule trait pattern (default cross-platform arm + `#[cfg(target_os)]` fallback) for Engine's own WinAPI/WinSock usage — do not reinvent the pattern there.
