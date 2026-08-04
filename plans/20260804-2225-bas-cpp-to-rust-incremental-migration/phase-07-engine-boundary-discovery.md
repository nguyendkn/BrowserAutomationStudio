# Phase 07: Engine Internal Boundary Discovery (Spike, No Rust)

## Context Links
- `scout/scout-01-module-map.md` — Engine (~760 files, 337 Qt Q_OBJECT/signals-slots files, 31 WinAPI files, ~100 public headers, consumed by Studio/FastExecuteScript/RemoteExecuteScript/Updater/all 40 Modules). "Tightly coupled to Qt signal/slot patterns; large surface area; deeply entangled UI/business logic."
- `research/researcher-04-crate-architecture.md` — recommends splitting Engine by responsibility layer (core/scripting/plugin) but flags as open question: "will Engine sub-responsibility boundaries emerge only after partial Rust migration?"
- `research/researcher-03-qt-rust-case-studies.md` — case-study lesson: narrow, isolated interfaces work best; broad cross-language refactors create cognitive load (curl's failed hyper backend).
- `plan.md` — Engine migration order reasoning (core → script → plugin-registry).

## Overview
- **Priority:** P1 — hard prerequisite for Phase 8-10. Engine cannot be migrated in one shot (760 files, 100+ public APIs); this phase produces the map that makes the 3-way split real instead of aspirational.
- **Status:** pending.
- **This phase writes NO Rust and migrates NO behavior.** It is a C++-only refactor (extract-interface) + documentation phase: identify the actual core/scripting/plugin-registry seams in Engine's current code, and refactor Engine's INTERNAL structure (still C++, still Qt) so those three layers become independently buildable/testable C++ units before any FFI crosses a boundary.

## Key Insights
- Scout's own dependency map already implies the seam: Modules are "deeply embedded in script function registry (Engine-coupled at integration point)" despite being individually "self-contained... minimal inter-module coupling" (scout-01, Modules section), and "Engine is the bottleneck: Core library consumed by... all 40 Modules (via registration)" (scout-01, Cross-Module Dependency Map) — this means the plugin-registry boundary is not hypothetical, it is the ACTUAL integration point Modules already use today (even in C++). This phase formalizes and narrows it, it doesn't invent it from nothing.
- `scriptworker.cpp` (116KB, scout's largest Engine file) is almost certainly the core of the "scripting" layer — a large single file is itself a signal that its internal seams (parsing vs execution vs resource access) may need sub-analysis, but splitting scriptworker.cpp further is out of scope for Phase 7 (YAGNI at this stage — Phase 9 can split it further once it's isolated as its own C++ unit).
- 337/760 files touch Q_OBJECT/signals-slots — this phase must classify EACH of those as (a) genuinely UI-facing (stays C++ forever, called via CXX-Qt later) vs (b) using Qt signals/slots merely as an internal event mechanism for business logic that COULD move to Rust with a different (non-Qt) event mechanism. Conflating these two is the single biggest risk to getting the boundary map wrong.
- researcher-03: "keep the actual QObject/GUI widget layer in C++; only backend logic moves to Rust" — this phase's output must explicitly tag which files are QObject/GUI-widget-layer (out of scope for Rust, ever) vs internal-event-mechanism-only (in scope).

## Requirements
- Functional: produce a file-level classification of all ~760 Engine files into: `core` (execution primitives, resource mgmt, DB connectivity, browser-control abstractions), `scripting` (compilation/execution pipeline), `plugin-registry` (script-function/extension registration), `qt-ui-permanent` (GUI widgets/dialogs, stays C++ indefinitely, future CXX-Qt candidate), `winapi-platform` (the 31 WinAPI files, classified by which of the above layers they support AND, per plan.md's cross-platform-first goal, a first-pass tag of "has cross-platform crate equivalent" vs "likely genuinely OS-specific" — feeds Phase 8's detailed triage directly instead of Phase 8 starting from zero).
- Non-functional: the classification must be validated by actually attempting the C++-only extraction (step-by-step in Implementation Steps) — a spreadsheet guess without a compile-and-test checkpoint does not satisfy this phase's Success Criteria.
- No behavior change: Engine must still build and pass Phase 2's baseline smoke test (and any Engine-touching characterization tests written so far) after the internal refactor.

## Architecture
- Output artifact: `docs/engine-boundary-map.md` — the file-level classification table plus a description of each layer's public C++ interface (the seam that will later become the `cxx` bridge surface in Phases 7-9).
- Refactor pattern: extract-interface-first. For each of `core`/`scripting`/`plugin-registry`, introduce (in C++) an abstract interface (pure virtual class or free-function header) that the rest of Engine calls through, then move the concrete implementation files behind it. This is the SAME technique used later to place the `cxx` bridge (the interface becomes the FFI surface) — the C++ refactor and the eventual Rust boundary are the same seam, done in two safe steps instead of one risky one.
- No new build targets yet (Engine stays one `.pro` target) — the goal is internal modularity proven by interface + compile boundaries, not yet separate binaries/libraries.

## Related Code Files
- `/Users/nguyendk/Documents/projects/me/bas/Solution/Engine/` — read/analyze all ~760 files; refactor (extract-interface only, no logic change) the subset identified as core/scripting/plugin-registry seams. Exact target files determined by this phase's own analysis (cannot be fully enumerated in advance — that is the point of the discovery phase).
- `/Users/nguyendk/Documents/projects/me/bas/Solution/Engine/Engine.pro` — read; may gain internal source-grouping (e.g. `SOURCES += core/*.cpp scripting/*.cpp plugin/*.cpp`) without changing the build TARGET.
- **Create:** `/Users/nguyendk/Documents/projects/me/bas/docs/engine-boundary-map.md` — the classification deliverable.

## Implementation Steps
1. Grep/inventory all ~760 Engine files by: Q_OBJECT/signals-slots presence, WinAPI usage, and file size/name heuristics (scriptworker*, *dialog*, *widget*, *resource*, *database*, *plugin*/*module*-registration) to produce a first-pass classification draft.
2. Manually review the draft against actual `#include` graphs (which files include which) to catch misclassifications — a file named `resourcemanager.cpp` that also drives a Q_OBJECT dialog is a `core`+`qt-ui-permanent` split candidate, not a single bucket.
3. For the `plugin-registry` seam specifically: trace exactly how the 40 Modules register today (scout: "registered with Engine at link time") — this is the most load-bearing seam (unblocks Modules in Phase 10-11) and must be validated by reading the actual registration code path, not inferred from file names.
4. Extract a C++ interface for `plugin-registry` first (smallest, most load-bearing, already semi-isolated per step 3); move concrete registration logic behind it; rebuild Engine + a sample Module against the new interface; confirm no behavior change via Phase 2's smoke test.
5. Extract a C++ interface for `core`; same rebuild-and-verify discipline.
6. Extract a C++ interface for `scripting`; same discipline — expect this to be the largest/riskiest extraction given `scriptworker.cpp`'s size.
7. Classify remaining `qt-ui-permanent` and `winapi-platform` files, cross-referencing which layer each WinAPI file supports (per researcher-01's file list) so Phases 7-9 know where WinAPI interop work lands.
8. Write `docs/engine-boundary-map.md` with the final classification + each layer's extracted C++ interface signature (this becomes Phase 8-10's literal FFI-boundary starting point).

## Todo List
- [ ] First-pass file classification (grep/heuristics)
- [ ] Manual `#include`-graph review, correct misclassifications
- [ ] Trace actual Module-registration code path
- [ ] Extract + verify `plugin-registry` C++ interface
- [ ] Extract + verify `core` C++ interface
- [ ] Extract + verify `scripting` C++ interface
- [ ] Classify `qt-ui-permanent` + `winapi-platform` files
- [ ] Write `docs/engine-boundary-map.md`

## Success Criteria
- `docs/engine-boundary-map.md` classifies all ~760 files with no "unclassified" bucket left over.
- All three interface extractions (plugin-registry, core, scripting) compile and pass Phase 2's smoke test + any existing Engine characterization tests, proving the refactor is behavior-preserving.
- A sample Module (at least 1 of the 40) is rebuilt against the new `plugin-registry` interface and confirmed working — proof the seam is real, not just a document.

## Risk Assessment
- **Misclassifying a Q_OBJECT file as portable when it's genuinely UI-bound** — mitigated by the `#include`-graph review (step 2) and by defaulting to `qt-ui-permanent` when in doubt (conservative — easier to move a file to Rust LATER once proven safe than to un-migrate a wrongly-moved UI file).
- **The boundary map turns out wrong once Phase 8 starts real extraction** — explicitly expected per researcher-04's own open question; mitigated by treating `docs/engine-boundary-map.md` as a living document Phase 8-10 update, not a frozen spec (documented in plan.md's Unresolved Questions).
- **`scriptworker.cpp`'s internal complexity resists clean extraction** — if the scripting interface extraction (step 6) proves too risky to do safely, defer part of it and document exactly which sub-piece resisted extraction and why, rather than forcing an unsafe split (legitimate defer reason: genuinely missing information until attempted).

## Security Considerations
- No new attack surface (C++-only internal refactor, no FFI yet) — but the `plugin-registry` interface extraction touches the Module-loading path (scout: DLLs "registered... at link time"); verify no change to which DLLs are trusted/loaded (no accidental loosening of load-path or signature checks during the refactor).

## Test Strategy & Quality Gate
Lane `high-risk`.
- **Spec:** Goal — classify + C++-refactor Engine into 3 independently-buildable layers, zero behavior change. AC: Given the pre-refactor Engine binary and Phase 2's smoke test, When the same test runs against the post-refactor binary, Then results are identical; Given a sample Module, When rebuilt against the new plugin-registry interface, Then it loads and functions identically. I/O contract: N/A (internal refactor, no external interface changes). Out-of-scope: any Rust code, any behavior change, splitting `scriptworker.cpp` internally beyond what's needed to extract the scripting-layer interface.
- **Pyramid:** ~100% integration/e2e — this phase's correctness IS "does Engine still build and behave identically," verified via Phase 2's smoke test + existing Engine test file (`Solution/Tests`, the 400 resource-copy cases) re-run after each extraction step.
- **E2E scenario:** full Engine build + smoke launch + existing Test-suite run, after each of the 3 interface extractions (steps 4-6), not just once at the end.
- **Coverage target:** N/A (no new logic, pure structural refactor — coverage gate doesn't apply; behavior-preservation is proven via the existing test suite re-run, not a coverage number).
- **Evidence commands:** CI build log for each extraction step, `Solution/Tests` suite run output (before/after diff = identical), the sample Module's functional smoke check output.

## ADR Rationale
**Decision:** Do the core/scripting/plugin-registry split as a C++-only extract-interface refactor BEFORE any Rust/FFI work touches Engine, rather than discovering boundaries "live" during Rust porting.
**Why:** researcher-04's own open question ("will boundaries emerge only after partial migration?") is a real risk — case-study C (curl) shows that ad-hoc, discovered-as-you-go integration accumulates unsustainable debt. Doing the split in C++ first means a wrong boundary guess costs a C++ refactor (cheap, reversible, no FFI to unwind) instead of a wrong FFI boundary (expensive, unsafe-code-tainted, hard to reverse).
**Alternatives rejected:** skip discovery, start porting `core` directly and let boundaries emerge (rejected — repeats the exact risk case-study C warns against); split Engine into more than 3 layers speculatively (rejected — researcher-04 and scout's evidence only supports these 3 seams; more granularity is unjustified speculation, YAGNI).

## Next Steps
- `docs/engine-boundary-map.md` is Phase 8's primary input — Phase 8 starts from its `core` interface signature, not from re-deriving Engine's structure.
- If a layer's boundary proves wrong during Phase 8-9 (expected possibility per Risk Assessment), update `docs/engine-boundary-map.md` in place and note the correction — it stays a living document through Phase 10.
