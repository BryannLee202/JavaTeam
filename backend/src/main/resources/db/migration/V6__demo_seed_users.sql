-- Demo seed data for local development/testing
-- This migration only runs when NOT in production profile.
-- Flyway will be disabled for H2 test runs, so this seed is optional for H2 demo mode.

-- Insert demo coordinator user
-- Email: coordinator@demo.local, Password: Demo@123456 (BCrypt hash)
INSERT INTO app_user (id, full_name, email, password_hash, user_category, account_status, guest_judge)
VALUES (
    gen_random_uuid(),
    'Demo Coordinator',
    'coordinator@demo.local',
    -- BCrypt hash of 'Demo@123456' (pre-computed for demo consistency)
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeEk9d5oYqTJ3hJ0e7C4F3z5SYJB6rMhW',
    'STAFF',
    'APPROVED',
    false
);

INSERT INTO user_role_assignment (id, user_id, role_name, scope_type, scope_id)
SELECT gen_random_uuid(), id, 'COORDINATOR', 'GLOBAL', NULL
FROM app_user WHERE email = 'coordinator@demo.local';

-- Insert demo judge users (multiple judges for testing)
-- Judge 1: judge1@demo.local, Password: Demo@123456
INSERT INTO app_user (id, full_name, email, password_hash, user_category, account_status, guest_judge)
VALUES (
    gen_random_uuid(),
    'Judge One',
    'judge1@demo.local',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeEk9d5oYqTJ3hJ0e7C4F3z5SYJB6rMhW',
    'JUDGE',
    'APPROVED',
    false
);

-- Judge 2: judge2@demo.local, Password: Demo@123456
INSERT INTO app_user (id, full_name, email, password_hash, user_category, account_status, guest_judge)
VALUES (
    gen_random_uuid(),
    'Judge Two',
    'judge2@demo.local',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeEk9d5oYqTJ3hJ0e7C4F3z5SYJB6rMhW',
    'JUDGE',
    'APPROVED',
    false
);

-- Insert demo team leader user
-- Email: leader@demo.local, Password: Demo@123456
INSERT INTO app_user (id, full_name, email, password_hash, user_category, account_status, guest_judge)
VALUES (
    gen_random_uuid(),
    'Demo Team Leader',
    'leader@demo.local',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeEk9d5oYqTJ3hJ0e7C4F3z5SYJB6rMhW',
    'STUDENT',
    'APPROVED',
    false
);

-- Create a demo event
INSERT INTO hackathon_event (id, name, description, start_date, end_date, status, rbl_enabled)
VALUES (
    gen_random_uuid(),
    'SEAL Hackathon 2026 Demo',
    'Demo event for testing scoring/ranking features',
    '2026-09-01',
    '2026-09-30',
    'ACTIVE',
    true
);

-- Create demo round(s)
INSERT INTO round (id, event_id, name, order_index, submission_deadline, promotion_top_n, results_published)
SELECT gen_random_uuid(), id, 'Vòng Chung Kết', 1, '2026-09-20T23:59:59Z', 3, false
FROM hackathon_event WHERE name = 'SEAL Hackathon 2026 Demo';

-- Assign judges to the demo round
INSERT INTO user_role_assignment (id, user_id, role_name, scope_type, scope_id)
SELECT gen_random_uuid(), u.id, 'JUDGE', 'ROUND', r.id
FROM app_user u, round r
WHERE u.email IN ('judge1@demo.local', 'judge2@demo.local')
AND r.name = 'Vòng Chung Kết';

-- Create demo track
INSERT INTO track (id, event_id, name, description, max_teams)
SELECT gen_random_uuid(), e.id, 'Mobile Application', 'Mobile app development track for demo', 10
FROM hackathon_event e WHERE e.name = 'SEAL Hackathon 2026 Demo';

-- Create demo teams
INSERT INTO team (id, event_id, track_id, name, status)
SELECT gen_random_uuid(), e.id, t.id, 'Team Rocket', 'ACTIVE'
FROM hackathon_event e, track t WHERE e.name = 'SEAL Hackathon 2026 Demo' AND t.name = 'Mobile Application';

INSERT INTO team (id, event_id, track_id, name, status)
SELECT gen_random_uuid(), e.id, t.id, 'Byte Force', 'ACTIVE'
FROM hackathon_event e, track t WHERE e.name = 'SEAL Hackathon 2026 Demo' AND t.name = 'Mobile Application';

-- Add team leader to a team
INSERT INTO team_member (id, team_id, user_id, role_in_team)
SELECT gen_random_uuid(), t.id, u.id, 'LEADER'
FROM team t, app_user u
WHERE t.name = 'Team Rocket' AND u.email = 'leader@demo.local';

-- Create demo submissions
INSERT INTO submission (id, team_id, round_id, repo_url, demo_url, doc_url, submitted_at, is_late)
SELECT gen_random_uuid(), t.id, r.id, 
    'https://github.com/demo/team-rocket',
    'https://demo.example.com/team-rocket',
    'https://docs.example.com/team-rocket-slides.pdf',
    '2026-09-18T10:00:00Z',
    false
FROM team t, round r
WHERE t.name = 'Team Rocket' AND r.name = 'Vòng Chung Kết';

INSERT INTO submission (id, team_id, round_id, repo_url, demo_url, doc_url, submitted_at, is_late)
SELECT gen_random_uuid(), t.id, r.id,
    'https://github.com/demo/byte-force',
    NULL,
    'https://docs.example.com/byte-force-presentation.pdf',
    '2026-09-20T22:00:00Z',
    true
FROM team t, round r
WHERE t.name = 'Byte Force' AND r.name = 'Vòng Chung Kết';

-- Create demo criteria (use the default template criteria if available, or create inline)
-- This assumes criteria exist from V2 seed
INSERT INTO criterion (id, round_id, name, description, weight, max_score)
SELECT gen_random_uuid(), r.id, c_data.name, c_data.description, c_data.weight, 10.00
FROM round r
CROSS JOIN (VALUES
    ('Kỹ thuật & Triển khai', 'Chất lượng kỹ thuật, độ hoàn thiện và khả năng triển khai thực tế', 30.00),
    ('Trải nghiệm người dùng', 'Giao diện, trải nghiệm sử dụng và giá trị mang lại cho người dùng', 20.00),
    ('Tác động & Ý tưởng', 'Mức độ tác động kinh tế xã hội và sáng tạo của ý tưởng', 25.00),
    ('Thuyết trình & Demo', 'Chất lượng thuyết trình, demo sản phẩm và khả năng truyền đạt', 25.00)
) AS c_data(name, description, weight)
WHERE r.name = 'Vòng Chung Kết';

-- Create demo calibration round (for RBL feature)
INSERT INTO calibration_round (id, event_id, sample_submission_id, name, active)
SELECT gen_random_uuid(), e.id, s.id, 'Hiệu chuẩn Vòng Chung Kết', true
FROM hackathon_event e, submission s
WHERE e.name = 'SEAL Hackathon 2026 Demo'
AND s.team_id = (SELECT id FROM team WHERE name = 'Team Rocket');
