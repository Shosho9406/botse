#!/usr/bin/env powershell
# Quick Lambda Deployment Script
# Usage: .\deploy-lambda.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Botse Lambda Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Install dependencies
Write-Host "[1/5] Installing dependencies..." -ForegroundColor Yellow
npm install --production

# Step 2: Create ZIP file
Write-Host "[2/5] Creating deployment package..." -ForegroundColor Yellow
$files = @(
    "node_modules",
    "server.js",
    "db.js",
    "lambda-handler.js",
    "package.json",
    "data",
    "public"
)

# Remove old ZIP if exists
if (Test-Path "lambda-function.zip") {
    Remove-Item "lambda-function.zip"
}

# Create new ZIP
Compress-Archive -Path $files -DestinationPath "lambda-function.zip" -CompressionLevel Fastest

Write-Host "Created: lambda-function.zip ($(Get-Item lambda-function.zip).Length / 1MB) MB" -ForegroundColor Green

# Step 3: Check AWS CLI
Write-Host "[3/5] Checking AWS CLI..." -ForegroundColor Yellow
$awsVersion = aws --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "AWS CLI found: $awsVersion" -ForegroundColor Green
} else {
    Write-Host "ERROR: AWS CLI not installed. Install it with: pip install awscli" -ForegroundColor Red
    exit 1
}

# Step 4: Check AWS credentials
Write-Host "[4/5] Checking AWS credentials..." -ForegroundColor Yellow
$profile = aws sts get-caller-identity 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "AWS credentials configured ✓" -ForegroundColor Green
} else {
    Write-Host "ERROR: AWS credentials not configured. Run: aws configure" -ForegroundColor Red
    exit 1
}

# Step 5: Upload to Lambda
Write-Host "[5/5] Uploading to Lambda..." -ForegroundColor Yellow

$functionName = Read-Host "Enter Lambda function name (default: botse-api)"
if ($null -eq $functionName -or $functionName -eq "") {
    $functionName = "botse-api"
}

Write-Host "Uploading $functionName..." -ForegroundColor Yellow

$result = aws lambda update-function-code `
    --function-name $functionName `
    --zip-file fileb://lambda-function.zip 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Successfully uploaded to Lambda!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Go to AWS Lambda Console" -ForegroundColor White
    Write-Host "2. Verify function: $functionName" -ForegroundColor White
    Write-Host "3. Check CloudWatch logs for any errors" -ForegroundColor White
    Write-Host "4. Update API Gateway if needed" -ForegroundColor White
    Write-Host "5. Test with: https://your-api-gateway-url/api/products" -ForegroundColor White
} else {
    Write-Host "ERROR: Upload failed" -ForegroundColor Red
    Write-Host $result -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Deployment complete! ✓" -ForegroundColor Green
