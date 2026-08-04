# Rust↔Qt Integration & Incremental C++→Rust Migration Case Studies

## 1. Rust↔Qt Integration Options

### CXX-Qt (KDAB) — Active Production-Ready

**Status**: Mature for incremental adoption. Currently at v0.8+ with regular feature releases. [1]

**Capabilities**:
- Bidirectional Rust ↔ C++ FFI using CXX library primitives
- Exposes Qt types (containers, pointers) and can write simple QML apps entirely in Rust [1]
- Allows Rust implementations of Qt models without C++ boilerplate [1]
- Integrates Rust tracing with Qt logging (v0.8.0) [2]
- Works with both CMake and Cargo build systems [1]

**Limitations** (from research): FFI boundary remains—QObject/signals-slots layer still requires C++ bridging for complex GUI interactions. Safe for exposing Rust backend modules to C++ callers, but not a complete replacement of Qt's object system.

**Alternative not found**: qmetaobject-rs is undocumented in current searches; CXX-Qt dominates production use.

### Integration Model for GUI-Heavy Codebases

Per KDAB's embedded systems analysis [3], the realistic incremental path is:
1. Keep Qt/QML GUI layer in C++ (signals/slots architecture)
2. Implement new backend logic in Rust (libcurl, parsing, crypto, state machines)
3. Call Rust from C++ via CXX-Qt FFI for business logic
4. Avoid rewriting GUI layer — QObject meta-system remains C++ domain

---

## 2. Incremental Migration Case Studies

### Case Study A: Android Platform (2021–2025) — Security-First, Leaf-Module Approach

**Migration Order**:
1. **High-risk leaf modules first**: Network parsers, TLS/crypto (rustls backend), PNG/JSON parsers in Chromium [4]
2. **System services & libraries** (Linux kernel drivers, Android framework layers) [4]
3. **New development defaults to Rust** where feasible; seldom rewrites existing C/C++ [4]

**Key Strategy**: Prevent memory bugs in new code rather than wholesale rewrites. Rust adoption focuses on "vulnerability prevention in new code" yielding "durable compounding gains." [4]

**Testing Approach**:
- Layered security: Defense-in-depth beyond Rust (e.g., Scudo hardened allocator with guard pages catching silent corruption as crashes) [4]
- Module-level testing before integration
- Extensive fuzzing on parsers

**Results**: 1000x reduction in memory-safety bug density vs. C/C++ code; memory-safety bugs <20% of total vulns in 2025. [4]

**Build Integration**: C and C++ persist indefinitely; Rust functions as direct alternative with low-level control, managed via AOSP's existing build system. [4]

---

### Case Study B: Firefox/Servo Components (Ongoing) — Bottom-Up Replacement

**Migration Order**:
1. **Start isolated**: New rendering engine (Servo) proved Rust viability [5]
2. **Integrate into Firefox incrementally**: Components like SpiderMonkey bindings, CSS engine layers [5]
3. **Avoid full rewrites**: Selective component replacement only [5]

**Integration Challenges**:
- Bridging Rust, C++, and JavaScript: Risk of accidentally invalidating C++ references when calling from Rust [6]
- Macro complexity across language barriers [6]
- Variable lifetime tracking across three runtimes [6]

**Lesson**: Narrow, isolated interfaces work best; broad refactoring across language boundaries creates cognitive load.

---

### Case Study C: curl's Rust Backend — Experimental Cautionary

**Migration Order**:
1. Started with hyper HTTP library Rust backend (2020) [7]
2. Shifted to rustls TLS (still experimental, 2024+) [8]
3. **Removed hyper backend** (Dec 2024) as "burden to maintain" [8]

**Key Lesson**: Experimental integrations risk technical debt if not fully stabilized. rustls/quiche backends use "cleaner internal APIs" and are easier to maintain long-term vs. hyper's invasive integration. [8]

**Implication**: Rust backend should integrate at boundary layer, not pervasively through C core.

---

## Summary: Incremental Path for BAS (Qt/C++ GUI)

**Viable approach**:
1. Keep Qt GUI in C++ (leverage existing skill/stability)
2. Introduce Rust in **isolated, leaf modules** (script engine, browser automation logic, network I/O)
3. Use **CXX-Qt for backend→GUI calls** (narrow, type-safe boundary)
4. Proven order: **leaf modules → system services → new development defaults to Rust**
5. Testing: **Module-level + integration fuzzing**, layered safety checks, no full-system rewrites

---

## Open Questions

- How invasive is CXX-Qt's Qt type marshaling for complex object hierarchies?
- Are there production Qt+Rust codebases beyond KDAB's own examples?
- What's the maintenance burden of CXX-Qt vs rustls-style thin FFI layers?

## Trade-offs

| Approach | Pros | Cons |
|----------|------|------|
| Full CXX-Qt GUI rewrite | Modern Rust idioms, memory safety | Massive rewrite risk, Qt skill debt, timeline |
| Leaf modules + CXX FFI | Low risk, proven (Android/Firefox), preserves Qt GUI | FFI overhead, slower adoption, team skill expansion |
| New backends in Rust, C++ GUI | Immediate safety gains, phased rollout | Persistent C++ GUI technical debt, integration complexity |

---

## Sources

[1] https://www.kdab.com/cxx-qt-0-5/  
[2] https://www.kdab.com/using-the-qt-logger-in-rust-with-cxx-qt/  
[3] https://rustfoundation.org/media/best-practices-for-integrating-rust-and-qt-in-embedded-systems/  
[4] https://blog.google/security/rust-in-android-move-fast-fix-things/  
[5] https://dl.acm.org/doi/10.1145/2889160.2889229  
[6] https://www.packtpub.com/en-ar/learning/how-to-tutorials/mozilla-engineer-shares-the-implications-of-rewriting-browser-internals-in-rust  
[7] https://daniel.haxx.se/blog/2020/10/09/rust-in-curl-with-hyper/  
[8] https://daniel.haxx.se/blog/2024/12/21/dropping-hyper/  
