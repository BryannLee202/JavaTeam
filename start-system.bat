@echo off
setlocal enabledelayedexpansion

echo ===============================================================================
echo   SHMS - SEAL HACKATHON MANAGEMENT SYSTEM
echo   CHUONG TRINH KHOI DONG TOAN BO HE THONG (ONE-CLICK LAUNCHER)
echo ===============================================================================
echo.

:: 1. Kiem tra tep cau hinh moi truong .env
if not exist ".env" (
    echo [THONG BAO] Chua tim thay tep .env, dang khoi tao tu .env.example...
    if exist ".env.example" (
        copy .env.example .env >nul
        echo JWT_SECRET=shms_super_secret_jwt_key_for_hackathon_demo_2026_production_safe >> .env
        echo AI_ENABLED=false >> .env
        echo [THANH CONG] Da tao tep .env mac dinh hop le cho buoi demo!
    ) else (
        echo [CANH BAO] Khong tim thay .env.example, vui long kiem tra lai!
    )
) else (
    echo [OK] Tep cau hinh moi truong .env da san sang.
)
echo.

:: 2. Menu lua chon che do khoi dong
echo Vui long chon phuong thuc khoi dong:
echo   [1] Khoi dong bang Docker Compose (Toan bo 4 services: DB, Backend, BFF, Frontend)
echo   [2] Khoi dong Database PostgreSQL bang Docker
echo   [3] Kiem tra trang thai cac Container dang chay
echo   [4] Thoat
echo.
set /p CHOICE="Nhap lua chon cua ban [1-4] (Mac dinh: 1): "
if "%CHOICE%"=="" set CHOICE=1

if "%CHOICE%"=="1" goto START_DOCKER
if "%CHOICE%"=="2" goto START_DB_ONLY
if "%CHOICE%"=="3" goto CHECK_STATUS
if "%CHOICE%"=="4" goto EXIT_SCRIPT

:START_DOCKER
echo.
echo [DOCKER] Dang khoi dong cac container he thong SHMS...
docker compose up -d --build
if %ERRORLEVEL% equ 0 (
    echo.
    echo ===============================================================================
    echo   HE THONG DA DUOC KHOI DONG THANH CONG!
    echo   - Frontend Web App:     http://localhost:3000
    echo   - BFF Gateway (NestJS): http://localhost:4000
    echo   - Backend Spring Boot:  http://localhost:8080
    echo   - Swagger API Docs:     http://localhost:8080/swagger-ui.html
    echo   - Database PostgreSQL:  localhost:5432 (database: hackathon)
    echo.
    echo   Tai khoan mac dinh cho buoi demo:
    echo   - Coordinator: coordinator@seal.edu.vn / Coordinator@123
    echo   - Judge:       judge1@seal.edu.vn       / Judge@123
    echo   - Team Leader: leader1@seal.edu.vn      / Leader@123
    echo ===============================================================================
) else (
    echo [LOI] Khong the khoi dong Docker Compose. Vui long kiem tra Docker Desktop da bat chua!
)
pause
goto :eof

:START_DB_ONLY
echo.
echo [DOCKER] Dang khoi dong dich vu PostgreSQL Database...
docker compose up -d postgres
echo [OK] Database PostgreSQL da san sang tren cong 5432!
pause
goto :eof

:CHECK_STATUS
echo.
docker compose ps
pause
goto :eof

:EXIT_SCRIPT
echo Tam biet!
