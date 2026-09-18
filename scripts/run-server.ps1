param([int]$Port = 18080)
. "$PSScriptRoot/env-server.ps1" -Port $Port
$api = "server/build/api/release/basapi.exe"
if (-not (Test-Path $api)) { Write-Host "Build first: qmake server/server.pro -r CONFIG+=release && nmake" -ForegroundColor Red; exit 1 }
Write-Host "Starting $api --port $Port" -ForegroundColor Cyan
& $api --port $Port
