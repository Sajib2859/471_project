# 📸 Postman Screenshot Guide

**Student ID:** 22201213  
**Purpose:** Capture screenshots of all 14 APIs for submission

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Start Your Server
```powershell
# Open a NEW PowerShell window
cd F:\CSE\471
npm run dev
```
✅ Wait for: `"Server running on port 1213"`

### Step 2: Open Postman
1. Launch **Postman Desktop App**
2. Sign in (or click "Skip and go to the app")

### Step 3: Import Collection
1. Click **"Import"** button (top left corner)
2. Click **"Upload Files"**
3. Browse to: `F:\CSE\471\Postman_Collection_22201213.json`
4. Click **"Import"**

✅ You should see: **"CSE 471 - Waste Management APIs (22201213)"** in left sidebar

---

## 📸 How to Capture Screenshots

### For EACH of the 14 APIs:

1. **Select Request:** Click request name in left sidebar
2. **Click Send:** Blue "Send" button (top right)
3. **Wait for Response:** Status should show `200 OK`
4. **Take Screenshot:** 
   - Press `Win + Shift + S` (Windows Snipping Tool)
   - OR use Snipping Tool / Snip & Sketch
5. **Capture Full Window** showing:
   - ✅ Request URL (e.g., `http://localhost:1213/api/auctions`)
   - ✅ HTTP Method (GET/POST/PUT/DELETE)
   - ✅ Request Body (if POST/PUT)
   - ✅ Response Status (`200 OK`)
   - ✅ Response Body (JSON data)
6. **Save Screenshot:** Use suggested filename below

---

## 📋 14 APIs to Test (In Order)

### 📦 Module 2 - Member 2: Auction Participation (6 APIs)

| # | API Name | Method | Screenshot Name |
|---|----------|--------|-----------------|
| 1 | **Get All Auctions** | GET | `API_01_GetAllAuctions.png` |
| 2 | **Get Single Auction** | GET | `API_02_GetSingleAuction.png` |
| 3 | **Check Eligibility** | POST | `API_03_CheckEligibility.png` |
| 4 | **Place Bid** | POST | `API_04_PlaceBid.png` |
| 5 | **Get User Bid History** | GET | `API_05_GetUserBidHistory.png` |
| 6 | **Get Auction Bids** | GET | `API_06_GetAuctionBids.png` |

### 📦 Module 2 - Member 3: Material Requirements (8 APIs)

| # | API Name | Method | Screenshot Name |
|---|----------|--------|-----------------|
| 7 | **Create Material Requirement** | POST | `API_07_CreateRequirement.png` |
| 8 | **Get All Requirements** | GET | `API_08_GetAllRequirements.png` |
| 9 | **Get Single Requirement** | GET | `API_09_GetSingleRequirement.png` |
| 10 | **Update Requirement** | PUT | `API_10_UpdateRequirement.png` |
| 11 | **Cancel Requirement** | DELETE | `API_11_CancelRequirement.png` |
| 12 | **Find Matching Auctions** | GET | `API_12_FindMatchingAuctions.png` |
| 13 | **Get Company Notifications** | GET | `API_13_GetCompanyNotifications.png` |
| 14 | **Mark Notification as Read** | PUT | `API_14_MarkNotificationRead.png` |

---

## 💡 Pro Tips

### ✅ What Makes a Good Screenshot?

**GOOD Screenshot includes:**
- ✅ Full Postman window (not cropped)
- ✅ Request URL clearly visible
- ✅ HTTP method (GET/POST/PUT/DELETE) shown
- ✅ Request body visible (for POST/PUT requests)
- ✅ Response status: `200 OK` in green
- ✅ Response body showing JSON data
- ✅ No personal information visible

**AVOID:**
- ❌ Cropped or partial screenshots
- ❌ Blurry or low-quality images
- ❌ Missing response body
- ❌ Error responses (make sure server is running!)

### 🎯 Quick Testing Tips

1. **All IDs are pre-configured!** Just click Send
2. **Test in order** - Some APIs depend on previous ones
3. **Check for `"success": true`** in response
4. **Simple IDs used:**
   - Users: 1-5 (e.g., `000000000000000000000001`)
   - Auctions: 101-105
   - Requirements: 301-304
   - Notifications: 401-405

### 🔧 Troubleshooting

**If you get connection errors:**
```powershell
# Check if server is running
Get-Process | Where-Object {$_.ProcessName -eq 'node'}

# Restart server
npm run dev
```

**If you get 404 errors:**
- Verify URL starts with `http://localhost:1213/api/`
- Check that collection was imported correctly

**If you get 500 errors:**
- Make sure MongoDB is running: `net start MongoDB`
- Check database was seeded: `node seed.js`

---

## 📁 Organizing Your Screenshots

### Recommended Folder Structure:
```
F:\CSE\471\Screenshots\
├── API_01_GetAllAuctions.png
├── API_02_GetSingleAuction.png
├── API_03_CheckEligibility.png
├── ...
└── API_14_MarkNotificationRead.png
```

### Create Screenshots Folder:
```powershell
New-Item -Path "F:\CSE\471\Screenshots" -ItemType Directory
```

