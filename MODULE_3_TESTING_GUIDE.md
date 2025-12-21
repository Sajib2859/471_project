# Module 3 Testing Checklist - Frontend & Backend

## ✅ Implementation Status

### Backend - All APIs Working ✓

**Campaign APIs (Member 1 & 4):**
- ✓ POST /api/campaigns - Create campaign
- ✓ GET /api/campaigns - List all campaigns with filters
- ✓ GET /api/campaigns/:id - Get campaign details
- ✓ PUT /api/campaigns/:id - Update campaign
- ✓ DELETE /api/campaigns/:id - Delete campaign
- ✓ POST /api/campaigns/:id/volunteer - Volunteer for campaign
- ✓ POST /api/campaigns/:id/follow - Follow campaign
- ✓ POST /api/campaigns/:id/unfollow - Unfollow campaign
- ✓ PUT /api/campaigns/:id/progress - Update progress
- ✓ GET /api/campaigns/:id/participants - Get participants
- ✓ GET /api/users/:userId/campaigns - Get user's campaigns

**Waste Report APIs (Member 2):**
- ✓ POST /api/waste-reports - Create report
- ✓ GET /api/waste-reports - List all reports with filters
- ✓ GET /api/waste-reports/stats - Get statistics
- ✓ GET /api/waste-reports/:id - Get report details
- ✓ PUT /api/waste-reports/:id - Update report
- ✓ DELETE /api/waste-reports/:id - Delete report
- ✓ POST /api/waste-reports/:id/verify - Verify report (Admin)
- ✓ POST /api/waste-reports/:id/assign - Assign to team (Admin)
- ✓ POST /api/waste-reports/:id/resolve - Resolve report (Admin)
- ✓ POST /api/waste-reports/:id/upvote - Upvote report
- ✓ GET /api/users/:userId/waste-reports - Get user's reports

**Blog APIs (Member 3):**
- ✓ POST /api/blogs - Create blog
- ✓ GET /api/blogs - List all blogs with filters
- ✓ GET /api/blogs/stats - Get statistics
- ✓ GET /api/blogs/trending - Get trending blogs
- ✓ GET /api/blogs/category/:category - Filter by category
- ✓ GET /api/blogs/:id - Get blog details (increments views)
- ✓ PUT /api/blogs/:id - Update blog
- ✓ DELETE /api/blogs/:id - Delete blog
- ✓ POST /api/blogs/:id/like - Like blog
- ✓ POST /api/blogs/:id/unlike - Unlike blog
- ✓ POST /api/blogs/:id/comment - Add comment
- ✓ DELETE /api/blogs/:id/comment/:commentIndex - Delete comment
- ✓ GET /api/users/:userId/blogs - Get user's blogs

### Frontend - All Pages Created ✓

**New Pages:**
1. ✓ Campaigns.tsx - Campaign management & participation
2. ✓ WasteReports.tsx - Report waste locations
3. ✓ Blogs.tsx - Blog/article system

**Navigation Updated:**
- ✓ Guest users can view Campaigns, Reports, Blogs
- ✓ Regular users can create reports, volunteer, comment
- ✓ Admins can create campaigns and manage all features
- ✓ All navigation menus updated with Module 3 links

---

## 🧪 Testing Guide

### How to Test Each Feature:

#### 1. Test Campaigns (Module 3 - Member 1 & 4)

**Backend Test:**
```bash
# Create a campaign
curl -X POST http://localhost:9371/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Beach Cleanup 2025",
    "description": "Join us for beach cleanup",
    "campaignType": "cleanup",
    "location": "Cox Bazar Beach",
    "startDate": "2025-01-20T09:00:00Z",
    "endDate": "2025-01-20T15:00:00Z",
    "goals": ["Collect 500kg waste", "100 volunteers"],
    "createdBy": "YOUR_USER_ID"
  }'

# List all campaigns
curl http://localhost:9371/api/campaigns

# Volunteer for a campaign
curl -X POST http://localhost:9371/api/campaigns/CAMPAIGN_ID/volunteer \
  -H "Content-Type: application/json" \
  -d '{"userId": "YOUR_USER_ID"}'

# Follow a campaign
curl -X POST http://localhost:9371/api/campaigns/CAMPAIGN_ID/follow \
  -H "Content-Type: application/json" \
  -d '{"userId": "YOUR_USER_ID"}'
```

**Frontend Test:**
1. Navigate to http://localhost:3000/campaigns
2. Click "Create New Campaign" (if admin)
3. Fill in campaign details and submit
4. View campaigns list
5. Click "Volunteer" button on any campaign
6. Click "Follow" button to follow updates
7. Check "Your Campaigns" section to see volunteered/following count

#### 2. Test Waste Reports (Module 3 - Member 2)

**Backend Test:**
```bash
# Create a waste report
curl -X POST http://localhost:9371/api/waste-reports \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Illegal Dumping at Park",
    "description": "Large pile of construction waste",
    "location": "Central Park, Sector 10",
    "wasteTypes": ["construction", "plastic"],
    "severity": "high",
    "estimatedQuantity": 200,
    "reportedBy": "YOUR_USER_ID"
  }'

# List all reports
curl http://localhost:9371/api/waste-reports

# Upvote a report
curl -X POST http://localhost:9371/api/waste-reports/REPORT_ID/upvote \
  -H "Content-Type: application/json" \
  -d '{"userId": "YOUR_USER_ID"}'

# Get statistics
curl http://localhost:9371/api/waste-reports/stats
```

**Frontend Test:**
1. Navigate to http://localhost:3000/waste-reports
2. Click "Report Waste Location" button
3. Fill in report details:
   - Title, description, location
   - Waste types (comma-separated)
   - Severity level
   - Estimated quantity
