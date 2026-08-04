# BAS C++ Module Structure & Rust Migration Map

## Module Inventory (12 top-level)

### ENGINE (~760 files, 358 .cpp + 402 .h, ~3.0MB code)
**Type:** Core library, mixed Qt UI widgets + business logic  
**Qt coupling:** HIGH (337/760 files with Q_OBJECT/signals/slots)  
**WinAPI/COM:** HEAVY (31 files)  
**Largest files:** scriptworker.cpp (116KB, script execution), chooserresourcewidget.cpp (107KB, UI), mongodatabaseconnector.cpp (90KB)  
**Dependencies:** Exports ~100 public headers; consumed by all other exe modules (Studio, FastExecuteScript, RemoteExecuteScript, Updater)  
**Content:** Resource management, script compilation/execution, browser control abstractions, database connectivity, UI dialogs for wizard/configuration  
**Migration signal:** HIGHEST RISK. Tightly coupled to Qt signal/slot patterns; large surface area (hundreds of public APIs); deeply entangled UI/business logic.

### CHROMEWORKER (~320 files, 148 .cpp + 172 .h, ~3.2MB)
**Type:** Standalone executable, CEF-based (no Qt)  
**Qt coupling:** NONE  
**WinAPI/COM:** HEAVY (43 files, Chrome DevTools Protocol implementation)  
**Largest files:** lodepng.cpp (219KB, PNG codec), mainapp.cpp (173KB), devtoolsconnector.cpp (111KB)  
**Dependencies:** CEF (Chromium Embedded Framework), curl, third-party libs; self-contained (minimal Engine deps)  
**Content:** Chrome DevTools Protocol client, browser fingerprinting, tab control, screenshot/screencast, input emulation, custom protocol handlers  
**Migration signal:** MEDIUM RISK. No Qt coupling (clean boundary), but heavy protocol complexity and C struct marshalling for Windows interop.

### STUDIO (~42 files, 15 .cpp + 27 .h, ~138KB)
**Type:** Qt IDE application  
**Qt coupling:** MODERATE (10 files with Q_OBJECT/signals)  
**WinAPI/COM:** LOW (6 files)  
**Largest files:** mainwindow.cpp (105KB, main IDE UI), debug helpers  
**Dependencies:** Engine (links for compilation/resource features), Qt framework  
**Content:** Script editor, project compilation UI, HTTP sniffer, project manager, build output display  
**Migration signal:** LOW RISK (if Engine stabilized). Small codebase, thin UI layer; can defer until Engine migration complete.

### SCHEDULER (~47 files, 24 .cpp + 23 .h, ~150KB)
**Type:** Headless Qt application (console), HTTP server  
**Qt coupling:** MODERATE (16 files with Q_OBJECT/signals)  
**WinAPI/COM:** NONE  
**Largest files:** task/taskmanager, API handlers, HTTP server logic  
**Dependencies:** Qt WebSockets, embedded HTTP server (httpserver.pri), no Engine imports  
**Content:** Task scheduling/persistence, REST API (external + internal script commands), manual action queue, WebSocket support  
**Migration signal:** MEDIUM RISK. Self-contained business logic (HTTP server, task DB), but Qt signal/slot event handling; good candidate for modular extraction after Engine baseline.

### SCHEDULERBROWSER (~13 files, ~100KB, CEF-based)
**Type:** Utility app for scheduled task execution  
**Qt coupling:** NONE  
**WinAPI/COM:** Minimal  
**Dependencies:** CEF, SchedulerBrowser-specific handlers  
**Content:** Browser environment for long-running tasks (screenshot, screencast handlers, tray icon)  
**Migration signal:** LOW-MEDIUM RISK. Small, isolated; defer after ChromeWorker if needed.

### FASTEXECUTESCRIPT (~30 files, Qt UI plugin)
**Type:** Plugin/library for in-process script execution  
**Qt coupling:** HIGH (inherits Engine UI abstractions)  
**Dependencies:** Engine (tight coupling via header includes)  
**Content:** Fast in-process JavaScript execution wrapper, resource validation, UI forms  
**Migration signal:** CRITICAL BLOCKER. Cannot migrate without Engine core; depends on Engine's script execution pipeline.

### REMOTEEXECUTESCRIPT (~25 files, HTTP client wrapper)
**Type:** Library for remote task dispatch  
**Qt coupling:** LOW (mostly HTTP utilities shared with Updater)  
**Dependencies:** HTTP client code, ZIP utilities (shared with Updater), minimal Engine  
**Content:** HTTP request dispatch, ZIP archive handling, network retry logic  
**Migration signal:** MEDIUM RISK. Algorithmic/utility-heavy; low Qt coupling; good refactoring candidate.

### WEBINTERFACEBROWSER (~16 files, CEF-based handler)
**Type:** Lightweight CEF client  
**Qt coupling:** NONE  
**WinAPI/COM:** Minimal (file system, tray icon ops)  
**Dependencies:** CEF, embedded file system abstractions  
**Content:** Handler for WebInterface URL scheme, file system access hooks, tray icon integration  
**Migration signal:** LOW RISK. Small, isolated CEF wrapper; high-confidence migration.

### SHOPVIEWER (5 files, ~2KB code)
**Type:** Micro Qt app  
**Qt coupling:** MINIMAL (Qt WebEngine wrapper only)  
**Dependencies:** Qt WebEngine (no Engine dependency)  
**Content:** Shop display window, URL scheme handler  
**Migration signal:** NEGLIGIBLE RISK. Standalone, trivial; last-priority candidate.

