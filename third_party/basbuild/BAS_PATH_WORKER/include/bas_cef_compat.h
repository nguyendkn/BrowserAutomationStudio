#pragma once
// Compat shim for BAS ChromeWorker + CEF 118
#include <cstdint>
#include <string>
#include <utility>
#ifndef OVERRIDE
#define OVERRIDE override
#endif
#ifndef WARN_UNUSED_RESULT
#define WARN_UNUSED_RESULT
#endif
#ifndef BAS_CEF_INT64_DEFINED
#define BAS_CEF_INT64_DEFINED
using int64 = int64_t;
using uint64 = uint64_t;
#endif
// Pull Windows + common dialogs early so FINDREPLACE is available in all TUs
// (browsercontextmenu.h uses FINDREPLACE). Keep NOMINMAX to not clash with std::min/max.
#ifdef _WIN32
#ifndef NOMINMAX
#define NOMINMAX
#endif
#include <windows.h>
#include <commdlg.h>
#endif

// --- BAS CEF118 compatibility fixes ---
#define BAS_CEF_FIXES 1
#include <algorithm>
