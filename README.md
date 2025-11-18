# Waste Management System - Backend API

**Student ID:** 22201213  
**Module:** Module 2 - Credit, Auctions, & Marketplace  
**Assignment:** REST API Development  

---

## ⚡ Quick Start (TL;DR)

```bash
# 1. Install dependencies
npm install

# 2. Start MongoDB (Windows)
net start MongoDB

# 3. Seed database with test data
node seed.js

# 4. Start server
npm run dev

# 5. Test all APIs
.\test_all_apis.ps1
```

✅ **Server:** http://localhost:1213  
✅ **Test IDs:** See [SIMPLE_ID_REFERENCE.md](./SIMPLE_ID_REFERENCE.md)  
✅ **Postman:** Import `Postman_Collection_22201213.json`  

---

## 📋 Project Overview

This project implements REST APIs for a Waste Management System focusing on:

### Module 2 - Member 2: Auction Participation
Users and companies can participate in live online auctions for recyclable materials, provided they meet eligibility requirements (minimum credit or cash balance).

**Features:**
- View all available auctions
- Check eligibility for auction participation
- Place bids on live auctions
- View bid history
- Real-time auction updates

### Module 2 - Member 3: Material Requirements & Notifications
Companies can post their requirements for specific waste materials and receive notifications when matching auctions or inventory are available.

**Features:**
- Create material requirements
- Find matching auctions
- Receive real-time notifications
- Manage requirements (update/cancel)
- Track notification history

---

## 🛠️ Tech Stack

- **Language:** TypeScript
- **Backend Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Runtime:** Node.js
- **Server Port:** 1213 (Last 4 digits of student ID: 22201213)

---

## 📁 Project Structure

```
F:\CSE\471\
├── src/
│   ├── config/
│   │   └── database.ts          # MongoDB connection
│   ├── models/
│   │   ├── User.ts              # User/Company model
│   │   ├── Auction.ts           # Auction model
│   │   ├── Bid.ts               # Bid model
│   │   ├── MaterialRequirement.ts  # Material requirement model
│   │   └── Notification.ts      # Notification model
│   ├── controllers/
│   │   ├── auctionController.ts          # Auction API logic
│   │   └── materialRequirementController.ts  # Material requirement API logic
│   ├── routes/
│   │   ├── auctionRoutes.ts              # Auction routes
│   │   └── materialRequirementRoutes.ts  # Material requirement routes
│   └── server.ts                # Main server file
├── dist/                        # Compiled JavaScript
├── .env                         # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
├── seed.js                      # Database seeding script
├── test_all_apis.ps1           # Automated API testing
├── Postman_Collection_22201213.json  # Postman collection
├── README.md                    # This file
├── API_DOCUMENTATION.md         # Complete API reference
└── SIMPLE_ID_REFERENCE.md       # ID lookup table
```

---

## 🚀 Setup Instructions

### Prerequisites

1. **Node.js** (v16 or higher)
2. **MongoDB** (v5 or higher)
3. **npm** or **yarn**
4. **Postman** (for API testing)

### Installation Steps

#### 1. Clone or Navigate to Project Directory
```bash
cd F:\CSE\471
```

#### 2. Install Dependencies
```bash
npm install
```

This will install:
- express (^4.18.2)
- mongoose (^8.0.0)
- dotenv (^16.3.1)
- cors (^2.8.5)
- typescript (^5.3.2)
- ts-node (^10.9.1)
- nodemon (^3.0.2)
- And all type definitions

#### 3. Set Up MongoDB

**Option A: Local MongoDB**
- Install MongoDB Community Edition
- Start MongoDB service:
  ```bash
  # Windows
  net start MongoDB
  
  # Or use MongoDB Compass
  ```

**Option B: MongoDB Atlas (Cloud)**
- Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Get your connection string
- Update `.env` file with your connection string

#### 4. Configure Environment Variables

The `.env` file should contain:
```env
PORT=1213
MONGODB_URI=mongodb://localhost:27017/waste_management
NODE_ENV=development
```

For MongoDB Atlas:
```env
PORT=1213
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/waste_management
NODE_ENV=development
```

#### 5. Seed Test Data with Simple IDs

**Quick Method (Recommended):**
```bash
node seed.js
```

