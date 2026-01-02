# Module 4 Quick Reference Guide

## 🚀 Quick Start

### Start Backend
```bash
cd f:\CSE\471
npm start
```

### Start Frontend
```bash
cd f:\CSE\471\frontend
npm start
```

---

## 📍 Access Points

### Frontend Pages
- **Notifications**: http://localhost:3000/notifications
- **Admin Analytics**: http://localhost:3000/admin-analytics
- **Admin Role Management**: http://localhost:3000/admin-roles
- **Company Analytics**: http://localhost:3000/company-analytics

### Backend API
- **Base URL**: http://localhost:9371/api
- **Documentation**: http://localhost:9371/api/docs

---

## 🔑 Test Credentials

### Admin
- Email: admin@wastewise.com
- Password: 1234

### Company
- Email: company@example.com (or any email with "company" in it)
- Password: any

### User
- Email: user@example.com
- Password: any

---

## 🧪 Testing Module 4 Features

### 1. Test Notifications (Member 1)
1. Login as a regular user
2. Navigate to "My Deposits"
3. Register a waste deposit
4. Login as admin
5. Navigate to "Verify Deposits"
6. Verify or reject the deposit
7. Login back as user
8. Navigate to "Notifications"
9. ✅ You should see a notification about the deposit

### 2. Test Admin Analytics (Member 2)
1. Login as admin
2. Navigate to "Analytics"
3. Switch between tabs: Platform Usage, Waste Analytics, Campaigns, User Engagement
4. Try date range filtering
5. Click "Export Deposits" button
6. ✅ CSV file should download

### 3. Test Role Management (Member 3)
1. Login as admin
2. Navigate to "Role Management"
3. View Users Management tab
4. Click "Edit Role" on a user
5. Change their role and save
6. Switch to Activity Logs tab
7. ✅ You should see the role change logged

### 4. Test Company Analytics (Member 4)
1. Login as a company
2. Navigate to "Company Analytics" (or "Analytics" in company nav)
3. View dashboard with auctions won, materials acquired
4. Try date filtering
5. ✅ View spending trends and transaction history

---

## 📝 API Testing with PowerShell

### Get User Notifications
```powershell
Invoke-RestMethod -Uri "http://localhost:9371/api/users/000000000000000000000004/notifications" -Method GET
```

### Get Platform Analytics
```powershell
Invoke-RestMethod -Uri "http://localhost:9371/api/analytics/platform-usage" -Method GET
```

### Get All Users with Roles
```powershell
Invoke-RestMethod -Uri "http://localhost:9371/api/roles/users" -Method GET
```

### Get Company Analytics
```powershell
Invoke-RestMethod -Uri "http://localhost:9371/api/analytics/company/000000000000000000000002" -Method GET
```

### Export Deposits as CSV
```powershell
Invoke-WebRequest -Uri "http://localhost:9371/api/analytics/export?type=deposits" -Method GET -OutFile "deposits.csv"
```

---

## 🔗 Key Endpoints

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/:userId/notifications` | Get notifications |
| PUT | `/api/notifications/:id/read` | Mark as read |
| DELETE | `/api/notifications/:id` | Delete notification |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/platform-usage` | Platform stats |
| GET | `/api/analytics/waste` | Waste analytics |
| GET | `/api/analytics/campaigns` | Campaign metrics |
| GET | `/api/analytics/company/:id` | Company analytics |
| GET | `/api/analytics/export?type=<type>` | Export CSV |

### Role Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/roles/users` | Get all users |
| PUT | `/api/roles/users/:id` | Update user role |
| GET | `/api/roles/history` | Role change history |
| GET | `/api/analytics/activity-logs` | Activity logs |

---

## 🎨 Navigation Structure

### User Navigation
- Home
- Waste Hubs
- My Deposits
- Campaigns
- Reports
- Blogs
- **Notifications** ← New
- Credits

### Company Navigation
- Dashboard
- Auctions
- Materials
- **Analytics** ← New
- Campaigns
- Reports
- Blogs
- **Notifications** ← New
- Account

### Admin Navigation
- Dashboard
- Verify Deposits
- **Analytics** ← New
- **Role Management** ← New
- Waste Hubs
- Campaigns
- Reports
- Blogs
- **Notifications** ← New

---

## 📊 Database Collections

### New Collections
- `notifications` - User notifications
- `activitylogs` - Platform activity logs

### Updated Collections
- `users` - No schema changes, used by role management
- `deposits` - Integrated with notifications
- `credittransactions` - Integrated with notifications

---

## 🛠️ Troubleshooting

### Backend won't start
```bash
# Check if port 9371 is in use
Get-NetTCPConnection -LocalPort 9371

# If in use, kill the process or change port in .env
```

### MongoDB connection error
```bash
# Check MongoDB status
# Verify MONGODB_URI in .env file
# Default: mongodb://localhost:27017/waste_management
```

### Frontend build errors
```bash
cd frontend
npm install
npm run build
```

### Notifications not appearing
- Verify backend is running
- Check browser console for errors
- Ensure you're logged in
- Try triggering a deposit verification to create a notification

---

## 📦 Dependencies

### Backend
- express
- mongoose
- cors
- dotenv

### Frontend
- react
- react-router-dom
- axios

---

## 💡 Tips

1. **Clear localStorage**: If login issues occur, clear localStorage in browser DevTools
2. **Check Network Tab**: Use browser DevTools to debug API calls
3. **MongoDB Compass**: Use MongoDB Compass to view database directly
4. **Terminal Logs**: Watch backend terminal for API request logs
5. **Date Filtering**: Leave dates blank for all-time analytics

---

## 🎯 Common Tasks

### Add a new notification
```typescript
await sendNotification(
  userId,
  'deposit_validation',
  'Title',
  'Message',
  relatedId,
  'deposit',
  'high'
);
```

### Log an activity
```typescript
await ActivityLog.create({
  userId,
  userName,
  userRole,
  action: 'Description',
  actionType: 'create',
  resourceType: 'deposit',
  timestamp: new Date()
});
```

### Export analytics
```typescript
const response = await axios.get(
  `${API_BASE}/analytics/export`,
  {
    params: { type: 'deposits' },
    responseType: 'blob'
  }
);
```

---

## ✅ Feature Checklist

- [x] Notifications system
- [x] Platform analytics
- [x] Waste analytics
- [x] Campaign analytics
- [x] User engagement metrics
- [x] Company analytics
- [x] CSV export
- [x] Role management
- [x] Activity logs
- [x] Permission system
- [x] Navigation updates
- [x] No hardcoded values

---

## 📞 Support

For issues or questions:
1. Check MODULE_4_DOCUMENTATION.md for detailed info
2. Check MODULE_4_IMPLEMENTATION_SUMMARY.md for overview
3. Review API documentation at /api/docs
4. Check browser and server console logs

---

**Module 4 is Complete and Ready! 🎉**
