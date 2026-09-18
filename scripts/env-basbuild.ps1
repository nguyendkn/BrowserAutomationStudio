<#
.SYNOPSIS
  Set up env for BAS qmake/nmake builds against reconstructed basbuild.
  Usage:  . .\scripts\env-basbuild.ps1   (dot-source so env persists)
          or:  powershell -ExecutionPolicy Bypass -File scripts/env-basbuild.ps1; then qmake ...
#>
$RepoRoot = (Resolve-Path "$PSScriptRoot/..").Path
$BasbuildRoot = Join-Path $RepoRoot "third_party/basbuild"
$BasPath      = Join-Path $BasbuildRoot "BAS_PATH"
$WorkerPath   = Join-Path $BasbuildRoot "BAS_PATH_WORKER"

$QtVersion = "5.15.2"
$QtDir = Join-Path $BasbuildRoot "Qt/$QtVersion/msvc2019_64"
if (-not (Test-Path $QtDir)) {
  $found = Get-ChildItem "$BasbuildRoot/Qt" -Directory -ErrorAction SilentlyContinue | Sort-Object Name -Descending | Select-Object -First 1
  if ($found) {
    $inner = Get-ChildItem $found.FullName -Directory -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($inner) { $QtDir = $inner.FullName }
  }
}
if (Test-Path $QtDir) {
  $env:QTDIR = $QtDir
  $env:PATH = "$QtDir/bin;$env:PATH"
  Write-Host "QTDIR=$QtDir" -ForegroundColor Green
  try { qmake -query QT_VERSION | ForEach-Object { Write-Host "qmake QT_VERSION: $_" -ForegroundColor Green } } catch { Write-Host "qmake not in PATH after QTDIR set" -ForegroundColor Yellow }
} else {
  Write-Host "Qt not found at $QtDir - run fetch-basbuild.ps1 -Target Qt first" -ForegroundColor Yellow
}

# Load VS env BEFORE setting BAS_PATH so vcvars import does not clobber it
if (-not $env:VCINSTALLDIR) {
  $vswhere = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"
  $vsPath = $null
  if (Test-Path $vswhere) { $vsPath = & $vswhere -latest -products * -property installationPath 2>$null }
  if (-not $vsPath) { $vsPath = "C:\Program Files\Microsoft Visual Studio\2022\BuildTools" }
  $vcvars = Join-Path $vsPath "VC/Auxiliary/Build/vcvars64.bat"
  if (Test-Path $vcvars) {
    Write-Host "Loading $vcvars ..." -ForegroundColor DarkGray
    $tmpFileEnv = [IO.Path]::GetTempFileName()
    $cmdEnv = "`"$vcvars`" && set > `"$tmpFileEnv`""
    cmd /c $cmdEnv | Out-Null
    Get-Content $tmpFileEnv | ForEach-Object {
      if ($_ -match "=") { $idx2 = $_.IndexOf("="); $kk = $_.Substring(0,$idx2); $vv = $_.Substring($idx2+1); Set-Item -Path "env:$kk" -Value $vv }
    }
    Remove-Item -LiteralPath $tmpFileEnv -Force -ErrorAction SilentlyContinue
    Write-Host "VS env loaded (VCINSTALLDIR=$env:VCINSTALLDIR)" -ForegroundColor Green
  }
}

$env:BAS_PATH = $BasPath
$env:BAS_PATH_WORKER = $WorkerPath
Write-Host "BAS_PATH=$env:BAS_PATH" -ForegroundColor Green
Write-Host "BAS_PATH_WORKER=$env:BAS_PATH_WORKER" -ForegroundColor Green

foreach ($pp in @("$BasPath/lib", "$WorkerPath/lib")) {
  if (Test-Path $pp) {
    $cnt = (Get-ChildItem $pp -ErrorAction SilentlyContinue | Measure-Object).Count
    Write-Host "OK $pp ($cnt files)" -ForegroundColor DarkGray
  } else {
    Write-Host "MISSING $pp - run fetch-basbuild.ps1" -ForegroundColor Yellow
  }
}

Write-Host "`nEnv ready. Try:" -ForegroundColor Cyan
Write-Host "  qmake --version" -ForegroundColor White
Write-Host "  qmake Solution/Solution.pro -r CONFIG+=release && nmake" -ForegroundColor White
