# Phase 03: Characterization Tests — Browser Shell (WebInterfaceBrowser + SchedulerBrowser)

## Context Links
- `scout/scout-01-module-map.md` — WebInterfaceBrowser (~16 files) + SchedulerBrowser (~13 files): "genuinely isolated, no Qt... LOW/LOW-MEDIUM RISK... high-confidence migration"; Tests section: zero coverage for anything except Engine resources.
- `phase-01-windows-dependency-inventory-classification.md` — this phase's tests run against the Windows CI reference build stood up there as a supporting task.
- `phase-02-migrate-macos-blocking-call-sites.md` — WebInterfaceBrowser's 5 and SchedulerBrowser's 2 `windows.h`-blocking files were already fixed there (Tier 4); this phase characterizes the REST of their behavior before Phase 4's full logic migration.
- `phase-04-workspace-bootstrap-browser-shell-migration.md` — consumes this phase's golden tests as the regression gate.

## Overview
- **Priority:** P1 — hard blocker for Phase 4. Per user constraint: "a module cannot be migrated without a safety net."
- **Status:** pending.
- Pure C++-side test-authoring phase. No Rust, no source changes to WebInterfaceBrowser/SchedulerBrowser — only new test/golden-file assets.

## Key Insights
- Scout: only ONE test file exists in the whole repo (`Solution/Tests`, Engine resources, ~400 cases) — WebInterfaceBrowser and SchedulerBrowser have exactly zero existing tests.
- Both modules are CEF-based handlers: WebInterfaceBrowser handles a custom URL scheme + filesystem hooks + tray icon; SchedulerBrowser handles screenshot/screencast + tray icon for long-running scheduled tasks. Their observable behavior is characterizable via CEF's own request/response and screenshot output — no need to invent a new test harness paradigm.
- "Characterization test" here means: capture CURRENT behavior as a golden baseline BEFORE any migration, not verify correctness against a spec (there may be no spec — the current binary's output IS the spec, per the case-study lesson that regressions are what kill incremental migrations).

## Requirements
- Functional: for each observable behavior (URL scheme handling, filesystem hook responses, screenshot/screencast output, tray icon lifecycle events), a golden-file test exists that runs the CURRENT unmodified C++ binary and stores its output as the baseline.
- Non-functional: tests must run in the Windows CI reference pipeline (Phase 1's supporting task), not require manual steps, and be fast enough to run on every subsequent Phase-4 commit (regression gate, not a one-off snapshot).

## Architecture
- Golden-file pattern: a small test harness (Qt Test or a standalone script invoked from CI) drives the built WebInterfaceBrowser/SchedulerBrowser executables with fixed inputs (a set of test URLs for the custom scheme, a fixed scheduled-task scenario for screenshot capture) and diffs output against checked-in golden files (`tests/golden/webinterfacebrowser/*.json`, `tests/golden/schedulerbrowser/*.png` for screenshots with a perceptual/byte diff tolerance for screenshot non-determinism).
- Screenshot comparisons use a tolerance threshold (not byte-exact) since CEF rendering can have minor non-deterministic pixel noise — document the chosen tolerance and rationale in the test harness README.

## Related Code Files
- `/Users/nguyendk/Documents/projects/me/bas/Solution/WebInterfaceBrowser/` — read-only, behavior under test (custom URL scheme handler, filesystem hooks, tray icon — exact file names to be confirmed against the `.pro` file's SOURCES list during execution).
- `/Users/nguyendk/Documents/projects/me/bas/Solution/WebInterfaceBrowser/WebInterfaceBrowser.pro` — read-only.
- `/Users/nguyendk/Documents/projects/me/bas/Solution/SchedulerBrowser/` — read-only, behavior under test (screenshot/screencast handlers, tray icon).
- `/Users/nguyendk/Documents/projects/me/bas/Solution/SchedulerBrowser/SchedulerBrowser.pro` — read-only.
- **Create:** `/Users/nguyendk/Documents/projects/me/bas/Solution/Tests/BrowserShellCharacterization/` — new test harness directory (driver script/exe + `.pro` or CMake test target wired into CI).
- **Create:** `/Users/nguyendk/Documents/projects/me/bas/Solution/Tests/BrowserShellCharacterization/golden/` — golden-file baselines (JSON responses, screenshot PNGs).

## Implementation Steps
1. Inventory each module's externally observable behaviors by reading their `.pro` SOURCES lists and headers (URL scheme responses, file-hook responses, screenshot output format, tray icon state transitions).
2. Design fixed test scenarios per behavior (e.g. 5-10 representative URLs for the custom scheme; 1-2 scheduled-task scenarios for screenshot capture).
3. Build a driver harness that invokes the CURRENT unmodified binaries with these scenarios and captures raw output.
4. Run the harness once against the Phase-1 Windows CI reference build, review output manually for sanity (garbage-in-garbage-out check — a golden file capturing a bug is still useful as a regression gate, but must be reviewed, not blindly trusted), then check in as the golden baseline.
5. Wire the harness into the CI workflow from Phase 1/2 as a new job/step that runs on every push, diffing live output against the golden files.
6. Document the tolerance strategy for screenshot diffs and how to intentionally update a golden file when a LATER phase's change is a deliberate, reviewed behavior change (not a regression).

## Todo List
- [ ] Inventory observable behaviors for WebInterfaceBrowser
- [ ] Inventory observable behaviors for SchedulerBrowser
- [ ] Design fixed test scenarios for both
- [ ] Build driver/harness executable or script
- [ ] Capture + manually review golden baseline outputs
- [ ] Check in golden files under `Solution/Tests/BrowserShellCharacterization/golden/`
- [ ] Wire harness into CI as a new job
- [ ] Document golden-file update procedure for deliberate behavior changes

## Success Criteria
- Golden-file harness runs in CI against the Phase-1 baseline build and passes (matches its own just-captured baseline — proves the harness itself works before it's asked to catch a real regression).
- At least one deliberately-broken build (e.g. temporarily comment out a URL-scheme handler branch, run harness) is proven to FAIL the harness — evidence the gate actually detects regressions, not just a rubber-stamp pass.
- Golden-file update procedure documented and demonstrated once (update one golden file for an intentional change, show the diff review).

## Risk Assessment
- **Golden files capture existing bugs as "correct"** — mitigated by manual review at capture time (step 4) and by treating any bug found during review as a documented known-issue, not silently baked into the baseline without a note.
- **Screenshot non-determinism causes flaky CI** — mitigated by tolerance-based diffing, documented explicitly; if flakiness persists, fall back to structural checks (image dimensions, non-blank check) over pixel diff for the flakiest cases.
- **Harness itself has bugs** — mitigated by the deliberate-break test in Success Criteria (mutation-testing-lite).

## Security Considerations
- Golden files/screenshots must not embed real user credentials, API keys, or PII from test fixtures — use synthetic test data only.
- Test harness runs the real binary; ensure CI job runs in an isolated/ephemeral runner (default for GitHub Actions) so no test artifact persists beyond the job.

## Test Strategy & Quality Gate
Lane `high-risk`. This phase's deliverable IS the test infrastructure, so the "gate" is about the harness's own correctness:
- **Spec:** Goal — golden-file regression harness for WebInterfaceBrowser + SchedulerBrowser's current behavior. AC: Given the current binary and a fixed scenario, When the harness runs, Then output matches (or is captured as) the golden baseline; Given a deliberately broken binary, When the harness runs, Then it fails. I/O contract: scenario inputs (URLs, task configs) → captured outputs (JSON/PNG) vs golden files → pass/fail. Out-of-scope: fixing any bug the review uncovers (documented, not fixed, in this phase).
- **Pyramid:** ~90% "unit-equivalent" golden-file comparisons, ~10% the one deliberate-break e2e proof.
- **E2E scenario:** full CEF handler invocation (real binary, real CEF runtime) end-to-end per scenario — this is inherently e2e-shaped even though it plays the "unit test" role for this migration.
- **Coverage target:** N/A (characterization tests measure BEHAVIOR coverage of observable outputs, not code line coverage — no existing test suite to diff against).
- **Evidence commands:** CI job log showing golden-file diff step passing on baseline, and the deliberate-break run's failure output, both pasted per Verification Gate.

## ADR Rationale
**Decision:** Golden-file characterization tests (capture-then-diff), not hand-written spec-based unit tests, for the first migrated module.
**Why:** scout confirms zero existing coverage and no written spec exists for these modules' exact behavior — writing "correct" unit tests from scratch risks encoding a WRONG assumption about intended behavior. Golden-file capture sidesteps that: the current binary's real output becomes the safety net, matching the case-study lesson (curl/Android) that leaf-module migrations succeed when regressions are caught mechanically, not by re-deriving intent.
**Alternatives rejected:** skip tests and migrate directly (violates user's explicit hard constraint 4); write full behavioral spec first (over-scoped for a PoC module, YAGNI — defer full spec-driven tests to modules where behavior is better understood, e.g. Phase 9's scripting engine).

## Next Steps
- Phase 4 runs this harness on every commit that touches the new `bas-browser-shell` crate or the C++ shell it replaces — CI gate, not optional.
- The harness pattern (inventory → fixed scenarios → golden capture → CI diff) is the template Phase 5/6/9 reuse for their own modules' characterization tests, adapted to each module's specific I/O shape (HTTP/ZIP for Phase 5, fingerprint JSON for Phase 6, script execution output for Phase 9).
