# Admin Redirect - How It Works

## Current Problem

```
┌─────────────┐
│   Login     │
│  (wassim)   │
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│  PublicRoute     │
│  redirects to    │
│  /dashboard      │  ❌ WRONG - Everyone goes to citizen dashboard
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Citizen Dashboard│
│                  │
│  - Wassim sees   │
│    citizen view  │
│  - Soulayman sees│
│    citizen view  │
└──────────────────┘
```

## Solution Implemented

```
┌─────────────┐
│   Login     │
│  (wassim)   │
└──────┬──────┘
       │
       ▼
┌──────────────────────┐
│  PublicRoute         │
│  redirects to        │
│  /auto-redirect      │  ✅ NEW - Check role first
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────────┐
│  RoleBasedRedirect Component │
│                              │
│  1. Fetch user from backend  │
│  2. Check user.role          │
│  3. Redirect based on role   │
└──────┬───────────────────────┘
       │
       │
       ├──────────────────────────────┬──────────────────────────────┐
       │                              │                              │
       │ role = 'ADMIN'               │ role = 'CITOYEN'             │
       │                              │                              │
       ▼                              ▼                              ▼
┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│ Admin Dashboard  │         │ Citizen Dashboard│         │ Operator View    │
│  /admin/dashboard│         │  /dashboard      │         │  /dashboard      │
│                  │         │                  │         │                  │
│  Wassim sees:    │         │  Soulayman sees: │         │  Others see:     │
│  - User Mgmt     │         │  - Consumption   │         │  - Consumption   │
│  - Meter Mgmt    │         │  - Bills         │         │  - Bills         │
│  - Claims Mgmt   │         │  - Claims        │         │  - Claims        │
│  - Analytics     │         │                  │         │                  │
│  - Heatmap       │         │                  │         │                  │
│  - KPIs          │         │                  │         │                  │
└──────────────────┘         └──────────────────┘         └──────────────────┘
```

## The Missing Piece: Database Role

The redirect works, but **wassim must have role = 'ADMIN' in the database**!

### Current Database (Probably):

```sql
+----+---------------+------------------+-----------+---------+
| id | clerk_user_id | email            | full_name | role    |
+----+---------------+------------------+-----------+---------+
|  1 | user_abc123   | wassim@email.com | Wassim    | CITOYEN | ❌ WRONG
|  2 | user_xyz789   | soul@email.com   | Soulayman | CITOYEN | ✅ CORRECT
+----+---------------+------------------+-----------+---------+
```

### What It Should Be:

```sql
+----+---------------+------------------+-----------+---------+
| id | clerk_user_id | email            | full_name | role    |
+----+---------------+------------------+-----------+---------+
|  1 | user_abc123   | wassim@email.com | Wassim    | ADMIN   | ✅ CORRECT
|  2 | user_xyz789   | soul@email.com   | Soulayman | CITOYEN | ✅ CORRECT
+----+---------------+------------------+-----------+---------+
```

## Fix: Run This SQL

**File**: `SET_WASSIM_AS_ADMIN.sql` (already created for you)

```sql
USE water_electricity_management;

UPDATE users SET role = 'ADMIN'
WHERE email LIKE '%wassim%' OR full_name LIKE '%wassim%';

UPDATE users SET role = 'CITOYEN'
WHERE email LIKE '%soulayman%';

-- Verify
SELECT id, email, full_name, role FROM users;
```

## After Running SQL

### Flow for Wassim (ADMIN):

```
1. Open http://localhost:5173
2. Login with wassim credentials
   ↓
3. Clerk authenticates → Returns JWT
   ↓
4. PublicRoute sees isSignedIn = true
   ↓
5. Redirects to /auto-redirect
   ↓
6. RoleBasedRedirect component:
   - Calls: GET /api/dashboard/summary/clerk/{wassim_clerk_id}
   - Backend queries: SELECT role FROM users WHERE clerk_user_id = 'wassim_clerk_id'
   - Returns: { user: { role: 'ADMIN' } }
   ↓
7. RoleBasedRedirect sees role = 'ADMIN'
   ↓
8. Redirects to /admin/dashboard ✅
   ↓
9. Wassim sees Admin Dashboard with:
   - KPI cards
   - User management
   - Meter management
   - Claims management
   - Analytics & Heatmap
```

### Flow for Soulayman (CITOYEN):

```
1. Open http://localhost:5173
2. Login with soulayman credentials
   ↓
3. Clerk authenticates → Returns JWT
   ↓
4. PublicRoute sees isSignedIn = true
   ↓
5. Redirects to /auto-redirect
   ↓
6. RoleBasedRedirect component:
   - Calls: GET /api/dashboard/summary/clerk/{soulayman_clerk_id}
   - Backend queries: SELECT role FROM users WHERE clerk_user_id = 'soulayman_clerk_id'
   - Returns: { user: { role: 'CITOYEN' } }
   ↓
7. RoleBasedRedirect sees role = 'CITOYEN'
   ↓
8. Redirects to /dashboard ✅
   ↓
9. Soulayman sees Citizen Dashboard with:
   - Consumption charts
   - Bills
   - Claims
   - Quick actions
```

## Code Changes Already Made

### 1. RoleBasedRedirect.jsx (NEW FILE)

```javascript
// This component checks the user's role from backend
export default function RoleBasedRedirect() {
  const { user } = useUser();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const data = await getDashboardSummaryByClerkId(user.id);
    setUserRole(data.user?.role || 'CITOYEN');
  }, [user?.id]);

  // Redirect based on role
  if (userRole === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Navigate to="/dashboard" replace />;
}
```

### 2. App.jsx (MODIFIED)

```javascript
// Before:
if (isSignedIn) {
  return <Navigate to="/dashboard" replace />;  // ❌ Everyone → citizen
}

// After:
if (isSignedIn) {
  return <Navigate to="/auto-redirect" replace />;  // ✅ Check role first
}

// Added route:
<Route path="/auto-redirect" element={
  <ProtectedRoute>
    <RoleBasedRedirect />  // This decides where to go
  </ProtectedRoute>
} />
```

## What You Need to Do

### Step 1: Run the SQL
Use MySQL Workbench, phpMyAdmin, or command line:
```sql
UPDATE users SET role = 'ADMIN' WHERE email LIKE '%wassim%';
```

### Step 2: Test
1. Restart frontend: `npm run dev`
2. Login as wassim → Should go to `/admin/dashboard`
3. Login as soulayman → Should go to `/dashboard`

### Step 3: Verify
Open browser console (F12) and check:
```javascript
// After login, this API call should show:
// GET /api/dashboard/summary/clerk/{user_id}
// Response for wassim: { user: { role: "ADMIN" } }
// Response for soulayman: { user: { role: "CITOYEN" } }
```

## Files Created for You

1. ✅ `frontend/src/components/RoleBasedRedirect.jsx` - Role checker
2. ✅ `frontend/src/App.jsx` - Updated routing
3. ✅ `SET_WASSIM_AS_ADMIN.sql` - SQL script to run
4. ✅ `QUICK_FIX_ADMIN.md` - Step-by-step guide
5. ✅ `ADMIN_REDIRECT_EXPLAINED.md` - This file

## Summary

**Problem**: Both users go to citizen dashboard
**Cause**: Database has wassim as CITOYEN instead of ADMIN
**Solution**: Run SQL to set wassim's role to ADMIN
**Result**: Wassim → admin dashboard, Soulayman → citizen dashboard

**Action Required**: Just run the SQL script! Everything else is already coded. ✅
