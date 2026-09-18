# dot-source: . .\scripts\env-server.ps1  [--port 18080]
param([int]$Port = 18080)
. "$PSScriptRoot/env-basbuild.ps1"
$env:BAS_SERVER_PORT = "$Port"
$env:BAS_SERVER_URL  = "http://127.0.0.1:$Port"
$QtBin = "$PSScriptRoot/../third_party/basbuild/Qt/5.15.2/msvc2019_64/bin"
if (Test-Path $QtBin) { $env:PATH = "$QtBin;$env:PATH" }
Write-Host "BAS_SERVER_PORT=$env:BAS_SERVER_PORT  BAS_SERVER_URL=$env:BAS_SERVER_URL" -ForegroundColor Green