This will populate your database with:
- **5 Users** (IDs: 1-5) including Regular User, Company ABC, etc.
- **5 Auctions** (IDs: 101-105) for Plastic, Metal, Paper, Glass, and Electronics
- **4 Material Requirements** (IDs: 301-304) from various companies
- **5 Notifications** (IDs: 401-405) for matching auctions

**🎯 Simple ID System:**
All IDs use an easy-to-remember pattern:
- Users: `000000000000000000000001` to `000000000000000000000005`
- Auctions: `000000000000000000000101` to `000000000000000000000105`
- Material Requirements: `000000000000000000000301` to `000000000000000000000304`
- Notifications: `000000000000000000000401` to `000000000000000000000405`

**Key Test IDs:**
- Regular User: `000000000000000000000001` (Short: 1)
- Company ABC: `000000000000000000000002` (Short: 2)
- Plastic Auction: `000000000000000000000101` (Short: 101)
- Plastic Requirement: `000000000000000000000301` (Short: 301)

> 📖 See **[SIMPLE_ID_REFERENCE.md](./SIMPLE_ID_REFERENCE.md)** for complete ID lookup table

#### 6. Run the Server

**Development Mode (with auto-restart):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm run build
npm start
```

#### 7. Verify Server is Running

Open your browser or Postman and visit:
- Server: http://localhost:1213/
- API Docs: http://localhost:1213/api/docs

You should see:
```json
{
  "success": true,
  "message": "Waste Management API Server",
  "studentId": "22201213",
  "port": 1213
}
```

---

## 📚 API Documentation

Complete API documentation is available in **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**

### Quick Reference

**Base URL:** `http://localhost:1213/api`

#### Auction APIs (Module 2 - Member 2)
- `GET /auctions` - Get all auctions
- `GET /auctions/:id` - Get single auction
- `POST /auctions/:id/check-eligibility` - Check eligibility
- `POST /auctions/:id/bid` - Place a bid
- `GET /users/:userId/bids` - Get user bid history
- `GET /auctions/:id/bids` - Get auction bids

#### Material Requirement APIs (Module 2 - Member 3)
- `POST /material-requirements` - Create requirement
- `GET /material-requirements` - Get all requirements
- `GET /material-requirements/:id` - Get single requirement
- `PUT /material-requirements/:id` - Update requirement
- `DELETE /material-requirements/:id` - Cancel requirement
- `GET /material-requirements/:id/matches` - Find matching auctions
- `GET /companies/:companyId/notifications` - Get notifications
- `PUT /notifications/:id/read` - Mark notification as read

---

## 🧪 Testing

### Automated Testing (Recommended)

Run the comprehensive test script that validates all 14 APIs:

```powershell
.\test_all_apis.ps1
```

**Test Coverage:**
- ✅ Server health check
- ✅ All 6 Auction APIs
- ✅ All 8 Material Requirement APIs
- ✅ Bonus: DELETE requirement API

**Expected Result:** `15/15 tests passed (100%)`

### Manual Testing with Postman

**Method 1: Import Collection (Fastest)**
1. Open Postman
2. Click **Import** → **Upload Files**
3. Select `Postman_Collection_22201213.json`
4. All 14 endpoints will be ready with pre-configured test data!

**Method 2: Manual Setup**
1. **Start the server:** `npm run dev`
2. **Open Postman**
3. **Create a new GET request**
4. **URL:** `http://localhost:1213/api/auctions`
5. **Click Send**

**Test with Simple IDs:**
- Get Company ABC notifications: `GET /api/companies/000000000000000000000002/notifications`
- Place bid on Plastic Auction: `POST /api/auctions/000000000000000000000101/bid`
- Get Plastic Requirement matches: `GET /api/material-requirements/000000000000000000000301/matches`

> 💡 All test IDs available in [SIMPLE_ID_REFERENCE.md](./SIMPLE_ID_REFERENCE.md)

---

## 📦 Database Models

### User Model
```typescript
{
  name: String
  email: String (unique)
  role: 'user' | 'admin' | 'company'
  creditBalance: Number
  cashBalance: Number
  createdAt: Date
}
```

