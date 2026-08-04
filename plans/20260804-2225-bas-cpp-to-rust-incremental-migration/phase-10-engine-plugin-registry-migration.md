# Phase 10: Engine Migration — Plugin Registry (`bas-engine-plugin`)

## Context Links
- `phase-07-engine-boundary-discovery.md` — the `plugin-registry` interface, validated in Phase 7 step 3-4 against a real sample Module.
- `phase-08-engine-core-migration.md` / `phase-09-engine-script-migration.md` — both must exist first; the registry mediates between scripting execution and Modules' functions.
- `scout/scout-01-module-map.md` — Modules are "deeply embedded in script function registry (Engine-coupled at integration point)" (scout-01, Modules section) and "Engine is the bottleneck: Core library consumed by ... all 40 Modules (via registration). Any migration must address Engine first or design robust FFI layer" (scout-01, Cross-Module Dependency Map) — paraphrased in this plan as "cannot move meaningfully before Engine exposes a stable interop boundary."

## Overview
- **Priority:** P1 — the unblocking phase. This is the LAST Engine sub-crate, deliberately sequenced last (per plan.md's reasoning: stabilize it last to minimize churn on the interface 40 Modules bind to).
- **Status:** pending. Depends on Phases 8-9 complete.
- Scope: port the script-function/plugin registration and lookup mechanism to `bas-engine-plugin`. This crate's public interface is what Phase 11's Modules migrate against.

## Key Insights
- This is the most consequential interface in the whole migration in terms of blast radius — 40 Modules (Phase 11) and `FastExecuteScript` (also unblocked here per scout) all bind to it. Getting it stable matters more than getting it "elegant" — prefer a conservative, closely-current-behavior-matching interface over a redesigned one (redesign temptation is explicitly out of scope, YAGNI — this migration preserves behavior, it doesn't redesign the plugin API).
- Phase 7 already validated one sample Module against the extracted C++ interface — this phase's job is to port that SAME interface's implementation to Rust, not to change its shape.
- **Correction from Phase 1's investigation:** Modules are NOT loaded via COM or a Windows-only mechanism — `Solution/Engine/modulemanager.cpp` loads each Module DLL via Qt's `QLibrary` (`->load()`, `->resolve()`), which is already cross-platform (`.dll`/`.dylib`/`.so` transparently). This phase does NOT need to replace the loading mechanism with `libloading` or any Rust-native loader — `modulemanager.cpp`'s QLibrary-based loading can stay in C++/Qt indefinitely (it works fine on all 3 platforms already) and simply CALL INTO `bas-engine-plugin`'s registry (via `cxx`) to register each resolved function pointer, once loaded. Only the registration-TABLE and dispatch-LOGIC move to Rust in this phase, not the DLL-loading step itself.
- Because Modules are DLLs loaded at runtime and registered via `modulemanager.cpp` (scout: "registered with Engine at link time" — imprecise; the actual mechanism is `QLibrary`-based runtime loading + symbol resolution, confirmed above), the Rust registry must expose a C-ABI-compatible (or `cxx`-bridged, since the caller stays C++/Qt) registration entry point for OLD, not-yet-migrated Modules to keep working DURING Phase 11's incremental rollout — this phase cannot assume all 40 Modules migrate atomically.

## Requirements
- Functional: script-function registration and lookup moves to `bas-engine-plugin`, exposing a stable interface that (a) `bas-engine-script` (Phase 9) calls to look up/invoke registered functions, and (b) BOTH not-yet-migrated C++ Modules AND future Rust-ported Modules (Phase 11) can register against, simultaneously, during the incremental Phase-10 rollout.
- Non-functional: characterization tests prove the registry accepts/dispatches to the SAME set of registered functions before and after the port, using the existing 40 Modules as the real-world registration corpus (not synthetic stand-ins).
- Backward-compatible C-ABI registration entry point (via `cbindgen`-generated header, since this is the one case researcher-02 identifies as the right tool: "Rust module's self-contained... use when Rust code is self-contained" and callers are legacy C++) so old-format Modules keep working mid-rollout.

## Architecture
- **`bas-engine-plugin`** (`rust/bas-engine-plugin/`): modules `registry` (registration table, lookup), `dispatch` (invocation dispatch to registered functions, whether the function itself is still C++ or now Rust).
- Depends on `bas-contracts` for the shared function-signature/argument-marshalling DTOs.
- Exposes TWO surfaces: (1) a `cxx` bridge for `bas-engine-script` to call in-process (Rust-to-Rust once Phase 9 done), (2) a `cbindgen`-generated C header for legacy C++ Modules' registration calls (Rust-to-C, per researcher-02's recommended tool for this exact direction).
- Dispatch layer is function-signature-agnostic where possible (generic marshalling via `bas-contracts` DTOs) so Phase 11 can migrate Modules one at a time without changing the registry itself per-Module.

## Related Code Files
- `/Users/nguyendk/Documents/projects/me/bas/Solution/Engine/` — files classified `plugin-registry` in `docs/engine-boundary-map.md` (the interface Phase 7 already extracted and validated against a sample Module).
- `/Users/nguyendk/Documents/projects/me/bas/Solution/Engine/Engine.pro` — modify: extend `QMAKE_EXTRA_TARGETS`/`LIBS` for `bas-engine-plugin`.
- `/Users/nguyendk/Documents/projects/me/bas/Solution/Modules/` — read-only reference during testing (the 40 existing DLLs are the registration-compatibility test corpus; not modified in this phase — that's Phase 11).
- **Create:** `/Users/nguyendk/Documents/projects/me/bas/rust/bas-engine-plugin/{Cargo.toml,src/lib.rs,src/registry.rs,src/dispatch.rs,src/bridge.rs,src/c_abi.rs,cbindgen.toml}`.
- **Create:** `/Users/nguyendk/Documents/projects/me/bas/Solution/Tests/EnginePluginCharacterization/golden/` — registration/dispatch golden fixtures using real Module function signatures.

## Implementation Steps
1. Re-verify Phase 7's sample-Module validation still holds (re-run it against current `main`).
2. Write characterization tests: register a representative subset of the 40 real Modules' functions (varied signatures — string args, numeric, callback-style if any) against the CURRENT C++ registry, capture golden dispatch behavior (success + error/not-found cases).
3. Build `bas-engine-plugin` skeleton with the `cxx` bridge (for Phase 9's script-execution caller) and `cbindgen`-generated C header (for legacy Module registration), no-op link, CI green.
4. Port the registration-table logic, golden-test against the representative Module subset.
5. Port the dispatch logic, golden-test.
6. Register ALL 40 existing (still-C++) Modules against the new Rust registry via the `cbindgen` C-ABI path — full-corpus validation, not just the representative subset from step 2.
7. Confirm `bas-engine-script` (Phase 9) successfully looks up and invokes functions through the new registry end-to-end.
8. Remove dead ported C++ registry source; run full characterization suite + a full-corpus script that exercises every registered Module function at least once.

## Todo List
- [ ] Re-verify Phase 7 sample-Module validation
- [ ] Golden dispatch tests, representative Module subset
- [ ] `bas-engine-plugin` skeleton: `cxx` bridge + `cbindgen` C header, CI green
- [ ] Port registration-table logic
- [ ] Port dispatch logic
- [ ] Register all 40 existing Modules via C-ABI path, full-corpus validation
- [ ] Confirm `bas-engine-script` end-to-end lookup/invoke
- [ ] Remove dead C++ registry source, full suite green

## Success Criteria
- All 40 existing (unmigrated) C++ Modules register and dispatch successfully against the new Rust registry via the `cbindgen` C-ABI path — zero Modules broken by this phase, evidenced by a full-corpus run exercising every Module's registered functions.
- `bas-engine-script` invokes registered functions through the new registry with identical results to the pre-port registry (golden-test comparison).
- The C-ABI surface is documented (`docs/engine-plugin-c-abi.md` or inline in `rust/bas-engine-plugin/README.md`) well enough that Phase 11 can register a NEWLY Rust-ported Module without re-deriving the contract.

## Risk Assessment
- **Breaking even one of the 40 Modules' registration would be a hard regression** (all 40 depend on this) — mitigated by the full-corpus validation in step 6, not just the representative subset; this is the phase's highest-stakes single check.
- **Generic dispatch marshalling (Architecture) undershoots a Module with an unusual function signature** — mitigate by surveying signature variety across all 40 Modules BEFORE finalizing the dispatch design (part of step 2's characterization work), not discovering an edge case mid-port.
- **cbindgen C-ABI surface drifts from the `cxx` bridge's Rust-side types**, causing double-maintenance — mitigate by generating both from the SAME `bas-contracts` type definitions, never hand-duplicating a signature in two places.

## Security Considerations
- The plugin registry is a DLL-loading trust boundary — verify the Rust registry doesn't loosen any existing check on which Modules are trusted to register (e.g. path validation, signature checks if any exist today); if the current C++ implementation has NO such check, that is a pre-existing gap, not a regression this phase introduces — document rather than silently fix beyond scope.
- `unsafe` C-ABI surface (`c_abi.rs`) is the largest unsafe-code concentration point in Phase 8-9 (raw function pointers from legacy Modules) — isolate it as tightly as `bas-chromeworker`'s `platform` submodule was isolated in Phase 6, and review it with the same scrutiny.

## Test Strategy & Quality Gate
Lane `high-risk`.
- **Spec:** Goal — port the plugin registry to Rust with a stable, backward-compatible interface all 40 existing Modules and future Rust-ported Modules can bind to. AC: Given all 40 existing Modules' registration calls, When run against the new Rust registry, Then every one registers and dispatches successfully; Given `bas-engine-script`'s lookup/invoke calls, When run end-to-end, Then results match the pre-port registry. I/O contract: function-registration signature (name, arg types, return type) and dispatch invocation shape — unchanged from current C++ registry's public contract. Out-of-scope: redesigning the registration API, migrating any actual Module logic (Phase 11).
- **Pyramid:** ~70% unit (registry/dispatch logic in isolation), ~20% integration (real Module DLL registration via the C-ABI path), ~10% e2e (full 40-Module corpus + `bas-engine-script` end-to-end).
- **E2E scenario:** "Load all 40 existing Module DLLs, register against the new Rust registry, execute one representative script per Module category, verify output matches golden" — the phase's primary e2e gate.
- **Coverage target:** ≥90% line / ≥75% branch diff-coverage on `bas-engine-plugin` new code, via `cargo tarpaulin`.
- **Evidence commands:** full 40-Module registration/dispatch run output, `cargo test -p bas-engine-plugin`, `cargo tarpaulin -p bas-engine-plugin --out Html`, `bas-engine-script` end-to-end lookup/invoke test output.

## ADR Rationale
**Decision:** Expose `bas-engine-plugin`'s legacy-facing surface via `cbindgen`-generated plain C ABI, not a hand-written `cxx` bridge, for the (still-C++) Module registration path.
**Why:** researcher-02 explicitly recommends `cbindgen` for exactly this direction ("Rust module → C++ caller... use when Rust code is self-contained") — the registry is self-contained Rust being called by 40 pieces of legacy C++ that are NOT migrating in this phase. `cxx` would require touching each of the 40 Modules' call sites now, which is Phase 11's job, not this one — using `cbindgen` here keeps this phase's blast radius to the registry itself, consistent with the plan's incremental philosophy at the sub-phase level too.
**Alternatives rejected:** hand-written `cxx` bridge for all 40 Modules now (would collapse Phase 10 and Phase 11 into one giant change, violating "never big-bang" even within Engine's own sub-phases); redesigning the registration API while porting (rejected — YAGNI, adds risk with no requirement driving it).

## Next Steps
- Phase 11 (Modules migration) is now unblocked — every Module can migrate opportunistically against this phase's stable `cxx`-facing interface (for newly-ported Modules) while old Modules keep working via the `cbindgen` C-ABI path.
- `FastExecuteScript` (scout: "CRITICAL BLOCKER... blocked on Engine's script execution pipeline") is also unblocked now that both `bas-engine-script` (Phase 9) and `bas-engine-plugin` (this phase) exist — addressed in Phase 11 as a thin binary, not a new crate.
