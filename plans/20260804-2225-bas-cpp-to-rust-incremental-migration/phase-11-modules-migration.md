# Phase 11: Plugin Modules Migration (`bas-modules`) + FastExecuteScript

## Context Links
- `phase-10-engine-plugin-registry-migration.md` — stable registry interface this phase migrates Modules against.
- `scout/scout-01-module-map.md` — 40 plugin Modules (Archive, Checksum, Clipboard, Database, DateTime, Excel, FileSystem, FTP, ImageProcessing, JSON, List, Path, PhoneVerification, Processes, Profiles, ReCaptcha, RegularExpression, Resources, ScriptStats, SQL, String, Telegram, Timezones, URL, etc.), "individually low-coupling... minimal inter-module coupling." FastExecuteScript: "CRITICAL BLOCKER... blocked on Engine's script execution pipeline," now unblocked.
- `plan.md` — `bas-modules` crate definition (single consolidated crate, not 40).

## Overview
- **Priority:** P2 — opportunistic, not blocking anything downstream (this is the last consumer-facing migration wave before cleanup). Can slip in schedule without blocking Phase 12's Engine-adjacent work.
- **Status:** pending. Depends on Phase 10 complete.
- Scope: migrate the 40 plugin DLLs' script functions into `bas-modules`, registered against `bas-engine-plugin`'s stable interface; fold `FastExecuteScript` into a thin binary against `bas-engine-script`.

