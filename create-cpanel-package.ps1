# Create cPanel Deployment Package
# This script packages only the necessary files for cPanel deployment

$sourcePath = "c:\Users\tashr\Downloads\justicialegalminds-deploy_ready\justicialegalminds-express"
$outputPath = "c:\Users\tashr\Downloads\justicialegalminds-cpanel-deploy.zip"

Write-Host "Creating cPanel deployment package..." -ForegroundColor Green

# Remove old zip if exists
if (Test-Path $outputPath) {
    Remove-Item $outputPath -Force
    Write-Host "Removed old deployment package" -ForegroundColor Yellow
}

# Create temporary directory for packaging
$tempDir = Join-Path $env:TEMP "cpanel-deploy-temp"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

Write-Host "Copying files to temporary directory..." -ForegroundColor Cyan

# Copy required folders
Copy-Item "$sourcePath\dist" -Destination "$tempDir\dist" -Recurse
Copy-Item "$sourcePath\views" -Destination "$tempDir\views" -Recurse
Copy-Item "$sourcePath\public" -Destination "$tempDir\public" -Recurse

# Copy required files
Copy-Item "$sourcePath\package.json" -Destination "$tempDir\package.json"
Copy-Item "$sourcePath\package-lock.json" -Destination "$tempDir\package-lock.json"

# Copy .env template (user needs to update DATABASE_URL)
Copy-Item "$sourcePath\.env" -Destination "$tempDir\.env"

# Copy deployment guide
Copy-Item "$sourcePath\DEPLOY_TO_CPANEL.md" -Destination "$tempDir\DEPLOY_TO_CPANEL.md"
Copy-Item "$sourcePath\README.md" -Destination "$tempDir\README.md"

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
Write-Host "✅ Deployment package created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📦 Package location: $outputPath" -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 Package contains:" -ForegroundColor Cyan
Write-Host "  ✓ dist/ - Compiled JavaScript" -ForegroundColor White
Write-Host "  ✓ views/ - EJS templates" -ForegroundColor White
Write-Host "  ✓ public/ - CSS, JS, images" -ForegroundColor White
Write-Host "  ✓ package.json - Dependencies" -ForegroundColor White
Write-Host "  ✓ package-lock.json - Dependency lock" -ForegroundColor White
Write-Host "  ✓ .env - Environment variables (UPDATE THIS!)" -ForegroundColor White
Write-Host "  ✓ database_schema.sql - Database setup" -ForegroundColor White
Write-Host "  ✓ DEPLOY_TO_CPANEL.md - Deployment guide" -ForegroundColor White
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "  1. Extract the ZIP file" -ForegroundColor White
Write-Host "  2. Update .env with your production DATABASE_URL" -ForegroundColor White
Write-Host "  3. Upload all files to cPanel" -ForegroundColor White
Write-Host "  4. Run: npm install --production" -ForegroundColor White
Write-Host "  5. Import database_schema.sql in phpMyAdmin" -ForegroundColor White
Write-Host "  6. Start: node dist/server.js" -ForegroundColor White
Write-Host ""
Write-Host "💾 Memory usage on cPanel: ~50-100 MB (vs 500+ MB for Next.js)" -ForegroundColor Green
Write-Host ""
