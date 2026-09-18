# Phase 12: Final Crate Consolidation & Cleanup

## Context Links
- All prior phases — this phase closes out the migration, does not introduce new migrated logic.
- `scout/scout-01-module-map.md` — Studio (~42 files) + ShopViewer (~5 files): "trivial... negligible standalone value... migrate last or retire."
- `research/researcher-03-qt-rust-case-studies.md` — case-study C (curl) lesson on not letting integration debt linger; this phase is where lingering debt gets paid down or explicitly written off.

## Overview
- **Priority:** P2 — cleanup/consolidation, not a new-capability phase.
- **Status:** pending. Depends on Phase 11 (or its documented partial completion).
- Scope: retire dead C++/qmake scaffolding made obsolete by the migration, finalize the Rust workspace `Cargo.toml`, decide Studio/ShopViewer's fate, run a full end-to-end regression pass across every characterization suite built across Phases 2-11, and document the final architecture.

## Key Insights
- By this point, all 9 committed library crates exist (`bas-platform`, `bas-contracts`, `bas-browser-shell`, `bas-scheduling`, `bas-chromeworker`, `bas-engine-core`, `bas-engine-script`, `bas-engine-plugin`, `bas-modules`), plus the `bas-fastexecute` bin-only 10th member from Phase 11 — this phase is about tidying the SEAMS between them (dead qmake targets, orphaned C++ shim files that no longer do anything but forward a call, stale `QMAKE_EXTRA_TARGETS` rules for now-fully-replaced modules), not new migration work.
- Studio/ShopViewer remain unaddressed by design (scout: negligible value, deferred every prior phase) — this phase makes the FINAL call: either accept an optional 11th `bas-studio` crate (CXX-Qt, since Studio embeds a real Qt IDE UI) or leave them permanently C++ wrapping the now-fully-Rust Engine/ChromeWorker backend via the same interop patterns already proven. Either choice is legitimate; only the decision must be made and recorded (plan.md's Unresolved Q3).
- This is also the natural point to retire the CI workflow's now-unnecessary legacy build paths (e.g. if any Phase 1/2-era qmake-only path for a fully-migrated module is now dead weight) and to confirm the Windows-VM-vs-CI question (plan.md Unresolved Q2) with real usage data from 11 phases of experience.

## Requirements
- Functional: every crate's `Cargo.toml` workspace membership is finalized and documented; no dead/orphaned C++ source remains for fully-migrated modules; Studio/ShopViewer's disposition is explicitly decided and recorded.
- Non-functional: EVERY characterization suite built in Phases 2, 3, 5, 6, 8, 9, 10, 11 passes in one final combined CI run — the plan's overall regression gate.
- Documentation: `docs/system-architecture.md` (or equivalent) reflects the final Rust/C++ split, superseding the incremental `docs/engine-boundary-map.md` working document.

## Architecture
- Final workspace layout (`rust/Cargo.toml` members): `bas-platform`, `bas-contracts`, `bas-browser-shell`, `bas-scheduling`, `bas-chromeworker`, `bas-engine-core`, `bas-engine-script`, `bas-engine-plugin`, `bas-modules`, `bas-fastexecute`, and optionally `bas-studio` if Studio/ShopViewer's decision (Key Insights) is to migrate.
- Remaining C++ surface after this phase: `qt-ui-permanent` files from Phase 7's classification (Engine's wizard/config dialogs, called via CXX-Qt), Studio/ShopViewer (per this phase's decision), and any Module explicitly deferred in Phase 11.
- CI workflow (`build-windows.yml` from Phase 1's Windows reference build, `build-macos.yml` from Phase 2 if it exists) consolidated into its final shape: single Rust+Qt+MSVC(+mac toolchain) build, single combined test job running all characterization suites plus `cargo test`/`cargo tarpaulin` across the whole workspace.

## Related Code Files
- `rust/Cargo.toml` — modify: finalize `[workspace] members`.
- `Solution/Solution.pro` — modify: remove qmake subdirs/targets for any module now fully superseded by Rust (if the module's C++ project is retired entirely, not just internally delegating to Rust).
- `.github/workflows/build-windows.yml` — modify: consolidate into final single build+test job.
- `Solution/Studio/` and `Solution/ShopViewer/` — decision point: migrate (create `rust/bas-studio/`) or explicitly mark "stays C++ indefinitely" in `docs/system-architecture.md`.
- `docs/engine-boundary-map.md` — superseded by, merge into `docs/system-architecture.md`.
- **Create:** `docs/system-architecture.md` — final architecture record (per `workflows/documentation-management.md`'s doc set).

## Implementation Steps
1. Audit every `.pro` file across `Solution/` for `QMAKE_EXTRA_TARGETS`/`LIBS` rules pointing at Rust crates; confirm each is still needed (module fully migrated = keep only the thin shim + Rust link; module partially migrated per Phase 11's deferred list = document why it's still mixed).
2. Remove any C++ source file that is now a pure dead pass-through (a function that does nothing but forward to the Rust equivalent AND has zero remaining callers because all callers now call Rust directly) — verify via a repo-wide reference search before deleting, not by file-age assumption.
3. Finalize `rust/Cargo.toml` workspace members; run `cargo build --workspace` and `cargo test --workspace` to confirm the whole workspace is internally consistent (no member with a broken/missing dependency).
4. Decide Studio/ShopViewer's fate (Key Insights) — if migrating, scope it as a follow-up plan (out of THIS plan's committed 9-library-crate scope — `bas-fastexecute`'s bin-only 10th member is the sole already-approved exception, per plan.md), if not, record the C++-indefinitely decision with rationale.
5. Consolidate the CI workflow into one build+test job covering the full workspace + every characterization suite from Phases 2/3/5/6/8/9/10/11.
6. Run the consolidated CI job; this is the plan's final combined regression gate — every suite must pass simultaneously, not just each phase's own isolated run.
7. Write `docs/system-architecture.md`: final crate list + responsibilities, remaining C++ surface + why, interop patterns used (cxx/CXX-Qt/cbindgen, per crate boundary), and a pointer to `rust/README.md`'s interop-pattern reference for future contributors.
8. Resolve plan.md's Unresolved Q2 (VM vs CI) with actual usage data collected across Phases 1-11 — record the final recommendation in `docs/build-baseline.md` (Phase 1's doc, updated here).

## Todo List
- [ ] Audit all `.pro` files for stale/still-needed Rust link rules
- [ ] Remove dead pass-through C++ shims (verified zero remaining callers)
- [ ] Finalize `rust/Cargo.toml` workspace members, `cargo build/test --workspace` green
- [ ] Decide + record Studio/ShopViewer disposition
- [ ] Consolidate CI into one build+test job, full workspace + all characterization suites
- [ ] Run consolidated CI job, full regression pass
- [ ] Write `docs/system-architecture.md`
- [ ] Update `docs/build-baseline.md` with VM-vs-CI final recommendation

## Success Criteria
- One consolidated CI run builds the entire workspace + remaining C++ and passes EVERY characterization suite from every prior phase simultaneously — the plan's definitive "migration didn't regress anything, end to end" proof.
- `docs/system-architecture.md` exists, accurately reflects the final crate boundaries, and is specific enough that a new contributor understands where to add code (Rust crate vs remaining C++) without asking a maintainer.
- Studio/ShopViewer's disposition is explicitly recorded (either "migrated, see follow-up plan X" or "stays C++, see rationale Y") — not silently left ambiguous.
- No orphaned/dead C++ source remains for any module Phase 11 reports as fully migrated (verified by the reference-search check in step 2).

## Risk Assessment
- **Removing a C++ shim that still has a hidden caller** (e.g. a reflection-based Qt signal connection not caught by a plain grep) — mitigated by requiring the consolidated CI run (step 6) to pass AFTER each removal, not just before, and by preferring Qt's `moc`-aware search tools over plain grep when checking for signal/slot callers.
- **Studio/ShopViewer decision deferred indefinitely by default** (easy to let "defer" become "never decided") — mitigated by making the decision itself (not the migration) a hard Success Criteria line for THIS phase, so the plan doesn't close with an implicit unresolved question.
- **Consolidated CI job becomes slow/flaky by aggregating every suite** — mitigate by parallelizing independent characterization suites within the CI job (matrix jobs per phase's suite) rather than serializing all of them, and by carrying forward each suite's own flakiness mitigations (e.g. Phase 3's screenshot tolerance) rather than re-solving them here.

## Security Considerations
- Final architecture doc (`docs/system-architecture.md`) should note where `unsafe` code is concentrated across the whole workspace (each phase's `platform`/`c_abi` submodules, and `bas-platform` itself) as a single reference point for future security review, rather than leaving that knowledge scattered across 9 crates' individual READMEs.
- Confirm no development-only credentials/tokens used during CI setup (Phase 1/2) or dependency fetching (any private `basbuild` auth) linger in now-unused workflow steps being removed in step 5's consolidation.

## Test Strategy & Quality Gate
Lane `high-risk`.
- **Spec:** Goal — consolidate the workspace, retire dead C++, prove end-to-end regression-free across the whole migration. AC: Given the full workspace + remaining C++, When the consolidated CI job runs, Then every characterization suite from every phase passes simultaneously; Given the dead-shim removal candidates, When a repo-wide reference search runs, Then zero remaining callers are found before deletion. I/O contract: N/A (consolidation/cleanup, no new external interface). Out-of-scope: any new migration work (Studio/ShopViewer migration itself, if chosen, is a follow-up plan, not this phase).
- **Pyramid:** ~100% integration/e2e by nature (this phase verifies the AGGREGATE of every prior phase's pyramid, not new unit-level logic).
- **E2E scenario:** the full consolidated CI run — every phase's e2e scenario (Phase 3's golden browser-shell suite, Phase 5's scheduling suite, Phase 6's fingerprint suite, Phase 8's 400-case suite, Phase 9's script corpus, Phase 10's 40-Module registration, Phase 11's full-corpus run) executed together in one job.
- **Coverage target:** N/A for this phase's own (near-zero) new code; report the WORKSPACE-WIDE aggregate `cargo tarpaulin --workspace` number as a final migration metric (informational, not a pass/fail gate — each crate already met its own ≥90%/≥75% gate in its own phase).
- **Evidence commands:** consolidated CI job log (all suites green), `cargo build --workspace`, `cargo test --workspace`, `cargo tarpaulin --workspace --out Html` (informational aggregate).

## ADR Rationale
**Decision:** Studio/ShopViewer disposition is decided HERE, not earlier, and is explicitly out-of-scope for migration within this plan regardless of the decision's direction.
**Why:** scout ranks them "negligible risk... trivial... last-priority" — every case study researcher-03 cites warns against migrating low-value surface just for completeness (case-study C's core lesson: pervasive/unnecessary integration accumulates debt without benefit). Deferring the DECISION (not just the migration) to Phase 12 means it's made with full information about how well CXX-Qt worked in Phase 8 (Engine's GUI boundary), rather than guessing upfront.
**Alternatives rejected:** deciding Studio/ShopViewer's fate in Phase 1 (premature — no CXX-Qt experience yet to inform the call); migrating them somewhere in the middle of the plan "for completeness" (rejected — no dependency forces it, pure scope creep against scout's own risk ranking).

## Next Steps
- If Studio/ShopViewer migration is chosen, scope it as a new, separate incremental plan (its own Phase 3-equivalent characterization-tests-first discipline) — not appended ad hoc to this plan after the fact.
- `docs/system-architecture.md` becomes the durable reference for all future BAS development, Rust or C++ — hand off to whatever ongoing docs-maintenance process the repo adopts post-migration.