## Key Insights
- Scout confirms these are individually low-coupling, non-Qt (`QT -= gui` in every `.pro`), pure algorithmic utility code — the LOWEST-RISK migration content in the entire plan by coupling profile, even though there are 40 of them.
- Because Phase 10 built a backward-compatible C-ABI registration path, Modules can migrate ONE AT A TIME, in any order, with old and new Modules coexisting — this is the plan's best opportunity for genuine within-phase parallelism (unlike every prior phase, which was internally sequential due to shared-file/shared-behavior dependencies).
- `Timezones` (590KB `tmap.cpp`, geographic data) and `ImageProcessing` (uses Windows GDI per scout) are the two outliers in this otherwise uniform module set — `tmap.cpp` is mostly DATA (verify: a Rust geographic-timezone crate, e.g. `tzf-rs` or `chrono-tz`, may replace it entirely rather than porting 590KB of C++ data tables); `ImageProcessing`'s GDI usage extends `bas-platform`'s (Phase 2) `#[cfg(target_os)]` trait pattern rather than a from-scratch `windows-rs` wrap. `Timezones` ALSO carries the second real `windows.h`/WinSock include found in Phase 1 — `Timezones/dll/maxminddb.c:20-21` (`#include <windows.h>` + `#include <ws2ipdef.h>`), a vendored MaxMindDB C library file fixed in Phase 2's Tier 3, separate from `tmap.cpp`'s data-table question; this phase should confirm `maxminddb.c`'s Phase-2 fix is compatible with whatever `Timezones` crate/adapter decision (below) is made, not treat the two as unrelated.
- **Phase 2 already fixed the trivial part of this phase's cross-platform story**: the 9 Modules with `__declspec`-only "COM-flagged" export headers (`DateTime`, `Timezones`, `Processes`, `FileSystem`, `ImageProcessing`, `FontPack`, `RegularExpression`, `UserNotification`, `CurlWrapper`) got a portable export macro in Phase 2's Tier 3, and the two real `windows.h` files (`UserNotification/dll/moduledll.cpp`, `Timezones/dll/maxminddb.c`) were fixed there too. Phase 1 also confirmed the plugin LOADING mechanism (`modulemanager.cpp`'s `QLibrary`) is already cross-platform, not COM-based — so this phase's scope is exactly what scout always said it was (low-coupling script-function ports), with no plugin-loader redesign hiding inside it.
- `FastExecuteScript` (scout: thin Engine wrapper, ~30 files) gets NO dedicated crate — it becomes a minimal Rust binary crate (not a library) directly linking `bas-engine-script` + `bas-engine-plugin`, per plan.md's architecture decision.

## Requirements
- Functional: each of the 40 Modules' script functions is available via `bas-modules`, registered against `bas-engine-plugin`, producing identical results to the current C++ implementation for the same inputs.
- Non-functional: per-Module characterization tests (golden input/output pairs covering each Module's exposed functions) exist and pass before that Module's port starts — same discipline as every prior phase, applied per-Module here since Modules are independent units.
- `FastExecuteScript` behaves identically as a thin binary against the new Rust core.

## Architecture
- **`bas-modules`** (`rust/bas-modules/`): one crate, internal module-per-domain matching the current 40 (e.g. `src/archive.rs`, `src/checksum.rs`, ... `src/timezones.rs`, `src/image_processing.rs`) — NOT 40 separate crates (researcher-04's anti-fragmentation guidance applies most directly here, given the literal 1:1 module count temptation).
- Each internal module registers its functions against `bas-engine-plugin`'s registry via the `cxx` bridge (Phase 4's pattern) since these are new Rust-native registrations, not legacy C++ ones.
- `ImageProcessing`'s WinAPI/GDI calls go through `bas-platform` (Phase 2), extended with a GDI-specific trait arm if `bas-platform`'s existing set doesn't already cover it — same reuse discipline as Phase 6/8, not a fresh `windows-rs` wrap.
- `Timezones` evaluated for replacement by a maintained Rust crate (`chrono-tz` or similar) vs hand-port of `tmap.cpp`'s data tables — decision recorded once made (Implementation Steps).
- `FastExecuteScript` becomes `rust/bas-fastexecute/` — a `[[bin]]`-only crate (no library surface), depending on `bas-engine-script` + `bas-engine-plugin` directly. This is the one exception to "everything is a lib crate" in the workspace, justified by it having zero reusable logic of its own (thin wrapper by scout's own description).

## Related Code Files
- `/Users/nguyendk/Documents/projects/me/bas/Solution/Modules/` — modify: each of the ~40 subdirectories (Archive, Checksum, Clipboard, Database, DateTime, Excel, FileSystem, FTP, ImageProcessing, JSON, List, Path, PhoneVerification, Processes, Profiles, ReCaptcha, RegularExpression, Resources, ScriptStats, SQL, String, Telegram, Timezones, URL, etc.) replaced with a thin registration shim calling `bas-modules`, or (preferred, per Phase 10's design) directly retired in favor of native Rust registration.
- `/Users/nguyendk/Documents/projects/me/bas/Solution/FastExecuteScript/` — modify: replaced with a thin binary shim calling `bas-fastexecute`.
- **Create:** `/Users/nguyendk/Documents/projects/me/bas/rust/bas-modules/{Cargo.toml,src/lib.rs,src/<40 domain modules>.rs,src/platform.rs}`.
- **Create:** `/Users/nguyendk/Documents/projects/me/bas/rust/bas-fastexecute/{Cargo.toml,src/main.rs}`.
- **Create:** `/Users/nguyendk/Documents/projects/me/bas/Solution/Tests/ModulesCharacterization/golden/<per-module>/` — per-Module golden fixtures.

## Implementation Steps
1. Rank the 40 Modules by risk/complexity (file size, WinAPI/GDI usage, data-table size) using scout's inventory — batch into waves (see Parallel Execution Matrix below); pure-algorithmic modules with no OS dependency go first/in-parallel, `ImageProcessing`/`Timezones` handled as their own tracked items.
2. For each Module (or batch): write golden input/output characterization tests against the current C++ DLL, covering its exposed script functions with realistic argument ranges (including error/edge cases — empty input, malformed input, boundary values).
3. Port the Module's logic into its `bas-modules` internal module, register via `cxx` against `bas-engine-plugin`, golden-test.
4. For `ImageProcessing`: build the `platform` GDI submodule first (mirrors Phase 6), then port logic.
5. For `Timezones`: evaluate `chrono-tz`/equivalent against `tmap.cpp`'s actual data coverage; if compatible, replace with the crate + a thin adapter; if gaps exist, hand-port the data tables. Record the decision. Confirm `maxminddb.c`'s Phase-2 fix (separate WinSock/windows.h issue, not the data-table question) still integrates cleanly with whichever `tmap.cpp` decision is made.
6. Build `bas-fastexecute` as a thin binary against `bas-engine-script`/`bas-engine-plugin`, golden-test against `FastExecuteScript`'s current behavior.
7. Retire each ported Module's old C++ DLL project once its golden tests pass; keep unported Modules building as-is (coexistence, per Phase 10's backward-compat registry).
8. After all 40 + FastExecuteScript are ported, run the full corpus (all Modules' functions exercised via representative scripts) end-to-end.

## Todo List
- [ ] Rank + batch the 40 Modules by risk/complexity
- [ ] Per-Module golden characterization tests (all 40)
- [ ] Port + register each Module against `bas-engine-plugin` (`cxx`)
- [ ] `ImageProcessing`: `platform` GDI submodule + port
- [ ] `Timezones`: crate-vs-hand-port decision + implementation
- [ ] `bas-fastexecute` thin binary, golden-test against current `FastExecuteScript`
- [ ] Retire ported Modules' old C++ DLL projects incrementally
- [ ] Full 40-Module + FastExecuteScript corpus run, end-to-end

## Success Criteria
- All 40 Modules' script functions produce golden-identical output via `bas-modules`, evidenced by the full corpus run.
- `bas-fastexecute` behaves identically to the current `FastExecuteScript` on its own characterization suite.
- No unported Module is broken during the incremental rollout (coexistence proven at every intermediate commit, not just the final state).

## Risk Assessment
- **40 independent migrations increase total surface for a missed edge case** — mitigated by per-Module golden tests covering error/edge cases explicitly (step 2), not just happy-path.
- **`Timezones` data-table replacement introduces subtle geographic/DST edge-case drift** — mitigated by exhaustive golden tests across timezone boundaries/DST transitions before accepting the crate-based replacement; fall back to hand-port if any drift is found (documented in step 5).
- **Parallel migration of independent Modules still shares the `bas-modules` crate's Cargo.toml / build** — file-level ownership must be respected (Parallel Execution Matrix below) to avoid merge conflicts on shared crate scaffolding.

## Security Considerations
- `FileSystem`, `Processes`, `Registry`(if present)-adjacent Modules touch OS-level resources directly from user scripts — verify the Rust port preserves any existing sandboxing/permission checks; do not silently widen what a script can do to the host OS.
- `Telegram`/`URL`/network-facing Modules — preserve existing network-request validation/timeout behavior; golden-test a malformed/malicious-input case for each network-facing Module.
- `ReCaptcha`/`PhoneVerification` Modules likely handle third-party API credentials — verify no credential logging is introduced during the port.

## Test Strategy & Quality Gate
Lane `high-risk`.
- **Spec:** Goal — migrate all 40 Modules + FastExecuteScript to Rust, output-identical, coexisting safely with any not-yet-migrated Module during rollout. AC: Given each Module's golden input/output fixtures, When invoked via `bas-modules`' registration, Then output matches; Given the full 40-Module corpus, When exercised end-to-end, Then all pass; Given `bas-fastexecute`, When run against its characterization suite, Then behavior matches `FastExecuteScript`. I/O contract: each Module's script-function signature (args/return types) unchanged from current DLL exports. Out-of-scope: new Module functions, behavior changes, Module API redesign.
- **Pyramid:** ~80% unit (per-function, per-Module), ~15% integration (registration + dispatch via `bas-engine-plugin`), ~5% e2e (full 40-Module corpus).
- **E2E scenario:** "Run a script exercising every one of the 40 Modules' primary functions end-to-end, verify all outputs against golden."
- **Coverage target:** ≥90% line / ≥75% branch diff-coverage on `bas-modules`/`bas-fastexecute` new code, via `cargo tarpaulin`.
- **Evidence commands:** per-Module golden-diff output, full-corpus run output, `cargo test -p bas-modules -p bas-fastexecute`, `cargo tarpaulin -p bas-modules -p bas-fastexecute --out Html`.

## ADR Rationale
**Decision:** One consolidated `bas-modules` crate for all 40 Modules; `FastExecuteScript` as a bin-only crate with no library surface, not folded into `bas-modules`.
**Why:** researcher-04's anti-fragmentation guidance is most directly at stake here — 40 is the literal count that would produce Tokio's documented small-crate regret if mirrored 1:1; scout's own "individually low-coupling" finding means grouping them costs nothing in coupling terms while saving significant cross-crate version/build overhead. `FastExecuteScript` stays separate from `bas-modules` because it's a BINARY entry point (a `main.rs`, not a library of functions), a different Cargo target type — mixing it into `bas-modules` would conflate "library of script functions" with "process entry point," two different concerns.
**Alternatives rejected:** one crate per Module (40 crates — directly contradicts researcher-04's central recommendation); folding `FastExecuteScript` into `bas-engine-script` itself (rejected — `bas-engine-script` is a library other crates depend on; adding a `[[bin]]` target there conflates library and executable concerns for one specific caller).

## Parallel Execution Matrix
Within this phase, the 40 Modules are mutually independent (scout: "minimal inter-module coupling") — batched by risk tier, ≤4 per wave per `parallel-execution.md` §4 default cap:

| Unit | Owns (globs/files) | Depends On | Wave | Verify |
|---|---|---|---|---|
| modules-batch-1 (JSON, String, List, Path) | `rust/bas-modules/src/{json,string,list,path}.rs` | phase-10 | 0 | test |
| modules-batch-2 (Checksum, DateTime, RegularExpression, URL) | `rust/bas-modules/src/{checksum,datetime,regex,url}.rs` | phase-10 | 0 | test |
| modules-batch-3 (Archive, FileSystem, FTP, Clipboard) | `rust/bas-modules/src/{archive,filesystem,ftp,clipboard}.rs` | phase-10 | 0 | test |
| modules-batch-4 (Database, SQL, Excel, Resources) | `rust/bas-modules/src/{database,sql,excel,resources}.rs` | phase-10 | 0 | test |
| modules-batch-5 (Processes, Profiles, ScriptStats, remaining utility modules) | `rust/bas-modules/src/{processes,profiles,scriptstats,...}.rs` | phase-10 | 0 | test |
| modules-imageprocessing (GDI, own platform submodule) | `rust/bas-modules/src/{image_processing,platform}.rs` | phase-10 | 0 | test |
| modules-timezones (data-table decision) | `rust/bas-modules/src/timezones.rs` | phase-10 | 0 | test |
| modules-network (Telegram, PhoneVerification, ReCaptcha — credential handling, extra security review) | `rust/bas-modules/src/{telegram,phoneverification,recaptcha}.rs` | phase-10 | 0 | test |
| bas-fastexecute | `rust/bas-fastexecute/**` | phase-10 (bas-engine-script, bas-engine-plugin) | 0 | test |
| modules-full-corpus-verify | `Solution/Tests/ModulesCharacterization/**` (read/aggregate only) | all modules-batch-*, modules-imageprocessing, modules-timezones, modules-network | 1 | test |

All wave-0 units own disjoint files inside `rust/bas-modules/src/` — no two batches touch the same domain file. `Cargo.toml`'s member/dependency list is a single shared file; whichever batch lands first adds the crate skeleton, subsequent batches only add their own `mod` lines — treat that one line-range as a serialize point (append-only, low conflict risk) rather than a full-crate lock.

## Next Steps
- Phase 12 begins once all 40 Modules + FastExecuteScript are migrated (or explicitly deferred with documented reasons, per "opportunistic" priority) — final consolidation assumes this phase is functionally complete, not necessarily 100% of Modules ported if some are deprioritized (record any deferred Modules explicitly, do not let them silently vanish from tracking).
