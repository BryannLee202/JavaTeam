@echo off
REM =============================================================================
REM Setup Git Hooks cho project JavaTeam (Windows)
REM =============================================================================
REM Chạy file này 1 lần để cài đặt git hook bắt buộc commit chứa mã JAV-xxx
REM =============================================================================

echo.
echo ========================================
echo   Cai dat Git Hooks cho JavaTeam
echo ========================================
echo.

REM Set git hooks path to use our custom hooks
git config core.hooksPath .github/hooks

if %ERRORLEVEL% EQU 0 (
    echo [OK] Da cau hinh git hooks path thanh cong!
    echo.
    echo Tu bay gio, moi commit PHAI chua ma Jira (JAV-xxx).
    echo.
    echo   Vi du dung:  git commit -m "JAV-42 them trang login"
    echo   Vi du sai:   git commit -m "them trang login"
    echo.
    echo ========================================
    echo   Cai dat hoan tat!
    echo ========================================
) else (
    echo [LOI] Khong the cau hinh git hooks. Hay chay lai trong thu muc project.
)

echo.
pause
