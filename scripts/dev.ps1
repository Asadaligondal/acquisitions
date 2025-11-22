# Development startup script for Acquisition App with Neon Local
# This script starts the application in development mode with Neon Local

Write-Host "🚀 Starting Acquisition App in Development Mode"
Write-Host "================================================"

# Check if .env.development exists
if (-Not (Test-Path -Path ".env.development")) {
    Write-Host "❌ Error: .env.development file not found!"
    Write-Host "   Please copy .env.development from the template and update with your Neon credentials."
    exit 1
}

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Error: Docker is not running or accessible!"
    Write-Host "   Please ensure Docker Desktop is running and the Docker CLI is in your PATH."
    exit 1
}

# Create .neon_local directory if it doesn't exist
if (-Not (Test-Path -Path ".neon_local")) {
    New-Item -ItemType Directory -Path ".neon_local" | Out-Null
}

# Add .neon_local to .gitignore if not already present
if (-Not (Select-String -Path ".gitignore" -Pattern ".neon_local/" -Quiet)) {
    Add-Content -Path ".gitignore" -Value ".neon_local/"
    Write-Host "✅ Added .neon_local/ to .gitignore"
}

Write-Host "📦 Building and starting development containers..."
Write-Host "   - Neon Local proxy will create an ephemeral database branch"
Write-Host "   - Application will run with hot reload enabled"
Write-Host ""

# Run migrations with Drizzle
Write-Host "📜 Applying latest schema with Drizzle..."
npm run db:migrate

# Wait for the database to be ready
Write-Host "⏳ Waiting for the database to be ready..."
docker compose exec neon-local psql -U neon -d neondb -c "SELECT 1"

# Start development environment
docker compose -f docker-compose.dev.yml up --build

Write-Host ""
Write-Host "🎉 Development environment started!"
Write-Host "   Application: http://localhost:5173"
Write-Host "   Database: postgres://neon:npg@localhost:5432/neondb"
Write-Host ""
Write-Host "To stop the environment, press Ctrl+C or run: docker compose down"