# How to Load Sample Data

## ✅ What This Script Does

The `backend/sample-data.sql` script will:

1. **Update your existing users** from Clerk:
   - Makes **Wassim** (`elkaddaouinassim@gmail.com`) an **ADMIN**
   - Keeps **Soulayman** (`elkaddaoui.nassim@etu.uae.ac.ma`) as a **CITOYEN**

2. **Create meters** for both users:
   - 2 meters for Wassim (water + electricity)
   - 2 meters for Soulayman (water + electricity)

3. **Generate 30 days of readings** for all meters

4. **Create bills**:
   - Wassim: 2 PENDING bills (450.75 MAD total)
   - Soulayman: 2 PAID bills (387.75 MAD total)

5. **Add notifications** (alerts, billing, info)

6. **Create sample claims** (water leak, smart grid issue)

## 🚀 How to Run

### Option 1: Command Line (Recommended)

```bash
mysql -u root -pnassim123 < backend/sample-data.sql
```

### Option 2: MySQL Workbench

1. Open MySQL Workbench
2. Connect to your database
3. File → Open SQL Script
4. Select `backend/sample-data.sql`
5. Click the Execute button (⚡)

### Option 3: Copy-Paste

1. Open `backend/sample-data.sql`
2. Copy all the content
3. Paste into your MySQL client
4. Execute

## 📊 After Running

You'll have:

### **ADMIN USER (Wassim)**
- Email: `elkaddaouinassim@gmail.com`
- Access to:
  - Citizen Dashboard: `http://localhost:5173/dashboard`
  - **Admin Dashboard**: `http://localhost:5173/admin/dashboard`
  - **User Management**: `http://localhost:5173/admin/users`
  - **Meter Management**: `http://localhost:5173/admin/meters`
  - **Claims Management**: `http://localhost:5173/admin/claims`

### **CITOYEN USER (Soulayman)**
- Email: `elkaddaoui.nassim@etu.uae.ac.ma`
- Access to:
  - Citizen Dashboard: `http://localhost:5173/dashboard`
  - Claims page
  - Consumption history

## 🔍 Verify Data Loaded

Run these queries to check:

```sql
-- Check users
SELECT id, email, full_name, role FROM users;

-- Check meters
SELECT meter_number, user_id, type, status FROM meters;

-- Check bills
SELECT bill_number, user_id, amount, status FROM bills;

-- Check meter readings count
SELECT meter_id, COUNT(*) as reading_count FROM meter_readings GROUP BY meter_id;
```

## ⚠️ Important Notes

1. **Don't run this script twice** - it will duplicate data
2. **Your users already exist** from Clerk webhook, this just updates them
3. **Wassim becomes ADMIN** automatically when you run this script
4. **No need to create new accounts** - use your existing Clerk accounts

## 🎯 Ready to Test!

After running the script:

1. Start backend: `cd backend/utility-service && mvn spring-boot:run`
2. Start frontend: `cd frontend && npm run dev`
3. Login as Wassim → See ADMIN dashboard
4. Login as Soulayman → See CITOYEN dashboard
