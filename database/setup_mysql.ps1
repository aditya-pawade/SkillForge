# PowerShell script to set up MySQL database for SkillForge
# This will execute the SQL setup script

Write-Host "Setting up SkillForge MySQL database..." -ForegroundColor Green

# Path to the SQL file
$sqlFile = "C:\Exponent Programs\Project SkillForge\SkillForge\database\setup_database.sql"

# Execute the SQL file using MySQL command line
try {
    # Try to execute with mysql command
    mysql -u root -p -e "source '$sqlFile'"
    Write-Host "Database setup completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "Error executing SQL file. Please run manually in MySQL command line:" -ForegroundColor Yellow
    Write-Host "mysql -u root -p" -ForegroundColor Cyan
    Write-Host "source $sqlFile" -ForegroundColor Cyan
}