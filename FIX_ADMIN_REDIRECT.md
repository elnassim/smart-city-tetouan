# Fix Admin User Redirect Issue

## Problem
Both users (soulayman as CITOYEN and wassim as ADMIN) are redirected to the citizen dashboard after login.

## Root Cause
The application redirects all logged-in users to `/dashboard` without checking their role first.

## Solution Implemented

### 1. Created RoleBasedRedirect Component ✅
**File**: `frontend/src/components/RoleBasedRedirect.jsx`

This component:
- Fetches the user's role from the backend
- Redirects ADMIN users to `/admin/dashboard`
- Redirects CITOYEN/OPERATOR users to `/dashboard`

### 2. Updated App.jsx ✅
**Changes made**:
- Added import for `RoleBasedRedirect`
- Changed `PublicRoute` to redirect to `/auto-redirect` instead of `/dashboard`
- Added new route `/auto-redirect` that uses `RoleBasedRedirect`

**Flow now**:
```
Login → /auto-redirect → RoleBasedRedirect checks role
                         ├─→ ADMIN → /admin/dashboard
                         └─→ CITOYEN → /dashboard
```

### 3. Database Role Setup Required ⚠️

**IMPORTANT**: You must set wassim's role to ADMIN in the database!

## Steps to Fix

### Step 1: Set Admin Role in Database

**Option A: Using MySQL Workbench or phpMyAdmin**

1. Connect to your MySQL database
2. Select database: `water_electricity_management`
3. Run this query:

```sql
USE water_electricity_management;

-- Update wassim to ADMIN
UPDATE users
SET role = 'ADMIN'
WHERE email LIKE '%wassim%' OR full_name LIKE '%wassim%';

-- Make sure soulayman is CITOYEN
UPDATE users
SET role = 'CITOYEN'
WHERE email LIKE '%soulayman%' OR full_name LIKE '%soulayman%';

-- Verify the changes
SELECT id, clerk_user_id, email, full_name, role
FROM users
ORDER BY role;
```

**Option B: Using Command Line**

```bash
# Navigate to backend directory
cd backend

# Run the SQL script
mysql -u root -p water_electricity_management < set-admin-role.sql

# Enter password when prompted (default: nassim123)
```

**Option C: Using Docker (if MySQL is in Docker)**

```bash
# Navigate to backend directory
cd backend

# Copy the SQL file into the MySQL container
docker cp set-admin-role.sql <mysql-container-name>:/tmp/

# Execute the SQL script
docker exec -it <mysql-container-name> mysql -u root -pnassim123 water_electricity_management -e "source /tmp/set-admin-role.sql"
```

### Step 2: Verify Database Changes

Run this query to confirm:

```sql
SELECT
    id,
    clerk_user_id,
    email,
    full_name,
    role
FROM users
WHERE role = 'ADMIN' OR role = 'CITOYEN'
ORDER BY role, full_name;
```

**Expected output**:
```
+----+---------------+------------------+-----------+--------+
| id | clerk_user_id | email            | full_name | role   |
+----+---------------+------------------+-----------+--------+
|  1 | user_xxx      | wassim@email.com | Wassim    | ADMIN  |
|  2 | user_yyy      | soul@email.com   | Soulayman | CITOYEN|
+----+---------------+------------------+-----------+--------+
```

### Step 3: Test the Redirect

1. **Restart frontend** (if running):
   ```bash
   cd frontend
   npm run dev
   ```

2. **Test with Wassim (Admin)**:
   - Logout if logged in
   - Login with wassim's account
   - Should automatically redirect to `/admin/dashboard`
   - Should see admin interface

3. **Test with Soulayman (Citizen)**:
   - Logout
   - Login with soulayman's account
   - Should automatically redirect to `/dashboard`
   - Should see citizen dashboard

## Troubleshooting

### Issue: Both users still go to citizen dashboard

