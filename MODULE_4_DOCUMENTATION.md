# Module 4: Account Roles, Analytics, & Notifications - Implementation Guide

## Overview
This document describes the complete implementation of Module 4 with all four member features properly integrated.

## Module 4 Features

### Member 1: Real-time Notifications System
Users and companies receive real-time notifications about deposit validation, campaign updates, auction activity, direct messages, and credit redemption events.

#### Backend Implementation
- **Model**: `src/models/Notification.ts`
  - Notification types: deposit_validation, campaign_update, auction_activity, direct_message, credit_redemption, auction_match, inventory_match, price_alert, bid_update, auction_won
  - Priority levels: low, medium, high
  - Read/unread status tracking
  - Related entity references

- **Controller**: `src/controllers/notificationController.ts`
  - `createNotification` - Create new notification
  - `getUserNotifications` - Get user's notifications with filters
  - `markAsRead` - Mark single notification as read
  - `markAllAsRead` - Mark all user notifications as read
  - `deleteNotification` - Delete single notification
  - `deleteAllNotifications` - Delete all user notifications
  - `getNotificationStats` - Get notification statistics
  - `sendNotification` - Utility function for sending notifications

- **Routes**: `src/routes/notificationRoutes.ts`
  - POST `/api/notifications` - Create notification
  - GET `/api/users/:userId/notifications` - Get user notifications
  - GET `/api/users/:userId/notifications/stats` - Get notification stats
  - PUT `/api/notifications/:notificationId/read` - Mark as read
  - PUT `/api/users/:userId/notifications/read-all` - Mark all as read
  - DELETE `/api/notifications/:notificationId` - Delete notification
  - DELETE `/api/users/:userId/notifications` - Delete all notifications

#### Frontend Implementation
- **Page**: `frontend/src/pages/Notifications.tsx`
  - View all notifications with filtering (all/unread)
  - Real-time unread count display
  - Mark individual notifications as read
  - Mark all notifications as read
  - Delete individual notifications
  - Priority-based color coding
  - Type-based icons

#### Integration Points
- Deposit verification/rejection triggers notifications
- Credit redemption creates notifications
- Can be extended to campaigns, auctions, and direct messages

---

### Member 2: Admin Analytics & Report Export
Admins can generate and export analytics reports on platform usage, waste deposited, campaign success, and user engagement.

#### Backend Implementation
- **Controller**: `src/controllers/analyticsController.ts`
  - `getPlatformUsage` - Platform activity and user statistics
  - `getWasteAnalytics` - Waste deposit analytics with trends
  - `getCampaignAnalytics` - Campaign success metrics
  - `getUserEngagement` - User activity and engagement metrics
  - `exportAnalytics` - Export data as CSV (deposits, campaigns, auctions, activity logs)

- **Routes**: `src/routes/analyticsRoutes.ts`
  - GET `/api/analytics/platform-usage` - Platform usage stats
  - GET `/api/analytics/waste` - Waste analytics
  - GET `/api/analytics/campaigns` - Campaign analytics
  - GET `/api/analytics/user-engagement` - User engagement
  - GET `/api/analytics/export?type=<type>&startDate=<date>&endDate=<date>` - Export data

#### Frontend Implementation
- **Page**: `frontend/src/pages/AdminAnalytics.tsx`
  - Multiple tabs: Platform Usage, Waste Analytics, Campaigns, User Engagement
  - Date range filtering
  - Visual data presentation with cards and tables
  - CSV export for deposits, campaigns, auctions, activity logs
  - Summary statistics with gradient cards
  - Top contributors and most active users

---

### Member 3: Admin Role Management & Activity Logs
Admins can assign and manage user roles (user, admin, company), adjust permissions, and view logs of platform activities.

#### Backend Implementation
- **Model**: `src/models/ActivityLog.ts`
  - Tracks all user actions with timestamps
  - Records user, action type, resource type, and details
  - Indexed for efficient querying

- **Controller**: `src/controllers/roleController.ts`
  - `getAllUsersWithRoles` - Get all users with role filtering
  - `updateUserRole` - Change user role with logging
  - `getUserPermissions` - Get role-based permissions
  - `bulkUpdateRoles` - Update multiple users' roles
  - `getRoleChangeHistory` - View role change history
  - `deleteUser` - Delete user (except admins)
  - `getRoleStatistics` - Get role distribution stats

- **Routes**: `src/routes/roleRoutes.ts`
  - GET `/api/roles/users` - Get all users with roles
  - GET `/api/roles/statistics` - Get role statistics
  - GET `/api/roles/history` - Get role change history
  - GET `/api/roles/users/:userId/permissions` - Get user permissions
  - PUT `/api/roles/users/:userId` - Update user role
  - POST `/api/roles/bulk-update` - Bulk role updates
  - DELETE `/api/roles/users/:userId` - Delete user

#### Frontend Implementation
- **Page**: `frontend/src/pages/AdminRoleManagement.tsx`
  - Two tabs: User Management, Activity Logs
  - User table with inline role editing
  - Search and filter by role
  - Delete users (protected for admin role)
  - Activity log viewer with filtering
  - Role badges with color coding

#### Permission System
- **Admin**: Full access to all features
- **Company**: View auctions, place bids, view analytics, manage requirements
- **User**: Deposit waste, view campaigns, redeem credits, view notifications

---

### Member 4: Company Analytics Dashboard
Companies can view analytics about their participation: auctions won, materials acquired, and transaction history.

#### Backend Implementation
- **Controller**: `src/controllers/analyticsController.ts`
  - `getCompanyAnalytics` - Company-specific analytics
    - Auctions won by material type
    - Materials acquired details
    - Transaction history
    - Spending trends
    - Total statistics

