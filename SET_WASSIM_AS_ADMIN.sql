-- =====================================================
-- Set Wassim as ADMIN
-- Run this in MySQL Workbench or phpMyAdmin
-- =====================================================

USE water_electricity_management;

-- Show current users
SELECT 'BEFORE UPDATE:' as status;
SELECT id, clerk_user_id, email, full_name, role
FROM users
ORDER BY role, full_name;

-- Set Wassim as ADMIN (try multiple matching patterns)
UPDATE users SET role = 'ADMIN'
WHERE email LIKE '%wassim%'
   OR full_name LIKE '%wassim%'
   OR full_name LIKE '%Wassim%'
   OR email LIKE '%admin%';

-- Set Soulayman as CITOYEN
UPDATE users SET role = 'CITOYEN'
WHERE email LIKE '%soulayman%'
   OR full_name LIKE '%soulayman%'
   OR full_name LIKE '%Soulayman%';

-- Show updated users
SELECT 'AFTER UPDATE:' as status;
SELECT id, clerk_user_id, email, full_name, role
FROM users
ORDER BY role, full_name;

-- Confirm we have at least one ADMIN
SELECT COUNT(*) as admin_count FROM users WHERE role = 'ADMIN';
