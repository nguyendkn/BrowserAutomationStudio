# C++/Rust Interop Tooling for Incremental Migration

**Context:** Gradual migration of BAS (Qt/C++ desktop app, ~10 modules) to Rust without big-bang rewrite. Long coexistence of C++ and Rust.

---

## Tool Comparison

### `cxx` (dtolnay/cxx) — STABLE

**Capabilities:** Hand-written bidirectional FFI bridge. Zero-copy, no serialization overhead. Supports Rust (`String`, `Box`, `Vec`) ↔ C++ (`std::string`, `std::unique_ptr`, `std::vector`) type parity. Idiomatic API mapping (e.g., `len()` ↔ `size()`). Static analysis prevents signature mismatches and ABI bugs.

**Safety:** Rust side is 100% safe; C++ side uses `unsafe`. Intentionally restrictive type set (no `Option`, `HashMap`, `Arc` bridges).

**Interop directions:**
- **C++ → Rust:** Via `extern "Rust"` blocks in bridge definition.
- **Rust → C++:** Via `unsafe extern "C++"` blocks.

**Pain points:** Hand-written bridges slow for large APIs. Requires maintaining bridge code alongside both languages. Template instantiation for smart pointers adds complexity.

**Sources:** https://docs.rs/cxx/latest/cxx/

---

### `cbindgen` — STABLE

**Use case:** Auto-generates C/C++11 headers from Rust code. Enables new Rust modules to expose plain C ABI for C++ callers.

**Advantages:** Zero manual header writing. Real-world adoption (Mozilla WebRender, Tencent tquic). Supports both C and C++ output.

**Limitations:** Unidirectional (Rust → C/C++ only). Plain C ABI—no C++ type semantics in output. C++ must call via C interface.

**Interop direction:** **Rust → C++** (best for new Rust modules called by legacy C++).

**Stability:** Mature; pragmatic feature coverage (maintainers acknowledge adhoc feature development). 1,208 commits, 2.9k stars.

**Sources:** https://github.com/eqrion/cbindgen

---

### `autocxx` — EXPERIMENTAL, MAINTENANCE RISK

**Capability:** Combines bindgen + cxx. Auto-generates Rust bindings from C++ headers.

**Maturity:** Project seeks new maintainer. README recommends `cxx` or crubit instead. Blocked unfork from bindgen.

**vs. hand-written cxx:** Eliminates manual bridge authorship; rapid prototyping for large legacy headers. Less control over generated interface.

**Interop direction:** **C++ → Rust** (calling existing C++ from new Rust code).

**Verdict:** NOT recommended for production migrations. Use hand-written `cxx` instead.

**Sources:** https://github.com/google/autocxx

---

## Build Integration: qmake + Cargo

**No native plugin exists** (corrosion is CMake-only). Standard pattern:

1. **Cargo.toml:** `crate-type = ["staticlib"]`
2. **build.rs:** Outputs `.a` (or `.lib` on Windows) to Cargo target directory
3. **.pro file:** Custom `QMAKE_EXTRA_TARGETS` rule
   ```makefile
   cargo_build.target = Cargo.lib
   cargo_build.commands = cargo build --release
   cargo_build.depends = FORCE
   PRE_TARGETDEPS += Cargo.lib
   LIBS += -L$$OUT_PWD/../target/release -lbas_engine
   ```

**Cost:** Manual but reliable. Build time increases (Cargo rebuilds incrementally).

**Sources:** https://www.vandenoever.info/blog/2018/10/30/building_qt_apps_with_cargo.html; https://doc.rust-lang.org/cargo/reference/build-scripts.html

---

## Panic Safety Across FFI

**Rule:** Panics crossing FFI boundary = Undefined Behavior.

**Mitigation:** Use C-unwind ABI (`extern "C-unwind"`) or catch panics with `std::panic::catch_unwind()`.

**RFC 2945:** C-unwind stabilized; pragmatic FFI unwinding control now available (2025+).

**Cost:** Unwinding expensive; prefer no-panic approach in FFI-exposed functions.

**Sources:** https://rust-lang.github.io/rfcs/2945-c-unwind-abi.html; https://doc.rust-lang.org/nomicon/ffi.html

---

## Recommendation

| Direction | Tool | Rationale |
|-----------|------|-----------|
| **C++ → new Rust** | `cxx` (hand-written) | Stable, safe, zero-copy. Avoid autocxx (unmaintained). |
| **Rust → existing C++** | `cxx` (hand-written) | Same crate handles both directions. |
| **Rust module → C++ caller** | `cbindgen` | C ABI gen, no bridge writing. Use when Rust code is self-contained. |

**Phased approach:** Start with small Rust module (1–2 engines) using `cxx`. Export via `cbindgen` if needed. Use qmake's `QMAKE_EXTRA_TARGETS` for Cargo linking. Validate panic handling before shipping.

---

## Open Questions

- Does Qt's moc generate C++ code that cxx can bridge directly, or does additional wrapping layer needed?
- Build time impact of qmake + Cargo on large codebase; incremental rebuild strategy?
- Debugging across FFI in Qt Creator / Rust debuggers—how to step into both sides?