- **Routes**: `src/routes/analyticsRoutes.ts`
  - GET `/api/analytics/company/:companyId` - Get company analytics

#### Frontend Implementation
- **Page**: `frontend/src/pages/CompanyAnalytics.tsx`
  - Summary cards: Total Auctions Won, Total Materials, Total Spent
  - Auctions won breakdown by material type
  - Recent materials acquired table
  - Spending trend visualization
  - Transaction history timeline
  - Date range filtering

---

## Bug Fixes & Improvements

### Removed Hardcoded Values
1. **Login Page** (`frontend/src/pages/Login.tsx`)
   - Uses email/password authentication
   - Generates user object with proper ID from backend
   - No hardcoded user IDs in production use

2. **Waste Deposit Page** (`frontend/src/pages/WasteDeposit.tsx`)
   - Removed hardcoded default user ID
   - Now gets userId from localStorage (logged-in user)
   - Removed manual user selector dropdown

3. **All Controllers**
   - Use dynamic user IDs from request parameters
   - No hardcoded ObjectIds in business logic
   - Proper validation and error handling

### Navigation Updates
- Added "Notifications" link for all user roles
- Added "Analytics" link for admin users
- Added "Role Management" link for admin users
- Added "Company Analytics" link for company users
- Proper role-based navigation visibility

---

## Testing Checklist

### Backend API Tests
- [x] Notification CRUD operations
- [x] Activity log creation
- [x] Analytics endpoints (platform, waste, campaigns, engagement)
- [x] Role management endpoints
- [x] Company analytics endpoint
- [x] CSV export functionality

### Frontend Tests
- [x] Notifications page loads and displays correctly
- [x] Admin Analytics page with all tabs functional
- [x] Admin Role Management page with user editing
- [x] Company Analytics page with data visualization
- [x] Navigation updates for all user roles
- [x] No hardcoded user IDs causing errors

### Integration Tests
- [x] Notifications sent on deposit verification
- [x] Notifications sent on deposit rejection
- [x] Notifications sent on credit redemption
- [x] Activity logs created for role changes
- [x] Analytics data reflects actual database state

---

## API Endpoints Summary

### Notifications
- POST `/api/notifications`
- GET `/api/users/:userId/notifications`
- PUT `/api/notifications/:notificationId/read`
- PUT `/api/users/:userId/notifications/read-all`
- DELETE `/api/notifications/:notificationId`
- DELETE `/api/users/:userId/notifications`

### Analytics
- GET `/api/analytics/platform-usage`
- GET `/api/analytics/waste`
- GET `/api/analytics/campaigns`
- GET `/api/analytics/user-engagement`
- GET `/api/analytics/company/:companyId`
- GET `/api/analytics/activity-logs`
- GET `/api/analytics/export`

### Role Management
- GET `/api/roles/users`
- GET `/api/roles/statistics`
- GET `/api/roles/history`
- GET `/api/roles/users/:userId/permissions`
- PUT `/api/roles/users/:userId`
- POST `/api/roles/bulk-update`
- DELETE `/api/roles/users/:userId`

---

## Database Models

### Notification
```typescript
{
  recipientId: ObjectId,
  type: string,
  title: string,
  message: string,
  relatedId?: ObjectId,
  relatedType?: string,
  isRead: boolean,
  priority?: string,
  metadata?: object,
  createdAt: Date
}
```

### ActivityLog
```typescript
{
  userId: ObjectId,
  userName: string,
  userRole: string,
  action: string,
  actionType: string,
  resourceType: string,
  resourceId?: ObjectId,
  details?: string,
  metadata?: object,
  ipAddress?: string,
  userAgent?: string,
  timestamp: Date
}
```

---

## Usage Examples

### Sending a Notification (Backend)
```typescript
import { sendNotification } from './controllers/notificationController';

await sendNotification(
  userId,
  'deposit_validation',
  'Deposit Verified!',
  'Your plastic deposit has been verified and you earned 25 credits!',
  depositId,
  'deposit',
  'high'
);
```

### Fetching User Notifications (Frontend)
```typescript
const response = await axios.get(
  `${API_BASE}/users/${userId}/notifications`,
  { params: { unreadOnly: 'true' } }
);
```

### Exporting Analytics Data
```typescript
const response = await axios.get(
  `${API_BASE}/analytics/export`,
  {
    params: { type: 'deposits', startDate: '2025-01-01', endDate: '2025-01-31' },
    responseType: 'blob'
  }
);
```

---

## Deployment Notes

1. **Environment Variables**: Ensure MONGODB_URI and PORT are set
2. **Build Commands**:
   - Backend: `npm run build` then `npm start`
   - Frontend: `npm run build` then serve from `build/` directory
3. **Database**: MongoDB connection required for all features
4. **CORS**: Configured to allow frontend on port 3000

---

## Future Enhancements

1. **Real-time Notifications**: Implement WebSocket for live updates
2. **Advanced Analytics**: Add more visualization options (charts, graphs)
3. **Export Formats**: Support PDF export in addition to CSV
4. **Notification Preferences**: Allow users to customize notification settings
5. **Activity Log Filters**: Add more advanced filtering options
6. **Role Permissions**: Fine-grained permission system
7. **Audit Trail**: Enhanced audit logging for compliance

---

## Contributors
- **Module 4 - Member 1**: Notifications System
- **Module 4 - Member 2**: Analytics & Export
- **Module 4 - Member 3**: Role Management & Activity Logs
- **Module 4 - Member 4**: Company Analytics

---

## Version Information
- Implementation Date: January 3, 2026
- Backend: Node.js + Express + TypeScript + MongoDB
- Frontend: React + TypeScript
- Database: MongoDB with Mongoose ODM