4. Submit report
5. View reports list with filters
6. Click "Upvote" on important reports
7. Use filters to view by status/severity

#### 3. Test Blogs (Module 3 - Member 3)

**Backend Test:**
```bash
# Create a blog post
curl -X POST http://localhost:9371/api/blogs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "10 Ways to Reduce Plastic Waste",
    "excerpt": "Simple tips for reducing plastic use",
    "content": "Here are 10 practical ways to reduce plastic waste in your daily life...",
    "category": "best-practices",
    "tags": ["plastic", "recycling", "tips"],
    "status": "published",
    "author": "YOUR_USER_ID"
  }'

# List all published blogs
curl http://localhost:9371/api/blogs?status=published

# Get trending blogs
curl http://localhost:9371/api/blogs/trending?limit=5

# Like a blog
curl -X POST http://localhost:9371/api/blogs/BLOG_ID/like \
  -H "Content-Type: application/json" \
  -d '{"userId": "YOUR_USER_ID"}'

# Add a comment
curl -X POST http://localhost:9371/api/blogs/BLOG_ID/comment \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "YOUR_USER_ID",
    "content": "Great article! Very helpful."
  }'
```

**Frontend Test:**
1. Navigate to http://localhost:3000/blogs
2. Click "Write New Article" button
3. Fill in blog details:
   - Title, excerpt, content
   - Category, tags, status
4. Publish blog
5. Click on any blog to view full article
6. View count increases automatically
7. Click "Like" button
8. Add comments to blogs
9. Filter blogs by category

---

## 📊 Feature Verification Checklist

### Member 1: Campaign Management ✓
- [x] Admins can create campaigns with scheduling
- [x] Set location and participant limits
- [x] Manage campaign status (scheduled, ongoing, completed)
- [x] Track campaign progress (0-100%)
- [x] View participant lists
- [x] Update campaign details

### Member 2: Waste Reporting ✓
- [x] Users can report waste locations
- [x] Upload information about waste types
- [x] Specify severity levels (low, medium, high, critical)
- [x] Add location details and estimated quantity
- [x] Admin verification system
- [x] Assignment to cleanup teams
- [x] Upvoting system for important reports
- [x] Status tracking (pending → verified → in-progress → resolved)

### Member 3: Blog System ✓
- [x] Users and admins can post articles
- [x] Categories: recycling, waste management, best practices, campaigns, cleanup news, education
- [x] Like functionality
- [x] Comment system
- [x] View tracking
- [x] Tag system for organization
- [x] Draft/published status
- [x] Trending blogs feature

### Member 4: Campaign Participation ✓
- [x] Users can volunteer for campaigns
- [x] Follow campaigns for updates
- [x] View campaign progress
- [x] Receive notifications (integrated with Notification model)
- [x] Track volunteered and followed campaigns
- [x] View participant statistics

---

## 🔗 Quick Access Links

**Frontend:**
- Home: http://localhost:3000
- Campaigns: http://localhost:3000/campaigns
- Waste Reports: http://localhost:3000/waste-reports
- Blogs: http://localhost:3000/blogs

**Backend:**
- API Docs: http://localhost:9371/api/docs
- Health Check: http://localhost:9371
- Campaigns API: http://localhost:9371/api/campaigns
- Reports API: http://localhost:9371/api/waste-reports
- Blogs API: http://localhost:9371/api/blogs

---

## ✨ Key Features Implemented

### 1. **Complete CRUD Operations**
- All entities support Create, Read, Update, Delete operations
- Proper validation and error handling
- MongoDB integration with Mongoose

### 2. **User Interactions**
- Volunteer/Follow system for campaigns
- Upvoting for waste reports
- Like and comment system for blogs
- Notification integration

### 3. **Filtering & Search**
- Filter campaigns by status, type, location
- Filter reports by status, severity
- Filter blogs by category, status
- Statistics endpoints for analytics

### 4. **Role-Based Features**
- Admin: Create campaigns, verify reports, manage all content
- Regular Users: Report waste, volunteer, create blogs, comment
- Guest Users: View all content (read-only)

### 5. **Real-time Updates**
- Progress tracking with percentage display
- Status updates (pending → verified → in-progress → resolved)
- Notification system for important events

---

## 🎯 Test Results

### Backend Server Status: ✅ RUNNING
- Port: 9371
- Database: Connected
- All routes registered
- No TypeScript errors

### Frontend Application Status: ✅ RUNNING
- Port: 3000
- Compiled successfully
- All pages accessible
- Minor React warnings (not critical)

### API Endpoints: ✅ ALL WORKING
- Total new endpoints: 35+
- All CRUD operations functional
- Proper error handling
- JSON responses

---

## 🚀 Next Steps (Optional Enhancements)

1. **Image Upload**: Integrate Cloudinary/AWS S3 for photos
2. **Authentication**: Add JWT-based auth middleware
3. **Real-time**: WebSocket for live updates
4. **Pagination**: Add pagination for large lists
5. **Search**: Full-text search functionality
6. **Email Notifications**: Email alerts for important events
7. **Mobile App**: React Native version

---

## 📝 Summary

✅ **All 4 Module 3 features are fully implemented and working:**

1. **Campaign Management** - Admins can create and manage campaigns
2. **Waste Reporting** - Users can report waste locations with details
3. **Blog System** - Users/admins can post articles with likes/comments
4. **Campaign Participation** - Users can volunteer/follow with notifications

**Total New Code:**
- 3 Models (Campaign, WasteReport, Blog)
- 3 Controllers (36 functions total)
- 3 Route files (35+ endpoints)
- 3 Frontend pages (full UI implementation)
- Updated App.tsx with navigation

**No Breaking Changes:**
- All existing Module 1 & 2 features intact
- Backward compatible
- Follows same architecture patterns

🎉 **Everything is working and ready for testing!**
