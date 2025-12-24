# Smart City Tetouan - Implementation Guide

## Table of Contents
1. [Connect Dashboard to Real Database](#1-connect-dashboard-to-real-database)
2. [Create Admin User](#2-create-admin-user)
3. [Professional Design with Images](#3-professional-design-with-images)
4. [Admin Interface](#4-admin-interface)

---

## 1. Connect Dashboard to Real Database

### Backend Setup (Already Created)

I've created the following backend files:

**Models:**
- `backend/utility-service/src/main/java/com/smartcity/tetouan/model/Meter.java`
- `backend/utility-service/src/main/java/com/smartcity/tetouan/model/MeterReading.java`
- `backend/utility-service/src/main/java/com/smartcity/tetouan/model/Bill.java`
- `backend/utility-service/src/main/java/com/smartcity/tetouan/model/Notification.java`

**Repositories:**
- `backend/utility-service/src/main/java/com/smartcity/tetouan/repository/MeterRepository.java`
- `backend/utility-service/src/main/java/com/smartcity/tetouan/repository/MeterReadingRepository.java`
- `backend/utility-service/src/main/java/com/smartcity/tetouan/repository/BillRepository.java`
- `backend/utility-service/src/main/java/com/smartcity/tetouan/repository/NotificationRepository.java`

**Services:**
- `backend/utility-service/src/main/java/com/smartcity/tetouan/service/DashboardService.java`
- `backend/utility-service/src/main/java/com/smartcity/tetouan/dto/DashboardSummaryDTO.java`

**Controller:**
- `backend/utility-service/src/main/java/com/smartcity/tetouan/controller/DashboardController.java`

### Load Sample Data

Run this SQL script to populate your database with sample data:

```bash
mysql -u root -pnassim123 < backend/sample-data.sql
```

This will create:
- Sample users
- Water and electricity meters
- 30 days of meter readings
- Bills
- Notifications/alerts
- Sample claims

### Update Frontend to Use Real API

You need to update your `frontend/src/pages/Dashboard/Dashboard.jsx` to fetch from the API instead of mock data.

---

## 2. Create Admin User

### Steps to Create an Admin User:

1. **Sign up through Clerk** with your admin email:
   - Go to: https://cute-sunbird-79.clerk.accounts.dev/sign-up
   - Use email: `admin@smartcity-tetouan.ma` (or your preferred email)
   - Complete the sign-up process

2. **Find your Clerk User ID:**
   - Go to Clerk Dashboard → Users
   - Click on your admin user
   - Copy the User ID (starts with `user_`)

3. **Update the database:**

```sql
USE water_electricity_management;

-- Option 1: If webhook already created the user, update their role
UPDATE users
SET role = 'ADMIN'
WHERE clerk_user_id = 'YOUR_ACTUAL_CLERK_USER_ID';

-- Option 2: If user doesn't exist, insert manually
INSERT INTO users (clerk_user_id, email, full_name, phone, role, created_at)
VALUES ('YOUR_CLERK_USER_ID', 'admin@smartcity-tetouan.ma', 'Admin SmartCity', '+212 6 12 34 56 78', 'ADMIN', NOW());
```

---

## 3. Professional Design with Images

### Image Directories to Create:

Create these folders in your frontend:

```
frontend/src/assets/images/
├── dashboard/
│   ├── hero-bg.jpg
│   ├── water-meter.jpg
│   ├── electricity-meter.jpg
│   ├── smart-city.jpg
│   └── analytics.jpg
├── admin/
│   ├── admin-dashboard.jpg
│   └── data-visualization.jpg
└── icons/
    ├── water-drop.svg
    ├── electricity-bolt.svg
    └── alert-icon.svg
```

### Where to Find Professional Images:

**Free Stock Photo Sites:**
1. **Unsplash** (https://unsplash.com/):
   - Search: "smart city dashboard"
   - Search: "water meter"
   - Search: "electricity grid"
   - Search: "data analytics"

2. **Pexels** (https://pexels.com/):
   - Search: "smart meter"
   - Search: "urban technology"
   - Search: "data visualization"

3. **Pixabay** (https://pixabay.com/):
   - Search: "smart city"
   - Search: "utility monitoring"

### Recommended Images:

**For Dashboard Hero Section:**
- Image: Modern smart city dashboard with data visualizations
- Keywords: "smart city dashboard", "IoT monitoring", "data analytics"
- URL example: https://unsplash.com/s/photos/smart-city-dashboard

**For Water Consumption Card:**
- Image: Water meter or water management system
- Keywords: "water meter", "smart water monitoring"
- URL example: https://unsplash.com/s/photos/water-meter

**For Electricity Consumption Card:**
- Image: Smart electricity meter or power grid
- Keywords: "smart meter", "electricity grid", "power monitoring"
- URL example: https://unsplash.com/s/photos/smart-electricity-meter

**For Background:**
- Image: Tétouan city skyline or modern city infrastructure
- Keywords: "tetouan morocco", "smart city", "urban infrastructure"

### Icon Resources:

**Free Icon Libraries:**
1. **Heroicons** (https://heroicons.com/) - Modern, clean icons
2. **Font Awesome** (https://fontawesome.com/) - Already included in your project
3. **Lucide** (https://lucide.dev/) - Already included in your project

---

## 4. Admin Interface

### Admin Dashboard Pages to Create:

1. **Admin Dashboard Overview** (`/admin/dashboard`)
   - Total users count
   - Total consumption (water + electricity)
   - Revenue statistics
   - Active alerts count
   - Claims status overview

2. **User Management** (`/admin/users`)
   - List all users
   - View user details
   - Edit user roles (ADMIN, CITOYEN, OPERATOR)
   - View user consumption history

3. **Meter Management** (`/admin/meters`)
   - List all meters
   - Add new meters
   - Edit meter details
   - View meter status (ACTIVE, INACTIVE, MAINTENANCE)

4. **Claims Management** (`/admin/claims`)
   - View all claims
   - Assign claims to operators
   - Update claim status
   - Add claim messages

5. **Billing Management** (`/admin/billing`)
   - Generate bills
   - View all bills
   - Mark bills as paid
   - Send payment reminders

6. **Analytics & Reports** (`/admin/analytics`)
   - Consumption trends
   - Revenue reports
   - User behavior analytics
   - Export reports (PDF/Excel)

### Admin Routes Setup:

```javascript
// In frontend/src/App.jsx
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';
import MeterManagement from './pages/Admin/MeterManagement';

// Protected Admin Routes
<Route path="/admin/*" element={
  <AdminRoute>
    <Routes>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="meters" element={<MeterManagement />} />
      <Route path="claims" element={<ClaimsManagement />} />
      <Route path="billing" element={<BillingManagement />} />
      <Route path="analytics" element={<Analytics />} />
    </Routes>
  </AdminRoute>
} />
```

### Admin Route Protection Component:

```javascript
// frontend/src/components/AdminRoute.jsx
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // Check if user has ADMIN role in your database
  // You'll need to fetch this from your API
  const isAdmin = user?.publicMetadata?.role === 'ADMIN';

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
```

---

## Next Steps

1. **Run the SQL script** to populate your database with sample data
2. **Create an admin user** following the steps above
3. **Download professional images** and place them in the assets folder
4. **Test the real API** connection by running the utility-service
5. **Implement admin dashboard** pages

---

## Testing Checklist

- [ ] MySQL database populated with sample data
- [ ] Admin user created with ADMIN role
- [ ] Utility-service running on port 8081
- [ ] Frontend fetching data from real API
- [ ] Images downloaded and placed in assets folder
- [ ] Dashboard displays real consumption data
- [ ] Alerts showing from notifications table
- [ ] Bills showing pending amounts
- [ ] Admin routes protected and accessible

---

## Support

If you encounter any issues:
1. Check MySQL connection and credentials
2. Verify all Spring Boot services are running
3. Check browser console for API errors
4. Verify Clerk authentication is working
