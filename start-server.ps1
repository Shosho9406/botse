# Botse by Masego - Server Manager
# Run with: powershell -ExecutionPolicy Bypass -File start-server.ps1

Write-Host "====================================`n Botse by Masego Server Manager`n====================================" -ForegroundColor Cyan
Write-Host ""

$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectPath

# Check Node.js
try {
    $nodeVersion = & node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ERROR: Node.js not found. Please install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Kill existing process on port 3000
Write-Host "`nCleaning up port 3000..." -ForegroundColor Yellow
$existing = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($existing) {
    $pid = $existing.OwningProcess
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    Write-Host "✓ Stopped existing process (PID: $pid)" -ForegroundColor Green
    Start-Sleep -Seconds 1
} else {
    Write-Host "✓ Port 3000 is free" -ForegroundColor Green
}

# Start server
Write-Host "`nStarting Botse server..." -ForegroundColor Yellow
Write-Host ""

try {
    & node server.js
} catch {
    Write-Host "✗ ERROR starting server: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