### UPDATER (~60 files, 28 .cpp + 32 .h, ~200KB)
**Type:** Qt GUI app for version management  
**Qt coupling:** MODERATE (19 files with Q_OBJECT)  
**WinAPI/COM:** NONE detected  
**Largest files:** quazip/*.cpp (ZIP handling), HTTP client code  
**Dependencies:** Engine (links for logging/resources), Qt, QUAZIP (static), libcurl (indirectly via HTTP client)  
**Content:** Update checking, download/resume logic, ZIP extraction, version cleanup, progress UI  
**Migration signal:** MEDIUM RISK. Portable business logic (HTTP, ZIP utilities); UI layer can be decoupled; good secondary migration target after core.

### MODULES (~40 plugin DLLs, 11 .cpp + 15 .h per .pro, ~600KB code total)
**Type:** Non-Qt plugin libraries (DLLs), each implements domain-specific scripting functions  
**Qt coupling:** NONE (QT -= gui in all .pro files)  
**WinAPI/COM:** VARIES (image processing uses Windows GDI, automation modules use WinAPI)  
**Subdirectories:** Archive, Checksum, Clipboard, Database, DateTime, Excel, FileSystem, FTP, ImageProcessing, JSON, List, Path, PhoneVerification, Processes, Profiles, ReCaptcha, RegularExpression, Resources, ScriptStats, SQL, String, Telegram, Timezones, URL, etc.  
**Largest/most complex:** Timezones (590KB tmap.cpp, geographic data), CurlWrapper, ImageProcessing  
**Content:** Pure C++ utilities exposed to script engine (functions for file I/O, JSON parsing, regex, automation, web requests, etc.)  
**Migration signal:** LOW-MEDIUM RISK. Self-contained DLLs; minimal inter-module coupling; ideal first-wave candidates if properly abstracted from Engine. Non-Qt means clean boundaries. BUT: deeply embedded in script function registry (Engine-coupled at integration point).

### TESTS (1 test file, 101KB)
**Type:** Qt test runner  
**Coverage:** Engine's resource/copy logic only (~400 test cases for CopyResourceController)  
**Dependencies:** Engine (links to test resource classes)  
**Untested modules:** ChromeWorker, Studio, Scheduler, all plugin Modules (NO unit tests), no integration tests  
**Migration signal:** HIGH TEST RISK. Single test file = low coverage; migration efforts will be high-risk due to lack of regression harness.

---

## Cross-Module Dependency Map

```
Studio                   -> Engine (compilation, resources)
FastExecuteScript        -> Engine (scripting engine, resources)
RemoteExecuteScript      -> Updater http code + Engine
Updater                  -> Engine (logging, lite)
Scheduler                -> (independent; headless Qt)
SchedulerBrowser         -> (CEF only; independent)
ChromeWorker             -> (CEF only; independent)
WebInterfaceBrowser      -> (CEF only; independent)
ShopViewer               -> (Qt WebEngine; independent)
Modules (40 DLLs)        -> (mostly independent utilities, registered with Engine at link time)
Tests                    -> Engine (resources only)

Legend: -> means "depends on"
```

**Engine is the bottleneck:** Core library consumed by Studio, FastExecuteScript, RemoteExecuteScript, Updater, and all 40 Modules (via registration). Any migration must address Engine first or design robust FFI layer.

---

## Migration Risk Ranking (C++→Rust)

| Risk | Modules | Rationale |
|------|---------|-----------|
| **CRITICAL** | Engine, FastExecuteScript | Engine: Qt+WinAPI coupling + 760 files + 100+ public APIs. FastExecuteScript: blocked on Engine. |
| **HIGH** | ChromeWorker | 320 files, CEF+Protocol complexity, WinAPI marshalling. BUT: no Qt dependency (rewritable in isolation). |
| **MEDIUM** | Scheduler, Updater, RemoteExecuteScript | Portable business logic (HTTP, async tasks, ZIP), moderate Qt, low WinAPI. Good interop candidates if Engine → FFI layer. |
| **LOW** | Modules (most), WebInterfaceBrowser, SchedulerBrowser | Small, isolated DLLs or CEF wrappers. Minimal Qt. High confidence; BUT Module integration point (Engine registration) must be solved first. |
| **NEGLIGIBLE** | Studio, ShopViewer, Tests | Small UI apps; migrate last or retire. |

---

## Rust-Friendliness Indicators by Module

**Best Candidates (low interop friction):**
- WebInterfaceBrowser: ~16 files, CEF, no Qt → rewrite CEF handler directly
- SchedulerBrowser: ~13 files, similar profile
- Most Modules (non-image): Pure algorithmic code, no Qt/signals, no UI → FFI wrappers minimal
- Scheduler: headless Qt → replace with tokio-based async server (high confidence)

**Medium Difficulty (strategic abstraction needed):**
- ChromeWorker: large, but isolated from rest of codebase; protocol-heavy but self-contained
- Updater: HTTP+ZIP logic is portable; detach business layer from Qt UI
- RemoteExecuteScript: thin wrapper around HTTP utilities

**Hardest (redesign required):**
- Engine: monolithic, signal/slot event loop throughout, 100+ public headers, massive API surface
- FastExecuteScript: blocked on Engine design

**Unmigratable/defer:**
- Tests: retire and write new Rust test suite
- ShopViewer, Studio: trivial; last-mile Polish only

---

## Unresolved Questions

1. **Engine FFI boundary:** How to expose Engine's ~100 public headers to Rust? C-safe facade layer vs. rewrite?
2. **Modules registration:** How will 40 plugin DLLs discover/register with Engine during migration? Staging strategy needed.
3. **Qt event loop:** Scheduler/Updater use Qt's event loop for async operations. Rust equivalent (tokio/async-std)? Thread-safety guarantees during transition?
4. **Test strategy:** Only 1 real test file exists (Engine resources). Integration tests needed before attempting major refactors.

