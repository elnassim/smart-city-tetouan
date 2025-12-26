-- =====================================================
-- Set Admin Role for Wassim
-- Smart City Tetouan
-- =====================================================

USE water_electricity_management;

-- Find and update the user 'wassim' to ADMIN role
-- Replace the email with the actual email used in Clerk

-- Option 1: Update by email (if you know wassim's email)
UPDATE users
SET role = 'ADMIN'
WHERE email LIKE '%wassim%' OR email LIKE '%admin%';

-- Option 2: Update by Clerk ID (if you know the Clerk user ID)
-- Uncomment and replace 'user_xxx' with actual Clerk ID
-- UPDATE users
-- SET role = 'ADMIN'
-- WHERE clerk_user_id = 'user_xxx';

-- Option 3: Update by name
UPDATE users
SET role = 'ADMIN'
WHERE full_name LIKE '%wassim%' OR full_name LIKE '%Wassim%';

-- Verify the update
SELECT
    id,
    clerk_user_id,
    email,
    full_name,
    role,
    created_at
FROM users
WHERE role = 'ADMIN';

-- Make sure soulayman is CITOYEN
UPDATE users
SET role = 'CITOYEN'
WHERE email LIKE '%soulayman%' OR full_name LIKE '%soulayman%' OR full_name LIKE '%Soulayman%';

-- Show all users with their roles
SELECT
    id,
    clerk_user_id,
    email,
    full_name,
    role
FROM users
ORDER BY role, full_name;
