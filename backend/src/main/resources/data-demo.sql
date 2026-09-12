-- Demo seed data - Users only for testing login
INSERT INTO app_user (id, created_at, updated_at, full_name, email, password_hash, user_category, account_status, guest_judge) 
VALUES (
    '10000000-0000-0000-0000-000000000001',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
    'Demo Coordinator',
    'coordinator@demo.local',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeEk9d5oYqTJ3hJ0e7C4F3z5SYJB6rMhW',
    'FPT_STUDENT',
    'APPROVED',
    false
);

INSERT INTO app_user (id, created_at, updated_at, full_name, email, password_hash, user_category, account_status, guest_judge) 
VALUES (
    '10000000-0000-0000-0000-000000000002',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
    'Judge One',
    'judge1@demo.local',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeEk9d5oYqTJ3hJ0e7C4F3z5SYJB6rMhW',
    'FPT_STUDENT',
    'APPROVED',
    false
);

INSERT INTO app_user (id, created_at, updated_at, full_name, email, password_hash, user_category, account_status, guest_judge) 
VALUES (
    '10000000-0000-0000-0000-000000000003',
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
    'Judge Two',
    'judge2@demo.local',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeEk9d5oYqTJ3hJ0e7C4F3z5SYJB6rMhW',
    'FPT_STUDENT',
    'APPROVED',
    false
);

INSERT INTO user_role_assignment (id, created_at, updated_at, user_id, role_name, scope_type, scope_id)
VALUES ('10000000-0000-0000-0000-000000000101', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '10000000-0000-0000-0000-000000000001', 'COORDINATOR', 'GLOBAL', NULL);

INSERT INTO user_role_assignment (id, created_at, updated_at, user_id, role_name, scope_type, scope_id)
VALUES ('10000000-0000-0000-0000-000000000102', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '10000000-0000-0000-0000-000000000002', 'JUDGE', 'GLOBAL', NULL);

INSERT INTO user_role_assignment (id, created_at, updated_at, user_id, role_name, scope_type, scope_id)
VALUES ('10000000-0000-0000-0000-000000000103', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '10000000-0000-0000-0000-000000000003', 'JUDGE', 'GLOBAL', NULL);