### Auction Model
```typescript
{
  title: String
  materialType: String
  quantity: Number
  currentBid: Number
  minimumCreditRequired: Number
  minimumCashRequired: Number
  status: 'scheduled' | 'live' | 'completed' | 'cancelled'
  // ... more fields
}
```

### Material Requirement Model
```typescript
{
  companyId: ObjectId
  materialType: String
  quantity: Number
  maxPrice: Number
  urgency: 'low' | 'medium' | 'high'
  status: 'active' | 'fulfilled' | 'cancelled'
  notificationPreferences: Object
  // ... more fields
}
```

---

## 🎯 Features Implemented

### Module 2 - Member 2: Auction Participation (6 APIs)
✅ View all auctions with filters  
✅ View single auction details  
✅ Check user eligibility for auctions  
✅ Place bids on live auctions  
✅ View user bid history  
✅ View all bids for an auction  

### Module 2 - Member 3: Material Requirements (8 APIs)
✅ Create material requirements (companies only)  
✅ View all material requirements  
✅ View single requirement details  
✅ Update material requirements  
✅ Cancel material requirements  
✅ Find matching auctions  
✅ View company notifications  
✅ Mark notifications as read  

---

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Run in development mode (with auto-restart)
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run in production mode
npm start

# Check TypeScript compilation
npx tsc --noEmit
```

---

## ❗ Troubleshooting

### Port Already in Use
```bash
# Windows - Find and kill process on port 1213
netstat -ano | findstr :1213
taskkill /PID <PID> /F
```

### MongoDB Connection Error
- Verify MongoDB is running: `net start MongoDB`
- Check connection string in `.env`
- Test connection using MongoDB Compass

### TypeScript Errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Module Not Found Errors
```bash
# Install missing type definitions
npm install --save-dev @types/node @types/express @types/cors
```

---

## 📝 Assignment Requirements Checklist

✅ **REST APIs Developed:** 14 unique endpoints  
✅ **Database Connected:** MongoDB with Mongoose  
✅ **Port Configuration:** Server runs on port 1213 (last 4 digits of 22201213)  
✅ **API Documentation:** Each API includes:
  - Endpoint URL
  - HTTP Method
  - Headers
  - Body/Parameters
  - Code Snippets  
✅ **Postman Testing Guide:** Complete with instructions  
✅ **Individual Work:** No duplicated APIs among group members  
✅ **Module 2 Features:** Both Member 2 and Member 3 implemented  

---

## 👨‍💻 Author

**Student ID:** 22201213  
**Course:** CSE 471  
**Module:** Module 2 - Credit, Auctions, & Marketplace  
**Features:** Member 2 (Auction Participation) + Member 3 (Material Requirements)  

---

## 📄 License

This project is created for educational purposes as part of CSE 471 course assignment.

---

## 📞 Support

For any issues or questions:
1. Check the [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for endpoint details
2. Review [SIMPLE_ID_REFERENCE.md](./SIMPLE_ID_REFERENCE.md) for test IDs
3. Run automated tests: `.\test_all_apis.ps1`
4. Import Postman collection: `Postman_Collection_22201213.json`
5. Verify MongoDB is running: `net start MongoDB`
6. Check server logs for error messages

---

## 🎓 Learning Outcomes

Through this project, I have:
- ✅ Built RESTful APIs using Express.js and TypeScript
- ✅ Implemented MongoDB database with Mongoose ODM
- ✅ Created CRUD operations for multiple resources
- ✅ Handled authentication and authorization logic
- ✅ Implemented complex business logic (auctions, bids, notifications)
- ✅ Written comprehensive API documentation
- ✅ Created automated testing with 100% pass rate (15/15 tests)
- ✅ Designed simple ID system for easy testing and debugging

---

## ✅ Testing Status

**Automated Test Results:** `15/15 PASSED (100%)`

All 14 required APIs have been implemented and tested successfully:
- ✅ 6 Auction APIs (Member 2)
- ✅ 8 Material Requirement APIs (Member 3)
- ✅ 1 Bonus DELETE API

Run `.\test_all_apis.ps1` to verify all endpoints are working correctly.

---

**Note:** All test data uses simple, memorable IDs. See [SIMPLE_ID_REFERENCE.md](./SIMPLE_ID_REFERENCE.md) for the complete list!
