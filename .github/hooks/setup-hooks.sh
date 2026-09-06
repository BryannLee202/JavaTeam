#!/bin/bash
# =============================================================================
# Setup Git Hooks cho project JavaTeam (Mac/Linux)
# =============================================================================
# Chạy file này 1 lần để cài đặt git hook bắt buộc commit chứa mã JAV-xxx
# Usage: bash .github/hooks/setup-hooks.sh
# =============================================================================

echo ""
echo "========================================"
echo "  Cài đặt Git Hooks cho JavaTeam"
echo "========================================"
echo ""

# Set git hooks path to use our custom hooks
git config core.hooksPath .github/hooks

if [ $? -eq 0 ]; then
    # Make hook executable
    chmod +x .github/hooks/commit-msg
    
    echo "✅ Đã cấu hình git hooks path thành công!"
    echo ""
    echo "Từ bây giờ, mọi commit PHẢI chứa mã Jira (JAV-xxx)."
    echo ""
    echo "  ✅ Đúng:  git commit -m \"JAV-42 thêm trang login\""
    echo "  ❌ Sai:   git commit -m \"thêm trang login\""
    echo ""
    echo "========================================"
    echo "  Cài đặt hoàn tất! ✅"
    echo "========================================"
else
    echo "❌ Không thể cấu hình git hooks. Hãy chạy lại trong thư mục project."
fi
echo ""
