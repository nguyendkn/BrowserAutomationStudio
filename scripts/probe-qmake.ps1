$QtDir = "C:/Users/nguyendk/Documents/Projects/BrowserAutomationStudio/third_party/basbuild/Qt/5.15.2/msvc2019_64"
$env:QTDIR = $QtDir
$env:PATH = "$QtDir/bin;" + $env:PATH

# Load VS env FIRST
$vswhere = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"
$vsPath = $null
if (Test-Path $vswhere) { $vsPath = & $vswhere -latest -products * -property installationPath 2>$null }
if (-not $vsPath) { $vsPath = "C:\Program Files\Microsoft Visual Studio\2022\BuildTools" }
$vcvars = Join-Path $vsPath "VC/Auxiliary/Build/vcvars64.bat"
Write-Host "Loading $vcvars ..."
$tmpFile = [IO.Path]::GetTempFileName()
$cmdPv = "`"$vcvars`" && set > `"$tmpFile`""
cmd /c $cmdPv | Out-Null
Get-Content $tmpFile | ForEach-Object {
  if ($_ -match "=") {
    $idx = $_.IndexOf("=")
    $k = $_.Substring(0, $idx)
    $v = $_.Substring($idx + 1)
    Set-Item -Path "env:$k" -Value $v
  }
}
Remove-Item -LiteralPath $tmpFile -Force -ErrorAction SilentlyContinue

# NOW set BAS_PATH after vcvars so it is not clobbered
$env:BAS_PATH = "C:/Users/nguyendk/Documents/Projects/BrowserAutomationStudio/third_party/basbuild/BAS_PATH"
$env:BAS_PATH_WORKER = "C:/Users/nguyendk/Documents/Projects/BrowserAutomationStudio/third_party/basbuild/BAS_PATH_WORKER"

Write-Host "qmake version:"
qmake --version 2>&1 | Select-Object -First 3
Write-Host "BAS_PATH=$env:BAS_PATH"
Write-Host "BAS_PATH_WORKER=$env:BAS_PATH_WORKER"
Write-Host "VSCMD_VER=$env:VSCMD_VER"

$probeDir = "C:/Users/nguyendk/Documents/Projects/BrowserAutomationStudio/build-probe"
New-Item -ItemType Directory -Force -Path $probeDir | Out-Null
Set-Location $probeDir
Remove-Item -Force -ErrorAction SilentlyContinue Makefile*,*.pro.user,*.log 2>$null

Write-Host "`n=== qmake Solution/Solution.pro ==="
qmake "../Solution/Solution.pro" -r CONFIG+=release 2>&1 | Select-Object -First 100
Write-Host "`n=== Makefile exists? ==="
if (Test-Path "Makefile") { Write-Host "Makefile OK" } else { Write-Host "NO Makefile" -ForegroundColor Red }
Get-ChildItem -ErrorAction SilentlyContinue | ForEach-Object { Write-Host $_.Name }

Write-Host "`n=== qmake Probe Engine.pro individually ==="
Remove-Item -Force Makefile* 2>$null
qmake "../Solution/Engine/Engine.pro" CONFIG+=release 2>&1 | Select-Object -First 150
Write-Host "`n=== Engine Makefile? ==="
if (Test-Path "Makefile") { Write-Host "Engine Makefile OK" } else { Write-Host "NO Engine Makefile" -ForegroundColor Red }
# Show BAS_PATH resolution check
Write-Host "`n=== Makefile BAS_PATH check ==="
Select-String -Path Makefile -Pattern "BAS_PATH|INCLUDEPATH" 2>$null | Select-Object -First 5 | ForEach-Object { Write-Host $_.Line }
