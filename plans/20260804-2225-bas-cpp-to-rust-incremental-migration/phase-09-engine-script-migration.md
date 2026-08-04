# Phase 09: Engine Migration — Scripting (`bas-engine-script`)

## Context Links
- `phase-07-engine-boundary-discovery.md` — starts from `docs/engine-boundary-map.md`'s `scripting` interface.
- `phase-08-engine-core-migration.md` — `bas-engine-core` must exist first; scripting execution calls into resource management/browser-control.
- `scout/scout-01-module-map.md` — `scriptworker.cpp` (116KB) — Engine's single largest file, "script compilation/execution."

## Overview
- **Priority:** P1 — highest-risk single piece of the entire migration. Scriptworker is BAS's core value proposition (script execution IS the product); this phase gets the most scrutiny and the deepest characterization tests of any phase in the plan.
- **Status:** pending. Depends on Phase 8 complete.
- Scope: port script compilation/execution pipeline (everything Phase 7 classified as `scripting`) to `bas-engine-script`.

## Key Insights
- The existing `Solution/Tests` suite covers ONLY resource/copy logic (scout) — scripting execution has ZERO existing test coverage despite being the largest, most critical file. This phase's characterization-test requirement is therefore the heaviest in the plan: user's constraint 4 explicitly calls out "golden-file tests capturing current CLI/script execution behavior" as a named example.
- `scriptworker.cpp`'s 116KB size means it likely has internal seams (parsing vs execution vs variable/state management) that Phase 7 deliberately did NOT split further (YAGNI at discovery time). This phase may need its OWN mini-discovery step before porting, scoped to just this one file/area — smaller and lower-risk than Phase 7's full-Engine discovery since the outer boundary (scripting vs core vs plugin-registry) is already fixed.
- Scripting execution is where BAS's automation scripts (the actual user-authored content BAS runs) get interpreted — behavior changes here are directly visible to end users, not just internal API consumers. Golden tests must cover a REALISTIC range of user script patterns, not just trivial smoke scripts.

