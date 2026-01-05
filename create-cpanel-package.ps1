# Create cPanel Deployment Package
# This script packages only the necessary files for cPanel deployment

$sourcePath = "c:\Users\tashr\Downloads\justicialegalminds-deploy_ready\justicialegalminds-express"
$outputPath = "c:\Users\tashr\Downloads\justicialegalminds-deploy_ready\new_jlm.zip"

Write-Host "Creating cPanel deployment package..." -ForegroundColor Green

# Remove old zip if exists
if (Test-Path $outputPath) {
    Remove-Item $outputPath -Force
    Write-Host "Removed old deployment package" -ForegroundColor Yellow
}

# Create temporary directory for packaging
$tempDir = Join-Path $env:TEMP "cpanel-new-jlm-deploy"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

Write-Host "Copying files to temporary directory..." -ForegroundColor Cyan

# Copy required folders
if (Test-Path "$sourcePath\dist") {
    Copy-Item "$sourcePath\dist" -Destination "$tempDir\dist" -Recurse
}
else {
    Write-Error "dist folder not found! Please run 'npm run build' first."
    exit 1
}

if (Test-Path "$sourcePath\views") {
    Copy-Item "$sourcePath\views" -Destination "$tempDir\views" -Recurse
}

if (Test-Path "$sourcePath\public") {
    Copy-Item "$sourcePath\public" -Destination "$tempDir\public" -Recurse
}

# Copy required files
Copy-Item "$sourcePath\package.json" -Destination "$tempDir\package.json"
Copy-Item "$sourcePath\package-lock.json" -Destination "$tempDir\package-lock.json"
Copy-Item "$sourcePath\app.js" -Destination "$tempDir\app.js"

# Create PRODUCTION .env file with user provided credentials
$envContent = @"
DATABASE_URL="mysql://justicia_jlm:%25t93r}tLig%26M59HM@localhost:3306/justicia_justicialegalminds"
SESSION_SECRET="justicia_legal_secret_production_key_2025"
NODE_ENV="production"
PORT=3000
"@
Set-Content -Path "$tempDir\.env" -Value $envContent
Write-Host "Created production .env file" -ForegroundColor Cyan

# Copy deployment guide
if (Test-Path "$sourcePath\DEPLOY_TO_CPANEL.md") {
    Copy-Item "$sourcePath\DEPLOY_TO_CPANEL.md" -Destination "$tempDir\DEPLOY_TO_CPANEL.md"
}

if (Test-Path "$sourcePath\README.md") {
    Copy-Item "$sourcePath\README.md" -Destination "$tempDir\README.md"
}

# Copy database schema from original project
$dbSchemaPath = "c:\Users\tashr\Downloads\justicialegalminds-deploy_ready\justicialegalminds-deploy_ready\database_schema.sql"
if (Test-Path $dbSchemaPath) {
    Copy-Item $dbSchemaPath -Destination "$tempDir\database_schema.sql"
}

Write-Host "Creating ZIP archive..." -ForegroundColor Cyan

# Create ZIP file
Compress-Archive -Path "$tempDir\*" -DestinationPath $outputPath -Force

# Clean up temp directory
Remove-Item $tempDir -Recurse -Force

Write-Host ""
Write-Host "Deployment package created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Package location: $outputPath" -ForegroundColor Yellow
Write-Host ""