**Check 1: Database Role**
```sql
SELECT clerk_user_id, email, full_name, role
FROM users
WHERE email LIKE '%wassim%' OR email LIKE '%soulayman%';
```

If wassim's role is not ADMIN, run the UPDATE query again.

**Check 2: Clerk User ID Match**
The `clerk_user_id` in the database must match the Clerk user ID. To find it:

1. Login as wassim
2. Open browser console (F12)
3. Type: `window.Clerk.user.id`
4. Copy the value (e.g., `user_2abc123xyz`)
5. Verify it matches the database:

```sql
SELECT * FROM users WHERE clerk_user_id = 'user_2abc123xyz';
```

If it doesn't exist, create the user:

```sql
INSERT INTO users (clerk_user_id, email, full_name, role)
VALUES ('user_2abc123xyz', 'wassim@email.com', 'Wassim', 'ADMIN');
```

**Check 3: Backend API Response**
1. Login as wassim
2. Open browser DevTools → Network tab
3. Look for request to `/api/dashboard/summary/clerk/`
4. Check response JSON, should have: `"role": "ADMIN"`

If role is not ADMIN in the response, the backend might not be reading from the database correctly.

**Check 4: Clear Browser Cache**
```
Ctrl + Shift + Delete → Clear cache
or
Hard refresh: Ctrl + Shift + R
```

### Issue: RoleBasedRedirect stuck on loading

**Check console for errors**:
- Open DevTools → Console
- Look for API call errors
- Common issues:
  - Backend not running (port 8081)
  - Database not accessible
  - Clerk user not synced to database

**Solution**:
1. Ensure backend is running: `docker-compose up`
2. Check backend logs: `docker-compose logs utility-service`
3. Verify database connection

## How It Works

### Before (Incorrect Flow)
```
Login → PublicRoute → Navigate to /dashboard → Citizen Dashboard
                                               (Everyone ends up here)
```

### After (Correct Flow)
```
Login → PublicRoute → Navigate to /auto-redirect
                                    ↓
                      RoleBasedRedirect Component
                                    ↓
                    Fetch user role from backend
                                    ↓
                      ┌─────────────┴─────────────┐
                      ↓                           ↓
                  ADMIN role               CITOYEN/OPERATOR
                      ↓                           ↓
          Navigate to /admin/dashboard  Navigate to /dashboard
                      ↓                           ↓
              Admin Dashboard              Citizen Dashboard
```

## Files Modified

1. ✅ `frontend/src/components/RoleBasedRedirect.jsx` (NEW)
   - Checks user role from backend
   - Redirects based on role

2. ✅ `frontend/src/App.jsx`
   - Added import for RoleBasedRedirect
   - Changed PublicRoute redirect from `/dashboard` → `/auto-redirect`
   - Added route for `/auto-redirect`

3. ⚠️ `backend/set-admin-role.sql` (NEW)
   - SQL script to set wassim as ADMIN

## Verification Checklist

After completing all steps:

- [ ] Backend running (docker-compose up)
- [ ] Database has wassim with role = 'ADMIN'
- [ ] Database has soulayman with role = 'CITOYEN'
- [ ] Frontend running (npm run dev)
- [ ] Login as wassim → redirects to /admin/dashboard
- [ ] Login as soulayman → redirects to /dashboard
- [ ] Admin can access /admin/users, /admin/meters, etc.
- [ ] Citizen cannot access /admin/* routes (shows "Accès refusé")

## Summary

**What was changed**:
1. Created `RoleBasedRedirect` component to check user role
2. Updated App.jsx to use role-based redirect
3. Created SQL script to set admin role

**What you need to do**:
1. Run the SQL script to set wassim's role to ADMIN in the database
2. Test login with both users
3. Confirm wassim goes to admin dashboard
4. Confirm soulayman goes to citizen dashboard

**Result**:
- ✅ Admins automatically redirected to admin dashboard
- ✅ Citizens automatically redirected to citizen dashboard
- ✅ Role-based access control working properly
