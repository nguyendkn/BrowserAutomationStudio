$QtDir = "C:/Users/nguyendk/Documents/Projects/BrowserAutomationStudio/third_party/basbuild/Qt/5.15.2/msvc2019_64"
$env:QTDIR = $QtDir
$env:PATH = "$QtDir/bin;" + $env:PATH
$vcvars = "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Auxiliary\Build\vcvars64.bat"
$tmpFile = [IO.Path]::GetTempFileName()
$cmdNv = "`"$vcvars`" && set > `"$tmpFile`""
cmd /c $cmdNv | Out-Null
Get-Content $tmpFile | ForEach-Object {
  if ($_ -match "=") { $i = $_.IndexOf("="); $k = $_.Substring(0, $i); $v = $_.Substring($i + 1); Set-Item -Path "env:$k" -Value $v }
}
Remove-Item -LiteralPath $tmpFile -Force -ErrorAction SilentlyContinue
$env:BAS_PATH = "C:/Users/nguyendk/Documents/Projects/BrowserAutomationStudio/third_party/basbuild/BAS_PATH"
$env:BAS_PATH_WORKER = "C:/Users/nguyendk/Documents/Projects/BrowserAutomationStudio/third_party/basbuild/BAS_PATH_WORKER"
Write-Host "BAS_PATH=$env:BAS_PATH" -ForegroundColor Green
# ensure BAS_PATH dirs exist (create empty structure so INCLUDEPATH resolves even before libs built)
foreach ($d in @("$env:BAS_PATH/include","$env:BAS_PATH/lib","$env:BAS_PATH_WORKER/include","$env:BAS_PATH_WORKER/lib")) {
  if (-not (Test-Path $d)) { New-Item -ItemType Directory -Path $d -Force | Out-Null }
}
Set-Location "C:/Users/nguyendk/Documents/Projects/BrowserAutomationStudio/build-probe/Engine"
Write-Host "=== nmake Engine ===" -ForegroundColor Cyan
nmake 2>&1 | Select-Object -First 300
