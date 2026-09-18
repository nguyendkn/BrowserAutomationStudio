<#
.SYNOPSIS
  Fetch & build the reconstructed basbuild bundle (full scope).
  Idempotent — each step skips if its output already exists. Resume-safe.
  Run from repo root:  powershell -ExecutionPolicy Bypass -File scripts/fetch-basbuild.ps1
  Or with options:     .\scripts\fetch-basbuild.ps1 -Target Qt,CEF,zlib
#>
[CmdletBinding()]
param(
  [string[]]$Target,          # limit to named targets (e.g. Qt, CEF, OpenCV, zlib, ...)
  [switch]$Force,             # rebuild even if output exists
  [string]$QtVersion = "5.15.2",
  [string]$QtArch    = "win64_msvc2019_64"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoRoot = (Resolve-Path "$PSScriptRoot/..").Path
$BasbuildRoot = Join-Path $RepoRoot "third_party/basbuild"
$BasPath      = Join-Path $BasbuildRoot "BAS_PATH"
$WorkerPath   = Join-Path $BasbuildRoot "BAS_PATH_WORKER"
$LogDir       = Join-Path $BasbuildRoot "logs"
$CacheDir     = Join-Path $BasbuildRoot "_cache"

function Ensure-Dirs {
  foreach ($d in @($BasbuildRoot, $BasPath, $WorkerPath,
                   "$BasPath/include", "$BasPath/lib", "$BasPath/bin",
                   "$WorkerPath/include", "$WorkerPath/lib", "$WorkerPath/bin",
                   $LogDir, $CacheDir)) {
    if (-not (Test-Path $d)) { New-Item -ItemType Directory -Path $d | Out-Null }
  }
}

function Should-Run($name) {
  if (-not $Target -or $Target.Count -eq 0) { return $true }
  return $Target -contains $name
}

function Invoke-Logged($name, [scriptblock]$action) {
  if (-not (Should-Run $name)) { Write-Host "SKIP [$name] (not in -Target)" -ForegroundColor DarkGray; return }
  $log = Join-Path $LogDir "$name.log"
  Write-Host "`n=== [$name] ===" -ForegroundColor Cyan
  try { & $action 2>&1 | Tee-Object -FilePath $log; Write-Host "[$name] done -> $log" -ForegroundColor Green }
  catch { $_ | Out-File -Append $log; Write-Host "[$name] FAILED (see $log): $_" -ForegroundColor Red; throw }
}

function Test-Skip($path, $label) {
  if (-not $Force -and (Test-Path $path)) { Write-Host "  SKIP $label (exists: $path) use -Force to rebuild" -ForegroundColor DarkGray; return $true }
  return $false
}

function Get-VsDevShell {
  $vswhere = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"
  if (Test-Path $vswhere) {
    $vsPath = & $vswhere -latest -products * -property installationPath
    if ($vsPath) { return $vsPath }
  }
  return "C:\Program Files\Microsoft Visual Studio\2022\BuildTools"
}

# ── Qt 5.15.2 via aqtinstall ─────────────────────────────────────────────
function Install-Qt {
  $qmake = Join-Path $BasbuildRoot "Qt/$QtVersion/msvc2019_64/bin/qmake.exe"
  if (Test-Skip $qmake "Qt $QtVersion") { return }

  $aqt = Get-Command aqt -ErrorAction SilentlyContinue
  if (-not $aqt) {
    Write-Host "  Installing aqtinstall via pip..." -ForegroundColor Yellow
    python -m pip install --quiet aqtinstall
  }

  $qtRoot = Join-Path $BasbuildRoot "Qt"
  Write-Host "  aqt install-qt windows desktop $QtVersion $QtArch -O $qtRoot"
  aqt install-qt windows desktop $QtVersion $QtArch -O $qtRoot
  aqt install-qt windows desktop $QtVersion --arch $QtArch --modules qtwebengine -O $qtRoot 2>$null | Out-Null
  # qtscript is part of base on 5.15.2; no extra module needed

  if (-not (Test-Path $qmake)) {
    Write-Host "  aqt did not produce qmake at $qmake — check aqt output. Fallback: download from https://download.qt.io/official_releases/qt/5.15/$QtVersion/" -ForegroundColor Red
    throw "Qt install failed"
  }
  & $qmake -query QT_VERSION
}

# ── CEF 118 ──────────────────────────────────────────────────────────────
function Install-CEF {
  $cefLib = Join-Path $WorkerPath "lib/libcef.lib"
  if (Test-Skip $cefLib "CEF") { return }

  $cefVer = "118.4.13+gcocb589+chromium-118.0.5993.117"
  $cefName = "cef_binary_${cefVer}_windows64"
  $cefArchive = Join-Path $CacheDir "$cefName.tar.bz2"
  $cefUrl = "https://cef-builds.spotifycdn.com/$cefName.tar.bz2"

  if (-not (Test-Path $cefArchive)) {
    Write-Host "  Downloading CEF $cefVer ..."
    Invoke-WebRequest -Uri $cefUrl -OutFile $cefArchive
  }

  $cefExtract = Join-Path $CacheDir $cefName
  if (-not (Test-Path $cefExtract)) {
    Write-Host "  Extracting CEF ..."
    tar -xf $cefArchive -C $CacheDir  # Windows 10+ tar handles bz2
  }

  # Stage headers + libs + bin
  Copy-Item "$cefExtract/include/*" "$WorkerPath/include/" -Recurse -Force
  Copy-Item "$cefExtract/Release/libcef.lib" "$WorkerPath/lib/" -Force
  Copy-Item "$cefExtract/Release/*.dll" "$WorkerPath/bin/" -Force -ErrorAction SilentlyContinue
  Copy-Item "$cefExtract/Release/*.pak" "$WorkerPath/bin/" -Force -ErrorAction SilentlyContinue
  Copy-Item "$cefExtract/Release/*.dat" "$WorkerPath/bin/" -Force -ErrorAction SilentlyContinue
  Copy-Item "$cefExtract/Resources/*" "$WorkerPath/bin/" -Recurse -Force -ErrorAction SilentlyContinue

  # Build libcef_dll_wrapper with /MT
  $wrapperSrc = Join-Path $cefExtract "libcef_dll/wrapper"
  # CEF ships libcef_dll_wrapper as source; build via CMake
  $buildDir = Join-Path $CacheDir "cef_wrapper_build"
  if (Test-Path $buildDir) { Remove-Item $buildDir -Recurse -Force }
  New-Item -ItemType Directory -Path $buildDir | Out-Null
  $vsPath = Get-VsDevShell
  $cmakeArgs = @(
    "-S", $cefExtract,
    "-B", $buildDir,
    "-G", "Visual Studio 17 2022", "-A", "x64",
    "-DCMAKE_MSVC_RUNTIME_LIBRARY=MultiThreaded$<$<CONFIG:Debug>:Debug>",
    "-DCEF_RUNTIME_LIBRARY_FLAG=/MT"
  )
  cmake @cmakeArgs
  cmake --build $buildDir --config Release --target libcef_dll_wrapper
  $builtWrapper = Get-ChildItem $buildDir -Recurse -Filter "libcef_dll_wrapper.lib" | Select-Object -First 1
  if ($builtWrapper) { Copy-Item $builtWrapper.FullName "$WorkerPath/lib/libcef_dll_wrapper.lib" -Force }
  else { Write-Host "  WARN: libcef_dll_wrapper.lib not found after build — check $buildDir" -ForegroundColor Yellow }
}

# ── zlib ─────────────────────────────────────────────────────────────────
function Install-Zlib {
  $lib = Join-Path $BasPath "lib/zlib.lib"
  if (Test-Skip $lib "zlib") { Copy-Item $lib "$WorkerPath/lib/zlib.lib" -Force -ErrorAction SilentlyContinue; return }
  $ver = "1.3.1"; $name = "zlib-$ver"
  $archive = Join-Path $CacheDir "$name.tar.gz"
  if (-not (Test-Path $archive)) { Invoke-WebRequest "https://zlib.net/$name.tar.gz" -OutFile $archive }
  $src = Join-Path $CacheDir $name
  if (-not (Test-Path $src)) { tar -xzf $archive -C $CacheDir }
  $vsPath = Get-VsDevShell
  Push-Location $src
  nmake /f win32/Makefile.msc 2>&1 | Out-Null
  Copy-Item "zlib.lib" "$BasPath/lib/zlib.lib" -Force
  Copy-Item "zlib.h" "$BasPath/include/zlib.h" -Force
  Copy-Item "zconf.h" "$BasPath/include/zconf.h" -Force
  Pop-Location
  Copy-Item "$BasPath/lib/zlib.lib" "$WorkerPath/lib/zlib.lib" -Force
}

# ── libiconv ─────────────────────────────────────────────────────────────
function Install-LibIconv {
  $lib = Join-Path $BasPath "lib/libiconv.lib"
  if (Test-Skip $lib "libiconv") { return }
  $ver = "1.17"; $name = "libiconv-$ver"
  $archive = Join-Path $CacheDir "$name.tar.gz"
  if (-not (Test-Path $archive)) { Invoke-WebRequest "https://ftp.gnu.org/pub/gnu/libiconv/$name.tar.gz" -OutFile $archive }
  $src = Join-Path $CacheDir $name
  if (-not (Test-Path $src)) { tar -xzf $archive -C $CacheDir }
  Push-Location $src
  # Use CMake if available, else nmake
  $bdir = Join-Path $CacheDir "libiconv_build"
  if (Test-Path $bdir) { Remove-Item $bdir -Recurse -Force }
  New-Item -ItemType Directory -Path $bdir | Out-Null
  cmake -S . -B $bdir -G "Visual Studio 17 2022" -A x64 -DBUILD_SHARED_LIBS=OFF -DCMAKE_MSVC_RUNTIME_LIBRARY="MultiThreaded$<$<CONFIG:Debug>:Debug>" 2>&1 | Out-Null
  cmake --build $bdir --config Release 2>&1 | Out-Null
  $built = Get-ChildItem $bdir -Recurse -Filter "iconv.lib" | Select-Object -First 1
  if ($built) {
    Copy-Item $built.FullName "$BasPath/lib/libiconv.lib" -Force
    Copy-Item $built.FullName "$BasPath/lib/iconv.lib" -Force
    Copy-Item "$src/include/iconv.h" "$BasPath/include/iconv.h" -Force -ErrorAction SilentlyContinue
  } else { Write-Host "  WARN: iconv.lib not found — manual check $bdir" -ForegroundColor Yellow }
  Pop-Location
  Copy-Item "$BasPath/lib/libiconv.lib" "$WorkerPath/lib/libiconv.lib" -Force -ErrorAction SilentlyContinue
  Copy-Item "$BasPath/lib/iconv.lib" "$WorkerPath/lib/iconv.lib" -Force -ErrorAction SilentlyContinue
}

# ── OpenSSL 1.1.1w + shim ────────────────────────────────────────────────
function Install-OpenSSL {
  $lib = Join-Path $BasPath "lib/libeay32.lib"
  if (Test-Skip $lib "OpenSSL") { return }
  $ver = "1.1.1w"; $name = "openssl-$ver"
  $archive = Join-Path $CacheDir "$name.tar.gz"
  if (-not (Test-Path $archive)) { Invoke-WebRequest "https://www.openssl.org/source/$name.tar.gz" -OutFile $archive }
  $src = Join-Path $CacheDir $name
  if (-not (Test-Path $src)) { tar -xzf $archive -C $CacheDir }
  Push-Location $src
  perl Configure VC-WIN64A no-shared --prefix="$BasPath/openssl_stage" --openssldir="$BasPath/openssl_stage/ssl"
  nmake
  nmake install
  Pop-Location
  # Stage to BAS_PATH
  Copy-Item "$BasPath/openssl_stage/lib/libcrypto.lib" "$BasPath/lib/libcrypto.lib" -Force -ErrorAction SilentlyContinue
  Copy-Item "$BasPath/openssl_stage/lib/libssl.lib" "$BasPath/lib/libssl.lib" -Force -ErrorAction SilentlyContinue
  Copy-Item "$BasPath/openssl_stage/include/openssl/*" "$BasPath/include/openssl/" -Recurse -Force -ErrorAction SilentlyContinue
  # Shim for .pro legacy names
  Copy-Item "$BasPath/lib/libcrypto.lib" "$BasPath/lib/libeay32.lib" -Force
  Copy-Item "$BasPath/lib/libssl.lib" "$BasPath/lib/ssleay32.lib" -Force
  Copy-Item "$BasPath/lib/libcrypto.lib" "$WorkerPath/lib/libcrypto.lib" -Force -ErrorAction SilentlyContinue
  Copy-Item "$BasPath/lib/libssl.lib" "$WorkerPath/lib/libssl.lib" -Force -ErrorAction SilentlyContinue
  Copy-Item "$BasPath/lib/libeay32.lib" "$WorkerPath/lib/libeay32.lib" -Force
  Copy-Item "$BasPath/lib/ssleay32.lib" "$WorkerPath/lib/ssleay32.lib" -Force
}

# ── OpenCV 3.2.0 ─────────────────────────────────────────────────────────
function Install-OpenCV {
  $lib = Join-Path $WorkerPath "lib/opencv_core320.lib"
  if (Test-Skip $lib "OpenCV") { Copy-Item $lib "$BasPath/lib/opencv_core320.lib" -Force -ErrorAction SilentlyContinue; return }
  $ver = "3.2.0"; $archive = Join-Path $CacheDir "opencv-$ver.zip"
  if (-not (Test-Path $archive)) { Invoke-WebRequest "https://github.com/opencv/opencv/archive/$ver.zip" -OutFile $archive }
  $src = Join-Path $CacheDir "opencv-$ver"
  if (-not (Test-Path $src)) { Expand-Archive $archive -DestinationPath $CacheDir }
  $bdir = Join-Path $CacheDir "opencv_build"
  if (Test-Path $bdir) { Remove-Item $bdir -Recurse -Force }
  New-Item -ItemType Directory -Path $bdir | Out-Null
  cmake -S $src -B $bdir -G "Visual Studio 17 2022" -A x64 -DBUILD_SHARED_LIBS=OFF -DCMAKE_MSVC_RUNTIME_LIBRARY="MultiThreaded$<$<CONFIG:Debug>:Debug>" -DWITH_IPP=OFF -DBUILD_TESTS=OFF -DBUILD_PERF_TESTS=OFF -DBUILD_EXAMPLES=OFF
  cmake --build $bdir --config Release -j 4
  $core = Get-ChildItem $bdir -Recurse -Filter "opencv_core320.lib" | Select-Object -First 1
  $imgproc = Get-ChildItem $bdir -Recurse -Filter "opencv_imgproc320.lib" | Select-Object -First 1
  if ($core) { Copy-Item $core.FullName "$WorkerPath/lib/opencv_core320.lib" -Force; Copy-Item $core.FullName "$BasPath/lib/opencv_core320.lib" -Force }
  if ($imgproc) { Copy-Item $imgproc.FullName "$WorkerPath/lib/opencv_imgproc320.lib" -Force; Copy-Item $imgproc.FullName "$BasPath/lib/opencv_imgproc320.lib" -Force }
  Copy-Item "$src/include/opencv2" "$BasPath/include/opencv2" -Recurse -Force -ErrorAction SilentlyContinue
  Copy-Item "$src/include/opencv2" "$WorkerPath/include/opencv2" -Recurse -Force -ErrorAction SilentlyContinue
}

# ── QScintilla 2.13.4 ────────────────────────────────────────────────────
function Install-QScintilla {
  $lib = Join-Path $BasPath "lib/qscintilla2.lib"
  if (Test-Skip $lib "QScintilla") { return }
  $ver = "2.13.4"; $archive = Join-Path $CacheDir "QScintilla_src-$ver.zip"
  if (-not (Test-Path $archive)) { Invoke-WebRequest "https://www.riverbankcomputing.com/static/Downloads/QScintilla/$ver/QScintilla_src-$ver.zip" -OutFile $archive }
  $src = Join-Path $CacheDir "QScintilla_src-$ver"
  if (-not (Test-Path $src)) { Expand-Archive $archive -DestinationPath $CacheDir }
  $qmake = Join-Path $BasbuildRoot "Qt/$QtVersion/msvc2019_64/bin/qmake.exe"
  Push-Location "$src/src"
  & $qmake qscintilla.pro
  nmake
  nmake install
  Pop-Location
  $built = Get-ChildItem "$src" -Recurse -Filter "qscintilla2.lib" | Select-Object -First 1
  if ($built) { Copy-Item $built.FullName "$BasPath/lib/qscintilla2.lib" -Force }
}

# ── QuaZip ───────────────────────────────────────────────────────────────
function Install-QuaZip {
  # QuaZip is header-heavy; ensure BAS_PATH has quazip headers
  $marker = Join-Path $BasPath "include/quazip/quazip.h"
  if (Test-Skip $marker "QuaZip") { return }
  $archive = Join-Path $CacheDir "quazip-1.4.zip"
  if (-not (Test-Path $archive)) { Invoke-WebRequest "https://github.com/stachenov/quazip/archive/v1.4.zip" -OutFile $archive }
  $src = Join-Path $CacheDir "quazip-1.4"
  if (-not (Test-Path $src)) { Expand-Archive $archive -DestinationPath $CacheDir }
  $qmake = Join-Path $BasbuildRoot "Qt/$QtVersion/msvc2019_64/bin/qmake.exe"
  $bdir = Join-Path $CacheDir "quazip_build"
  if (Test-Path $bdir) { Remove-Item $bdir -Recurse -Force }
  New-Item -ItemType Directory -Path $bdir | Out-Null
  Push-Location $bdir
  & $qmake "$src/quazip/quazip.pro" "CONFIG+=staticlib"
  nmake
  Pop-Location
  $built = Get-ChildItem $bdir -Recurse -Filter "quazip*.lib" | Select-Object -First 1
  if ($built) { Copy-Item $built.FullName "$BasPath/lib/quazip.lib" -Force }
  Copy-Item "$src/quazip/*.h" "$BasPath/include/quazip/" -Force -ErrorAction SilentlyContinue
}

# ── Boost 1.82.0 ─────────────────────────────────────────────────────────
function Install-Boost {
  $lib = Join-Path $BasPath "lib/libboost_system-vc143-mt-x64-1_82.lib"
  # also check generic name
  if ((-not $Force) -and ((Test-Path $lib) -or (Test-Path "$BasPath/lib/boost_system.lib"))) { Write-Host "  SKIP Boost (exists)" -ForegroundColor DarkGray; return }
  $ver = "1.82.0"; $dash = $ver.Replace(".", "_")
  $archive = Join-Path $CacheDir "boost_1_82_0.zip"
  if (-not (Test-Path $archive)) { Invoke-WebRequest "https://archives.boost.io/release/$ver/source/boost_1_82_0.zip" -OutFile $archive }
  $src = Join-Path $CacheDir "boost_1_82_0"
  if (-not (Test-Path $src)) { Expand-Archive $archive -DestinationPath $CacheDir }
  Push-Location $src
  if (-not (Test-Path "b2.exe")) { .\bootstrap.bat }
  .\b2 --build-type=complete --with-system --with-filesystem --with-thread --with-regex --with-chrono --with-date_time `
    link=static runtime-link=static threading=multi address-model=64 variant=release,debug `
    --layout=tagged --stagedir="$BasPath/boost_stage" stage 2>&1 | Out-Null
  Pop-Location
  Copy-Item "$BasPath/boost_stage/lib/*" "$BasPath/lib/" -Force -ErrorAction SilentlyContinue
  Copy-Item "$src/boost" "$BasPath/include/boost" -Recurse -Force -ErrorAction SilentlyContinue
  # Provide generic names alongside tagged ones for .pro compatibility
  foreach ($pair in @(
    @("libboost_system*.lib", "boost_system.lib"),
    @("libboost_filesystem*.lib", "boost_filesystem.lib"),
    @("libboost_thread*.lib", "boost_thread.lib")
  )) {
    $found = Get-ChildItem "$BasPath/lib" -Filter $pair[0] | Select-Object -First 1
    if ($found) { Copy-Item $found.FullName "$BasPath/lib/$($pair[1])" -Force }
  }
}

# ── Mongo legacy driver ──────────────────────────────────────────────────
function Install-MongoLegacy {
  $lib = Join-Path $BasPath "lib/mongoclient.lib"
  if (Test-Skip $lib "MongoLegacy") { return }
  Write-Host "  WARN: Mongo legacy driver is highest-risk — attempting scons build, will stub on failure." -ForegroundColor Yellow
  $archive = Join-Path $CacheDir "mongo-cxx-driver-legacy-1.1.2.tar.gz"
  if (-not (Test-Path $archive)) {
    Invoke-WebRequest "https://github.com/mongodb/mongo-cxx-driver/archive/legacy-1.1.2.tar.gz" -OutFile $archive
  }
  $src = Join-Path $CacheDir "mongo-cxx-driver-legacy-1.1.2"
  if (-not (Test-Path $src)) { tar -xzf $archive -C $CacheDir }
  Push-Location $src
  $sconsOk = $false
  try {
    scons --c++11=on --ssl --use-boost --prefix="$BasPath/mongo_stage" install 2>&1 | Tee-Object (Join-Path $LogDir "mongo_scons.log")
    $sconsOk = $true
  } catch { Write-Host "  scons failed: $_" -ForegroundColor Yellow }
  Pop-Location
  if ($sconsOk -and (Test-Path "$BasPath/mongo_stage/lib/mongoclient.lib")) {
    Copy-Item "$BasPath/mongo_stage/lib/mongoclient.lib" "$BasPath/lib/mongoclient.lib" -Force
    Copy-Item "$BasPath/mongo_stage/include/mongo" "$BasPath/include/mongo" -Recurse -Force -ErrorAction SilentlyContinue
  } else {
    Write-Host "  STUB: creating mongoclient.lib stub (NO_MONGO degraded mode)" -ForegroundColor Yellow
    # Header stub
    $mongoInc = Join-Path $BasPath "include/mongo/client"
    if (-not (Test-Path $mongoInc)) { New-Item -ItemType Directory -Path $mongoInc -Force | Out-Null }
    @"
#pragma once
// STUB — real mongo legacy driver not built. Engine will compile but Mongo runtime is no-op.
// Re-run with real driver to restore DB connectivity.
namespace mongo {
  class DBClientConnection {
  public:
    bool connect(const std::string&, std::string&) { return false; }
  };
}
"@ | Set-Content "$mongoInc/dbclient.h" -Encoding UTF8
    # Empty static lib via `lib` tool so link succeeds (no symbols — Engine's mongodatabaseconnector will still need guard)
    $stubObj = Join-Path $CacheDir "mongo_stub.obj"
    $stubAsm = Join-Path $CacheDir "mongo_stub.asm"
    "int mongo_stub_dummy=0;" | Set-Content $stubAsm
    # Use cl to produce obj, then lib
    cl /c /Fo"$stubObj" "$stubAsm" 2>$null
    lib /OUT:"$BasPath/lib/mongoclient.lib" "$stubObj" 2>$null
    "# STUB — see README Known issues" | Set-Content (Join-Path $LogDir "mongo_stub.txt")
  }
}

# ── Enigma stub ──────────────────────────────────────────────────────────
function Install-EnigmaStub {
  $lib = Join-Path $BasPath "lib/enigma.lib"
  if (Test-Skip $lib "EnigmaStub") { return }
  $asm = Join-Path $CacheDir "enigma_stub.asm"
  $obj = Join-Path $CacheDir "enigma_stub.obj"
  "int enigma_stub_dummy=0;" | Set-Content $asm -Encoding UTF8
  cl /c /Fo"$obj" "$asm" 2>$null
  lib /OUT:"$lib" "$obj" 2>$null
  Write-Host "  enigma.lib stub created (only needed when ENIGMA_PROTECTED)" -ForegroundColor DarkGray
}

# ── main ─────────────────────────────────────────────────────────────────
Ensure-Dirs

# Ensure VS env for cl/lib/nmake (MUST use tmpFile pattern, and AFTER that set BAS_PATH env)
$vsPath = Get-VsDevShell
$vcvars = Join-Path $vsPath "VC/Auxiliary/Build/vcvars64.bat"
if (Test-Path $vcvars) {
  Write-Host "Loading vcvars64.bat from $vsPath" -ForegroundColor DarkGray
  $tmpFetch = [IO.Path]::GetTempFileName()
  $cmdFetch = "`"$vcvars`" && set > `"$tmpFetch`""
  cmd /c $cmdFetch | Out-Null
  Get-Content $tmpFetch | ForEach-Object {
    if ($_ -match "=") { $ij = $_.IndexOf("="); $kk = $_.Substring(0,$ij); $vv = $_.Substring($ij+1); Set-Item -Path "env:$kk" -Value $vv }
  }
  Remove-Item -LiteralPath $tmpFetch -Force -ErrorAction SilentlyContinue
}
# Re-set BAS_PATH after vcvars import (vcvars may have cleared custom vars)
$env:BAS_PATH = $BasPath
$env:BAS_PATH_WORKER = $WorkerPath

Invoke-Logged "Qt"          { Install-Qt }
Invoke-Logged "CEF"         { Install-CEF }
Invoke-Logged "zlib"        { Install-Zlib }
Invoke-Logged "libiconv"    { Install-LibIconv }
Invoke-Logged "OpenSSL"     { Install-OpenSSL }
Invoke-Logged "OpenCV"      { Install-OpenCV }
Invoke-Logged "QScintilla"  { Install-QScintilla }
Invoke-Logged "QuaZip"      { Install-QuaZip }
Invoke-Logged "Boost"       { Install-Boost }
Invoke-Logged "MongoLegacy" { Install-MongoLegacy }
Invoke-Logged "EnigmaStub"  { Install-EnigmaStub }

Write-Host "`nAll targets done. Logs in $LogDir" -ForegroundColor Green
Write-Host "Next: run scripts/env-basbuild.ps1 then qmake probe (see third_party/basbuild/README.md Gates 0-1)" -ForegroundColor Cyan