---

## ✅ Verification Checklist

Before submission, verify you have:

- [ ] All 14 screenshot files
- [ ] Each screenshot shows 200 OK status
- [ ] Request URLs are visible
- [ ] Response bodies contain data
- [ ] Files are named correctly (API_01, API_02, etc.)
- [ ] Screenshots are clear and readable
- [ ] No sensitive information visible

---

## 🎓 Expected Results

### What You Should See:

**API 1-2 (Get Auctions):**
- Response: Array of 5 auctions
- Status: 200 OK
- Data: Plastic, Metal, Paper, Glass, Electronics auctions

**API 3 (Check Eligibility):**
- Response: `{ "success": true, "eligible": true }`
- User 1 has enough credit/cash

**API 4 (Place Bid):**
- Response: `{ "success": true, "message": "Bid placed successfully" }`
- Creates new bid in database

**API 5-6 (Bid History):**
- Response: Array of bids
- Shows bid amount, auction info, timestamp

**API 7 (Create Requirement):**
- Response: New requirement object
- Status: 201 Created

**API 8-9 (Get Requirements):**
- Response: Array of 4-5 requirements
- Shows company, material type, quantity

**API 10 (Update Requirement):**
- Response: Updated requirement
- Changed fields reflected

**API 11 (Delete Requirement):**
- Response: `{ "success": true, "message": "Requirement cancelled" }`

**API 12 (Matching Auctions):**
- Response: Array of matching auctions
- Shows plastic auctions for plastic requirement

**API 13 (Notifications):**
- Response: Array of 5 notifications
- Shows auction_match, bid_update, price_alert types

**API 14 (Mark as Read):**
- Response: Updated notification with `isRead: true`

---

## �️ View Database in MongoDB Compass

MongoDB Compass lets you visually browse your database and verify the data.

### Step 1: Open MongoDB Compass
1. Launch **MongoDB Compass** application
2. If not installed, download from: https://www.mongodb.com/try/download/compass

### Step 2: Connect to Database
1. In the connection screen, you'll see: `mongodb://localhost:27017`
2. Click **"Connect"** (no password needed for local MongoDB)
3. Wait for connection to establish

### Step 3: Navigate to Your Database
1. In the left sidebar, click on **"waste_management"** database
2. You'll see 5 collections:
   - 📁 `users` (5 documents)
   - 📁 `auctions` (5 documents)
   - 📁 `bids` (varies - grows as you test)
   - 📁 `materialrequirements` (4 documents)
   - 📁 `notifications` (5 documents)

### Step 4: View Collection Data
1. Click on any collection name (e.g., `users`)
2. You'll see all documents in that collection
3. Click on any document to expand and view details

### 🔍 What to Look For:

**In `users` collection:**
```javascript
{
  _id: ObjectId("000000000000000000000001"),
  name: "Regular User",
  email: "user@test.com",
  role: "user",
  creditBalance: 500,
  cashBalance: 10000
}
```

**In `auctions` collection:**
```javascript
{
  _id: ObjectId("000000000000000000000101"),
  title: "Recycled Plastic Bottles Auction",
  materialType: "plastic",
  quantity: 500,
  currentBid: 1000,
  status: "live"
}
```

**In `materialrequirements` collection:**
```javascript
{
  _id: ObjectId("000000000000000000000301"),
  companyId: ObjectId("000000000000000000000002"),
  materialType: "plastic",
  quantity: 1000,
  status: "active"
}
```

### 💡 Compass Tips:

**Filter Documents:**
- Use filter bar at top: `{ "role": "company" }`
- Find specific user: `{ "_id": ObjectId("000000000000000000000002") }`

**View Relationships:**
- Check `bids` collection to see which user bid on which auction
- Check `notifications` to see what alerts were sent to companies

**Verify Test Data:**
- After running `node seed.js`, verify 22 total documents exist
- Check that all IDs follow the simple pattern (1-5, 101-105, etc.)

**Monitor Changes:**
- After testing APIs in Postman, refresh Compass to see new bids
- Watch `bids` collection grow as you place bids
- See notifications being marked as read

### 📸 Optional: Take Database Screenshots

You can also capture Compass screenshots showing:
1. Database overview with all 5 collections
2. Sample documents from each collection
3. Simple ID patterns in action

---

## �📞 Need Help?

1. **Server not starting?** Check MongoDB is running: `net start MongoDB`
2. **Import failed?** Verify file path: `F:\CSE\471\Postman_Collection_22201213.json`
3. **Empty responses?** Re-seed database: `node seed.js`
4. **IDs not working?** Check [SIMPLE_ID_REFERENCE.md](./SIMPLE_ID_REFERENCE.md)
5. **Compass not connecting?** Verify MongoDB service is running

---

## 🎯 Time Estimate

- Server setup: 2 minutes
- Import collection: 1 minute
- Test & screenshot all 14 APIs: 15-20 minutes
- **Total: ~20-25 minutes**

---

**Good luck with your screenshots! 🚀**

**Remember:** The collection has everything pre-configured. Just click Send and capture! 📸
