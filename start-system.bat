@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo ===============================================================================
echo   SHMS - SEAL HACKATHON MANAGEMENT SYSTEM
echo   CHUONG TRINH KHOI DONG HE THONG VA DEMO (ONE-CLICK LAUNCHER)
echo ===============================================================================
echo.

:: 1. Kiem tra va khoi tao tep .env chuan
if not exist ".env" (
    echo [THONG BAO] Chua co tep .env, dang tu dong khoi tao tep .env chuan...
    (
        echo # Configuration for SHMS Hackathon
        echo JWT_SECRET=c2VhbF9zdXBlcl9zZWNyZXRfand0X2tleV9mb3JfaGFja2F0aG9uX2RlbW9fMjAyNg==
        echo AI_ENABLED=false
        echo AI_API_KEY=
        echo AI_MODEL=gemini-1.5-flash
    ) > .env
    echo [THANH CONG] Da tao tep .env hop le cho buoi demo!
) else (
    echo [OK] Tep cau hinh moi truong .env da san sang.
)
echo.

:: 2. Menu lua chon che do khoi dong
echo Vui long chon che do khoi dong phu hop:
echo.
echo   [1] KHOI DONG DEMO NHANH (Khuyen dung - 3 cua so tu dong mo + Nap san du lieu mau)
echo   [2] KHOI DONG BANG DOCKER COMPOSE (Chay 4 Container ngam: DB, Backend, BFF, Web)
echo   [3] KHOI DONG CHI RIENG DATABASE POSTGRESQL (Docker)
echo   [4] DUNG TOAN BO CAC CONTAINER DOCKER (Stop all)
echo   [5] Thoat
echo.
set /p CHOICE="Nhap lua chon cua ban [1-5] (Mac dinh: 1): "
if "%CHOICE%"=="" set CHOICE=1

if "%CHOICE%"=="1" goto START_LOCAL_DEMO
if "%CHOICE%"=="2" goto START_DOCKER
if "%CHOICE%"=="3" goto START_DB_ONLY
if "%CHOICE%"=="4" goto STOP_DOCKER
if "%CHOICE%"=="5" goto EXIT_SCRIPT

:START_LOCAL_DEMO
echo.
echo ===============================================================================
echo   DANG KHOI DONG 3 DICH VU TRONG 3 CUA SO POWERSHELL RIENG BIET...
echo   (Nạp sẵn dữ liệu demo: Tài khoản, Đội thi, Tiêu chí Rubric, Bài nộp)
echo ===============================================================================
echo.

echo [1/3] Dang mo cua so Terminal cho Backend Spring Boot (cong 8080)...
start "SHMS [1] - Backend Spring Boot (Demo Profile)" powershell -NoExit -Command "cd '%~dp0backend'; $env:SPRING_PROFILES_ACTIVE='demo'; .\mvnw.cmd spring-boot:run"

timeout /t 6 /nobreak >nul

echo [2/3] Dang mo cua so Terminal cho BFF Gateway NestJS (cong 4000)...
start "SHMS [2] - BFF Gateway NestJS" powershell -NoExit -Command "cd '%~dp0bff'; npm run start:dev"

timeout /t 3 /nobreak >nul

echo [3/3] Dang mo cua so Terminal cho Frontend React 19 (cong 3001)...
start "SHMS [3] - Frontend React 19" powershell -NoExit -Command "cd '%~dp0frontend'; $env:VITE_BFF_URL='http://localhost:4000'; npm run dev"

timeout /t 2 /nobreak >nul

echo.
echo ===============================================================================
echo   CA 3 DICH VU DA DUOC KHOI DONG XONG!
echo   - Frontend Web App:     http://localhost:3001
echo   - BFF Gateway (NestJS): http://localhost:4000
echo   - Backend Spring Boot:  http://localhost:8080
echo.
echo   Tai khoan demo san sang:
echo   - Ban to chuc:  coordinator@seal.edu.vn / Coordinator@123
echo   - Giam khao:    judge1@seal.edu.vn       / Judge@123
echo   - Doi thi:      leader1@seal.edu.vn      / Leader@123
echo ===============================================================================
echo.
echo Dang tu dong mo trinh duyet truy cap Web App...
start http://localhost:3001
pause
goto :eof

:START_DOCKER
echo.
echo [DOCKER] Dang khoi dong cac container he thong SHMS...
docker compose up -d
if %ERRORLEVEL% equ 0 (
    echo.
    echo ===============================================================================
    echo   CONTAINER DOCKER DA DUOC KHOI DONG THANH CONG!
    echo   - Frontend Web App:     http://localhost:3000
    echo   - BFF Gateway (NestJS): http://localhost:4000
    echo   - Backend Spring Boot:  http://localhost:8080
    echo   - Swagger API Docs:     http://localhost:8080/swagger-ui.html
    echo ===============================================================================
    start http://localhost:3000
) else (
    echo.
    echo [LOI] Khong the khoi dong Docker Compose!
    echo Neu may chua bat Docker Desktop, vui long chon Che do [1] de chay truc tiep cuc bo.
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

:STOP_DOCKER
echo.
echo Dang dung toan bo cac container Docker cua SHMS...
docker compose down
echo [OK] Da dung thanh cong!
pause
goto :eof

:EXIT_SCRIPT
echo Tam biet!
