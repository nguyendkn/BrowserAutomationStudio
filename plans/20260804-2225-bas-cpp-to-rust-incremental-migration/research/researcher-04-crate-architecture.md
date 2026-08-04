# Rust Crate Granularity for Large Codebases: Architecture Review

## Principles from Real-World Workspaces

**Rust-Analyzer (32 crates):** Organizes by *layered abstraction + API boundaries*—syntax (standalone, reusable), semantic core (hir-expand/hir-def/hir-ty), public APIs (hir/ide), LSP integration (rust-analyzer). The syntax crate is deliberately independent "so it is possible to make useful tooling using only the syntax tree" without semantic builds. [[1]](https://rust-analyzer.github.io/book/contributing/architecture.html)

**Tokio:** *Initially* split into many small crates (tokio, tokio-util, tokio-io, etc.), but **reverted to consolidation**—citing "overhead of managing cross-crate dependencies, version coordination, and the confusion it caused for users." Now one primary tokio crate with optional modules. [[2]](https://rustprojectprimer.com/organization/workspace.html)

**Deno:** Large workspace with clear *domain separation*—core (V8 bridge), extensions, runtime, CLI binary. Concerns are separated by responsibility, not file count. [[3]](https://choubey.gitbook.io/internals-of-deno/architecture/tokio)

**Common pattern:** Domain/responsibility boundaries over strict LOC limits. API crates hide complexity; internal crates enforce loose coupling via well-defined contracts.

## Practical Sizing Rules

**When to split:** Compilation slowness, need to enforce coupling boundaries, code reusable across projects, responsibility separates by team. [[2]](https://rustprojectprimer.com/organization/workspace.html)

**When NOT to split:** Prematurely—"doing it too late risks code depending on private interfaces." Tokio's consolidation shows excessive granularity adds overhead. [[2]](https://rustprojectprimer.com/organization/workspace.html)

**Compilation impact:** Each crate = separate compilation unit → *parallel builds*. Unified target folder avoids redundant deps. Splitting monolithic code is "highest-leverage way to speed up Rust compile times," but boundary overhead grows with crate count. [[4]](https://softwarepatternslexicon.com/rust/anti-patterns-and-common-pitfalls/avoiding-monolithic-crate-structures/)

**Cohesion heuristic:** High cohesion (parts that *change together*) = same crate. Low coupling (crate A doesn't know crate B's internals) = separate crates. [[5]](https://medium.com/@iamprovidence/coupling-and-cohesion-foundations-that-affect-your-entire-codebase-77d06d44af0d)

## Recommendation for BAS Migration

**Don't mirror C++ 1:1.** Instead:

1. **Engine (695 files):** *Split by responsibility layer*, not module—e.g., `bas-engine-core` (automation execution primitives), `bas-engine-script` (scripting DSL), `bas-engine-plugin` (extension system). Reduces rebuild footprint. [[4]](https://softwarepatternslexicon.com/rust/anti-patterns-and-common-pitfalls/avoiding-monolithic-crate-structures/)

2. **ChromeWorker (224 files):** Keep as *one crate* (fingerprinting + browser control are tightly coupled; high cohesion). [[1]](https://rust-analyzer.github.io/book/contributing/architecture.html)

3. **Studio (40 files):** One crate (`bas-studio`). Small enough; GUI is cohesive.

4. **Utilities:** Merge Scheduler, SchedulerBrowser, FastExecuteScript, RemoteExecuteScript into `bas-scheduling` (responsibility-based grouping). [[2]](https://rustprojectprimer.com/organization/workspace.html)

5. **Create an API crate:** `bas-api` wraps Engine + ChromeWorker with serializable POD types. Prevents internal deps from leaking. [[1]](https://rust-analyzer.github.io/book/contributing/architecture.html)

**Result:** ~6–8 crates instead of 12+. Reduces overhead, enables parallel compilation where it matters (Engine splits), maintains cohesion.

## Open Questions

- Will Engine sub-responsibility boundaries emerge only after partial Rust migration?
- Feature unification gotchas—which Engine/ChromeWorker features conflict across workspace? [[2]](https://rustprojectprimer.com/organization/workspace.html)

## Sources

[1] https://rust-analyzer.github.io/book/contributing/architecture.html
[2] https://rustprojectprimer.com/organization/workspace.html
[3] https://choubey.gitbook.io/internals-of-deno/architecture/tokio
[4] https://softwarepatternslexicon.com/rust/anti-patterns-and-common-pitfalls/avoiding-monolithic-crate-structures/
[5] https://medium.com/@iamprovidence/coupling-and-cohesion-foundations-that-affect-your-entire-codebase-77d06d44af0d
