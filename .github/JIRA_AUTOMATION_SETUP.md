# 🔧 Hướng dẫn cấu hình Jira Automation Rule

## Rule: Tạo branch GitHub khi chuyển task sang "In Progress"

### Cách 1: Dùng GitHub for Jira App (Khuyến nghị)

#### Bước 1: Cài GitHub for Jira
1. Truy cập Jira → **Apps → Find new apps**
2. Tìm **"GitHub for Jira"** (by GitHub, Inc.)
3. Nhấn **Install** → Authorize với tài khoản GitHub owner
4. Chọn repo **BryannLee202/JavaTeam** để kết nối

#### Bước 2: Tạo Automation Rule
1. Vào Jira → **Project Settings → Automation**
2. Nhấn **Create rule**
3. Cấu hình:

```
┌─────────────────────────────────────────────┐
│ WHEN: Issue transitioned                    │
│   From status: To Do                        │
│   To status:   In Progress                  │
├─────────────────────────────────────────────┤
│ IF: Issue type is one of                    │
│   → Task, Story, Bug                       │
├─────────────────────────────────────────────┤
│ THEN: Create branch                         │
│   Repository: BryannLee202/JavaTeam         │
│   Source branch: frontend                   │
│   Branch name: {{issue.key}}                │
│   (Ví dụ: JAV-42)                          │
└─────────────────────────────────────────────┘
```

4. Đặt tên rule: **"Auto create GitHub branch on In Progress"**
5. Nhấn **Turn it on**

---

### Cách 2: Dùng Jira Automation + GitHub API (Không cần app)

Nếu không muốn cài GitHub for Jira app, dùng Web Request:

#### Bước 1: Tạo GitHub Personal Access Token
1. Vào https://github.com/settings/tokens → **Generate new token (classic)**
2. Chọn scope: `repo`
3. Copy token

#### Bước 2: Tạo Automation Rule
1. Vào Jira → **Project Settings → Automation**
2. Nhấn **Create rule**
3. Cấu hình:

```
┌─────────────────────────────────────────────┐
│ WHEN: Issue transitioned                    │
│   From status: To Do                        │
│   To status:   In Progress                  │
├─────────────────────────────────────────────┤
│ THEN: Send web request                      │
│                                             │
│ URL: https://api.github.com/repos/          │
│      BryannLee202/JavaTeam/git/refs         │
│                                             │
│ Method: POST                                │
│                                             │
│ Headers:                                    │
│   Authorization: token <GITHUB_TOKEN>       │
│   Accept: application/vnd.github.v3+json    │
│                                             │
│ Body (custom):                              │
│ {                                           │
│   "ref": "refs/heads/{{issue.key}}",        │
│   "sha": "<SHA_of_frontend_branch>"         │
│ }                                           │
└─────────────────────────────────────────────┘
```

> ⚠️ Cách 2 cần lấy SHA mới nhất của nhánh `frontend` mỗi lần.
> Khuyến nghị dùng Cách 1 cho đơn giản.

---

## Kiểm tra sau khi cấu hình

1. Tạo 1 task test trên Jira (ví dụ: JAV-99 "Test automation")
2. Kéo task sang **In Progress**
3. Kiểm tra trên GitHub: branch `JAV-99` phải được tạo từ `frontend`
4. Tạo PR: `JAV-99` → `frontend`
5. Kiểm tra Jira: task phải chuyển sang **In Review** + có comment link PR
6. Merge PR
7. Kiểm tra Jira: task phải chuyển sang **Done** + có comment "Merged"