## Requirements
- Functional: script compilation/execution pipeline moves to `bas-engine-script`, calling into `bas-engine-core` for resource/browser-control needs, with execution output/side-effects identical to the current implementation across a representative script corpus.
- Non-functional: golden characterization tests capturing CLI/script execution behavior exist and pass BEFORE porting starts (hard blocker, per user's constraint 4, applied here at the highest-stakes point in the plan).
- Performance: script execution latency/throughput must not regress materially (script execution is a runtime-critical path, not just correctness-critical) — benchmark before/after.

## Architecture
- **`bas-engine-script`** (`rust/bas-engine-script/`): modules `parser` (script parsing/compilation), `executor` (execution engine, the scriptworker core loop), `runtime_state` (variable/state management during execution).
- Calls into `bas-engine-core` (Phase 8) for resource access/browser-control via the established `cxx` pattern.
- Depends on `bas-contracts` for script AST/result DTOs shared with `plugin-registry` (Phase 10) and eventually `FastExecuteScript`'s thin binary (Phase 11).
- If the mini-discovery (Key Insights) finds `scriptworker.cpp` needs sub-splitting, split INSIDE this crate as internal modules first — do not create additional top-level *library* crates for it (respects plan.md's committed 9-library-crate scope; the sole documented exception is `bas-fastexecute`, a `[[bin]]`-only 10th workspace member with zero reusable logic of its own, per Phase 11 — that exception does not license further crate-count growth here).

## Related Code Files
- `/Users/nguyendk/Documents/projects/me/bas/Solution/Engine/scriptworker.cpp` — primary migration target (confirm exact path/name against current `Engine.pro` SOURCES at execution time — file may have moved/renamed since scout's inventory).
- `/Users/nguyendk/Documents/projects/me/bas/Solution/Engine/` — other files classified `scripting` in `docs/engine-boundary-map.md`.
- `/Users/nguyendk/Documents/projects/me/bas/Solution/Engine/Engine.pro` — modify: extend the `QMAKE_EXTRA_TARGETS`/`LIBS` rule to include `bas-engine-script`.
- `/Users/nguyendk/Documents/projects/me/bas/docs/engine-boundary-map.md` — read/update if the `scripting` boundary needs correction.
- **Create:** `/Users/nguyendk/Documents/projects/me/bas/rust/bas-engine-script/{Cargo.toml,src/lib.rs,src/parser.rs,src/executor.rs,src/runtime_state.rs,src/bridge.rs}`.
- **Create:** `/Users/nguyendk/Documents/projects/me/bas/Solution/Tests/EngineScriptCharacterization/golden/` — script execution golden outputs across the representative corpus.
- **Create:** `/Users/nguyendk/Documents/projects/me/bas/Solution/Tests/EngineScriptCharacterization/corpus/` — the representative script-pattern test corpus itself (checked-in fixture scripts).

## Implementation Steps
1. Assemble a representative script corpus (in collaboration with whoever knows BAS's scripting DSL best — real user-pattern scripts, not synthetic trivial ones): control flow, resource access, browser-control calls, error/exception scripts, edge-case scripts (empty, malformed, deeply nested).
2. Capture golden execution output (return values, side effects, error messages) for the corpus against the CURRENT unmodified `scriptworker.cpp`, running on the Phase-1 CI baseline.
3. Benchmark current execution latency/throughput on the corpus — baseline for the performance non-functional requirement.
4. Mini-discovery: analyze `scriptworker.cpp`'s internal structure for parser/executor/state seams (Key Insights) — document as an addendum to `docs/engine-boundary-map.md`, scoped to this file only.
5. Build `bas-engine-script` skeleton, no-op link, CI green.
6. Port the parser first (input: script text, output: AST — cleanest sub-boundary, easiest to golden-test in isolation).
7. Port the executor, golden-testing against the corpus incrementally (one corpus category — e.g. control-flow scripts — at a time, not all-at-once).
8. Port runtime/state management, golden-test after.
9. Re-run the performance benchmark from step 3; investigate any material regression before proceeding.
10. Remove dead ported C++ source; run full corpus suite + existing `Solution/Tests` suite (confirm scripting changes didn't regress resource tests via any shared code path).

## Todo List
- [ ] Assemble representative script corpus
- [ ] Capture golden execution output (current binary)
- [ ] Baseline performance benchmark
- [ ] Mini-discovery: parser/executor/state seams in `scriptworker.cpp`
- [ ] `bas-engine-script` skeleton + no-op link, CI green
- [ ] Port parser, golden-test
- [ ] Port executor, golden-test per corpus category
- [ ] Port runtime/state management, golden-test
- [ ] Re-benchmark performance, investigate regressions
- [ ] Remove dead C++ source, full suite + existing 400-case suite green

## Success Criteria
- Full script corpus produces identical golden output on the Rust-ported executor — the plan's single most user-visible regression gate.
- Performance benchmark shows median execution latency and throughput within 10% of the Phase-1-baseline C++ measurement across the full corpus (default threshold; revise downward only with a documented, reviewed sign-off from whoever owns BAS's performance expectations — recorded in the corpus README before this phase is declared done, never left unset).
- Existing `Solution/Tests` 400-case suite still passes (confirms no cross-contamination between scripting and resource-management code paths).
- `bas-engine-script` builds and its unit test suite (not the full CEF/CDP-dependent characterization suite, which stays Windows-only until Phase 6/8's platform work lands) passes in CI on macOS and Linux, alongside Windows — cross-platform readiness checkpoint per plan.md's Overview (this crate has no WinAPI dependency, so this should be the cheapest checkpoint in the plan).

## Risk Assessment
- **Highest-risk phase in the entire plan** (scriptworker is BAS's core value prop, zero prior coverage, largest single file) — mitigated by the heaviest characterization-test investment of any phase (steps 1-3 before any porting) and by porting in the smallest sub-increments the mini-discovery allows (parser → executor → state, not one atomic swap).
- **Representative corpus misses a real user script pattern** — mitigated by sourcing the corpus from real usage patterns (not invented from scratch) wherever such examples exist (e.g. BAS community scripts, support tickets, existing `.pro`/example projects in the repo if any); document corpus provenance and known gaps explicitly rather than claiming full coverage.
- **Performance regression from language/runtime switch** — mitigated by the explicit before/after benchmark (steps 3, 9) rather than assuming Rust is "automatically faster."

## Security Considerations
- Script execution is the product's most powerful capability (arbitrary user-authored automation) — any parser/executor bug introduced during the port could be a sandbox-escape or injection risk; review the ported parser specifically for input-validation parity with the current implementation (do not silently loosen what's accepted).
- Error messages surfaced from script execution failures must not leak new internal details (file paths, memory addresses) that the current C++ implementation doesn't expose.

## Test Strategy & Quality Gate
Lane `high-risk`.
- **Spec:** Goal — port script compilation/execution to Rust, output-identical across a representative corpus, no material performance regression. AC: Given each corpus script, When executed by the Rust-ported pipeline, Then output/side-effects/error-messages match the golden baseline; Given the performance benchmark suite, When re-run post-port, Then latency/throughput is within the documented threshold of baseline. I/O contract: script text in, execution result (value/side-effects/error) out, per the current scriptworker's public contract. Out-of-scope: new script-language features, performance IMPROVEMENTS beyond "no regression" (nice-to-have, not required).
- **Pyramid:** ~70% unit (parser/executor/state, isolated), ~20% integration (full pipeline against corpus subsets), ~10% e2e (full corpus + existing 400-case suite).
- **E2E scenario:** "Run the full representative script corpus end-to-end through the ported pipeline, diff every output against golden" — the plan's highest-stakes e2e gate.
- **Coverage target:** ≥90% line / ≥75% branch diff-coverage on `bas-engine-script` new code, via `cargo tarpaulin`.
- **Evidence commands:** corpus golden-diff run output (all scripts), performance benchmark before/after numbers, `cargo test -p bas-engine-script`, `cargo tarpaulin -p bas-engine-script --out Html`, existing `Solution/Tests` 400-case suite output.

## ADR Rationale
**Decision:** Build a dedicated representative script corpus + golden-output capture as this phase's FIRST deliverable, before any porting, rather than relying on Phase 7's discovery-level tests or extending the existing 400-case suite.
**Why:** the existing suite covers resources ONLY (scout) — scripting has literally zero coverage today, and it's the single highest-risk area given `scriptworker.cpp`'s size and centrality. User's constraint 4 explicitly names "CLI/script execution behavior" golden tests as a requirement; this phase is where that requirement bites hardest, so it gets a dedicated corpus rather than reusing a smaller ad-hoc test set that would under-cover the risk.
**Alternatives rejected:** port scriptworker without new tests, relying on manual QA (violates user's hard constraint 4 outright); split scripting into multiple crates preemptively (rejected — Phase 7 deliberately deferred `scriptworker.cpp`'s internal split to this phase's own mini-discovery, avoiding speculative sub-boundaries before they're proven necessary).

## Next Steps
- Phase 10 (`bas-engine-plugin`) depends on `bas-engine-script` existing — the plugin registry mediates between scripting execution and Modules' functions, so scripting's execution-call contract must be stable before the registry is finalized.
- The performance-threshold decision (Success Criteria) should be recorded once made, since later phases (Modules, Phase 11) will be benchmarked against the same baseline methodology.
