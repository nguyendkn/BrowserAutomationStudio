# basbuild — Reconstructed Dependency Bundle

Tái tạo bundle `bablosoft/basbuild` (GitLab private, 403) để build `BrowserAutomationStudio` trên Windows.

## Env vars

| Var | Trỏ tới | Dùng bởi |
|-----|---------|----------|
| `BAS_PATH` | `third_party/basbuild/BAS_PATH` | Engine, Studio, FastExecuteScript, Updater, RemoteExecuteScript, Modules/*, Tests |
| `BAS_PATH_WORKER` | `third_party/basbuild/BAS_PATH_WORKER` | ChromeWorker, SchedulerBrowser, WebInterfaceBrowser |
| `QTDIR` / `PATH` | Qt install (xem `scripts/env-basbuild.ps1`) | qmake |

Chạy `scripts/env-basbuild.ps1` (hoặc `scripts/env-basbuild.bat`) để set env trước khi `qmake`.

## Bundle layout

```
third_party/basbuild/
  BAS_PATH/
    include/  ← curl, openssl, libxml2, boost, qscintilla, quazip, libmimetic, iconv, ...
    lib/      ← .lib tương ứng (+ libeay32/ssleay32 shim)
    bin/      ← DLLs nếu shared
  BAS_PATH_WORKER/
    include/  ← CEF include/ + worker-specific headers
    lib/      ← libcef, libcef_dll_wrapper, libiconv, network-uri, opencv 3.2.0, ...
    bin/      ← libcef.dll, cef.pak, icudtl.dat, ...
  logs/       ← build logs per-lib
  README.md   ← file này
  versions.lock ← pinned versions + SHA256
```

`BAS_PATH` và `BAS_PATH_WORKER` tách riêng (không gộp) để tránh CEF headers pollute Engine include path.

## Version pins

Xem `versions.lock`. Tóm tắt:

| Dep | Pin | Ghi chú |
|-----|-----|---------|
| Qt | 5.15.2 MSVC2019_64 | via aqtinstall; fallback 5.15.14 |
| CEF | ~118.x (Chromium 118) | Spotify builds; detection script trước khi chốt |
| Boost | 1.82.0 | cho mongo legacy + MSVC 14.44 |
| Mongo legacy (`mongoclient`) | legacy-1.1.2 | rủi ro cao nhất — có stub fallback |
| OpenSSL | 1.1.1w + libeay32/ssleay32 shim | .pro dùng tên 1.0.x |
| OpenCV | 3.2.0 exact | `opencv_core320` pin cứng |
| QScintilla | 2.13.4 | phải match Qt 5.15.2 |
| QuaZip | 0.7.x | `QUAZIP_STATIC` |
| libcurl | 7.88.x `CURL_STATICLIB` | |
| zlib | 1.2.x | |
| libxml2 | 2.10.x | |
| libiconv | 1.17 | `-llibiconv` vs `-liconv` — cung cấp cả hai tên |
| libmimetic | 0.9.8 | `-llibmimetic` / `-llibmimetic_d` |
| ixwebsocket | 11.x | |
| network-uri | latest | |
| Enigma | stub | commercial, chỉ khi `ENIGMA_PROTECTED` |

## Build order (DAG)

1. Qt (aqtinstall) + CEF binary + OpenCV prebuilt — song song
2. zlib, libiconv, OpenSSL + shim
3. libxml2 (zlib+iconv), libcurl (openssl+zlib), Boost
4. OpenCV (zlib), QScintilla (Qt), libmimetic, network-uri, ixwebsocket
5. Mongo legacy (Boost+OpenSSL) — cuối, cô lập
6. CEF libcef_dll_wrapper build (/MT)

Mỗi lib resume-safe: `fetch-basbuild.ps1` skip nếu `lib/foo.lib` đã tồn tại.

## Known issues / degraded modes

- **Mongo stub**: nếu `mongoclient` không build được với MSVC 14.44, tạo header/lib stub no-op (mất Mongo runtime, build+launch vẫn pass).
- **OpenSSL shim**: `libeay32.lib` = copy `libcrypto.lib`, `ssleay32.lib` = copy `libssl.lib`.
- **/MT vs /MD**: ChromeWorker/Engine force `/MT`; Qt/CEF prebuilt là `/MD`. Thử patch `.pro` sang `/MD` trước (ít tốn), rebuild Qt/CEF từ source với `/MT` nếu cần fidelity.

## Verification gates

0. `echo %BAS_PATH%`, `qmake -query QT_VERSION` == 5.15.2
1. `qmake Solution/Solution.pro` sinh Makefile không lỗi
2. `nmake`/`jom` cho Engine + ChromeWorker — `.dll`/`.exe` tồn tại
3. Launch `Studio.exe` / `ChromeWorker.exe` — process alive, không missing DLL
