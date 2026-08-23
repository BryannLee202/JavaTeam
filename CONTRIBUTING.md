# 📋 Hướng dẫn làm việc — JavaTeam

## ⚙️ Setup ban đầu (làm 1 lần)

### 1. Clone repo
```bash
git clone https://github.com/BryannLee202/JavaTeam.git
cd JavaTeam
```

### 2. Cài đặt Git Hook

**Windows:** Double-click file `.github\hooks\setup-hooks.bat`

**Mac/Linux:**
```bash
bash .github/hooks/setup-hooks.sh
```

> Hook này bắt buộc mọi commit phải chứa mã task Jira (JAV-xxx).

---

## 🔄 Quy trình làm việc hàng ngày

### Bước 1: Nhận task trên Jira
- Vào [Jira Board](https://taileminh2202.atlassian.net/jira/software/projects/JAV/boards/3)
- Kéo task sang **In Progress**
- Ghi nhớ mã task (ví dụ: `JAV-42`)

### Bước 2: Tạo branch
```bash
# Cập nhật code mới nhất
git checkout frontend
git pull origin frontend

# Tạo branch theo mã task Jira
git checkout -b JAV-42
```

> ⚠️ **Tên branch PHẢI là mã task Jira** (ví dụ: `JAV-42`), không đặt tên tự do.

### Bước 3: Code và commit
```bash
# Commit message PHẢI chứa mã Jira
git commit -m "JAV-42 thêm trang login"
git commit -m "JAV-42 fix responsive cho mobile"
```

**Ví dụ commit message hợp lệ:**
```
✅ JAV-42 thêm trang login
✅ [JAV-42] fix bug auth
✅ JAV-42: refactor component
```

**Ví dụ commit message KHÔNG hợp lệ:**
```
❌ thêm trang login          (thiếu mã Jira)
❌ fix bug                    (thiếu mã Jira)
❌ update code               (thiếu mã Jira)
```

### Bước 4: Push và tạo Pull Request
```bash
git push origin JAV-42
```

Sau đó vào GitHub tạo **Pull Request**:
- Title: `JAV-42 Thêm trang login`
- Base: `frontend`
- Compare: `JAV-42`

> 🤖 **Tự động:** Jira sẽ chuyển task sang **In Review** và comment link PR.

### Bước 5: Review và Merge
- Chờ review từ team lead
- Sau khi approve → **Merge PR**

> 🤖 **Tự động:** Jira sẽ chuyển task sang **Done** và comment "Merged".

---

## 📊 Thầy sẽ thấy gì trên Jira?

Khi mở một task (ví dụ JAV-42), thầy sẽ thấy panel **Development** gồm:

| Mục | Nội dung |
|-----|----------|
| 🔀 Branch | `JAV-42` |
| 📝 Commits | `JAV-42 thêm trang login` (by PhamNguyenHoaiLong, 16/08) |
| 🔗 Pull Request | PR #5: JAV-42 Thêm trang login (merged) |
| 💬 Comments | "✅ Merged via PR #5" |

---

## ❓ FAQ

### Quên ghi mã Jira trong commit?
```bash
# Sửa commit message gần nhất
git commit --amend -m "JAV-42 thêm trang login"
```

### Không biết mã task?
Vào [Jira Board](https://taileminh2202.atlassian.net/jira/software/projects/JAV/boards/3) để xem task được giao.

### Lỡ đặt tên branch sai?
```bash
# Đổi tên branch
git branch -m old-name JAV-42
```
