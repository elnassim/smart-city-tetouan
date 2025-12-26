# Quick Fix: Make Wassim an Admin

## Problem
Both wassim and soulayman go to the citizen dashboard after login.

## Solution
Set wassim's role to ADMIN in the database.

---

## Method 1: Using MySQL Workbench (Easiest)

### Step 1: Open MySQL Workbench
1. Launch MySQL Workbench
2. Connect to your database (localhost:3306)
3. Username: `root`
4. Password: `nassim123`

### Step 2: Open the SQL File
1. In MySQL Workbench, go to **File → Open SQL Script**
2. Navigate to: `C:\Users\ASUS\Documents\S9\urba\Smart-City-Tetouan\`
3. Select: `SET_WASSIM_AS_ADMIN.sql`
4. Click **Open**

### Step 3: Execute the Script
1. Click the lightning bolt icon ⚡ (or press Ctrl+Shift+Enter)
2. The script will:
   - Show users before update
   - Set wassim to ADMIN
   - Set soulayman to CITOYEN
   - Show users after update

### Step 4: Verify
You should see output like:
```
+----+---------------+------------------+-----------+--------+
| id | clerk_user_id | email            | full_name | role   |
+----+---------------+------------------+-----------+--------+
|  1 | user_xxx      | wassim@email.com | Wassim    | ADMIN  |
|  2 | user_yyy      | soul@email.com   | Soulayman | CITOYEN|
+----+---------------+------------------+-----------+--------+
```

---

## Method 2: Using phpMyAdmin (If you have it)

### Step 1: Access phpMyAdmin
1. Open browser
2. Go to: http://localhost/phpmyadmin (or your phpMyAdmin URL)
3. Login with: root / nassim123

### Step 2: Select Database
1. Click on `water_electricity_management` in the left sidebar

### Step 3: Go to SQL Tab
1. Click the **SQL** tab at the top

### Step 4: Paste and Execute
1. Copy this SQL and paste it:

```sql
USE water_electricity_management;

-- Set Wassim as ADMIN
UPDATE users SET role = 'ADMIN'
WHERE email LIKE '%wassim%' OR full_name LIKE '%wassim%';

-- Set Soulayman as CITOYEN
UPDATE users SET role = 'CITOYEN'
WHERE email LIKE '%soulayman%' OR full_name LIKE '%soulayman%';

-- Verify
SELECT id, clerk_user_id, email, full_name, role
FROM users
ORDER BY role, full_name;
```

2. Click **Go**

---

## Method 3: Direct MySQL Command Line

### Step 1: Open Command Prompt
Press `Win + R`, type `cmd`, press Enter

### Step 2: Connect to MySQL
```bash
mysql -u root -p
```
Enter password: `nassim123`

### Step 3: Run Commands
```sql
USE water_electricity_management;

UPDATE users SET role = 'ADMIN'
WHERE email LIKE '%wassim%' OR full_name LIKE '%wassim%';

UPDATE users SET role = 'CITOYEN'
WHERE email LIKE '%soulayman%' OR full_name LIKE '%soulayman%';

SELECT id, clerk_user_id, email, full_name, role FROM users;

EXIT;
```

---

## Method 4: If Users Don't Exist Yet

If the users haven't been created in the database yet (because Clerk webhooks haven't synced), you need to:

### Option A: Trigger Webhook Manually
1. Make sure your backend is running
2. Make sure ngrok is running (if needed)
3. Login/logout with both users in the frontend
4. This should create the users in the database via webhooks
5. Then run the UPDATE script above

### Option B: Create Users Manually
Run this SQL if users don't exist:

```sql
USE water_electricity_management;

-- Create Wassim as ADMIN (replace clerk_user_id with actual value)
INSERT INTO users (clerk_user_id, email, full_name, role)
VALUES ('user_WASSIM_CLERK_ID', 'wassim@email.com', 'Wassim', 'ADMIN');

-- Create Soulayman as CITOYEN (replace clerk_user_id with actual value)
INSERT INTO users (clerk_user_id, email, full_name, role)
VALUES ('user_SOULAYMAN_CLERK_ID', 'soulayman@email.com', 'Soulayman', 'CITOYEN');

-- Verify
SELECT * FROM users;
```

**How to find Clerk User IDs:**
1. Login as wassim
2. Open browser console (F12)
3. Type: `console.log(window.Clerk.user.id)`
4. Copy the value (e.g., `user_2abc123xyz`)
5. Use this in the INSERT query above

---

## After Running the SQL

### Step 1: Restart Frontend (if running)
```bash
cd frontend
npm run dev
```

### Step 2: Test Wassim (Admin)
1. Go to http://localhost:5173
2. Logout if logged in
3. Login as **wassim**
4. **Expected**: Should redirect to `/admin/dashboard` (Admin Dashboard)
5. **Should see**: Admin navigation menu with Users, Meters, Claims management

### Step 3: Test Soulayman (Citizen)
1. Logout
2. Login as **soulayman**
3. **Expected**: Should redirect to `/dashboard` (Citizen Dashboard)
4. **Should see**: Consumption charts, Bills, Claims buttons

---

## Verification Checklist

After running the SQL:

- [ ] Wassim's role = ADMIN in database
- [ ] Soulayman's role = CITOYEN in database
- [ ] Login as wassim → goes to `/admin/dashboard`
- [ ] Login as soulayman → goes to `/dashboard`
- [ ] Wassim can access `/admin/users`
- [ ] Wassim can access `/admin/meters`
- [ ] Soulayman sees "Accès refusé" if trying to access `/admin/*`

---

## Troubleshooting

### Issue: "No users found" in database

**Solution**: Users haven't been created yet.
1. Start backend: `cd backend && docker-compose up`
2. Start frontend: `cd frontend && npm run dev`
3. Login/logout with both users
4. Wait 5 seconds for webhook to process
5. Check database again

### Issue: Wassim still goes to citizen dashboard

**Check 1**: Verify database role
```sql
SELECT email, full_name, role FROM users WHERE email LIKE '%wassim%';
```
Should show: `role = ADMIN`

**Check 2**: Clear browser cache
- Press `Ctrl + Shift + Delete`
- Clear cache and cookies
- Or try incognito mode

**Check 3**: Check browser console for errors
1. Press F12
2. Look for red errors
3. Check if API call to `/api/dashboard/summary/clerk/...` returns role = ADMIN

**Check 4**: Restart frontend
```bash
cd frontend
# Press Ctrl+C to stop
npm run dev
```

### Issue: "Vérification des permissions..." stuck

**Solution**: Backend is not responding
1. Make sure backend is running
2. Check: http://localhost:8081/actuator/health
3. Should return: `{"status":"UP"}`

---

## Summary

**What you need to do:**
1. ✅ Run `SET_WASSIM_AS_ADMIN.sql` in MySQL Workbench
2. ✅ Verify wassim has role = ADMIN
3. ✅ Test login with wassim → should go to admin dashboard
4. ✅ Test login with soulayman → should go to citizen dashboard

**Files already created:**
- ✅ `RoleBasedRedirect.jsx` - Checks role and redirects
- ✅ `App.jsx` - Updated to use role-based redirect
- ✅ `SET_WASSIM_AS_ADMIN.sql` - SQL script to set roles

**You just need to run the SQL script!**
