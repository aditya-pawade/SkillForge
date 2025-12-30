@echo off
echo Setting up SkillForge MySQL database...
echo.
echo Please enter your MySQL root password when prompted:
echo.

REM Try common MySQL installation paths
if exist "C:\Program Files\MySQL\MySQL Server 5.1\bin\mysql.exe" (
    "C:\Program Files\MySQL\MySQL Server 5.1\bin\mysql.exe" -u root -p < setup_database.sql
) else if exist "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" (
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < setup_database.sql
) else if exist "C:\MySQL\bin\mysql.exe" (
    "C:\MySQL\bin\mysql.exe" -u root -p < setup_database.sql
) else (
    echo MySQL executable not found in common locations.
    echo Please run this command manually in your MySQL command line:
    echo source setup_database.sql
    pause
)

echo.
echo Database setup completed!
pause