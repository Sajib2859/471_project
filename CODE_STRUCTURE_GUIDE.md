# 📂 Code Structure Guide - Where Everything Is

**Student ID:** 22201213

This guide shows you where all the API functions are defined in your codebase.

---

## 🗂️ Project Structure Overview

```
F:\CSE\471\
├── src/
│   ├── controllers/          ← API FUNCTIONS DEFINED HERE!
│   │   ├── auctionController.ts          (6 functions)
│   │   └── materialRequirementController.ts  (8 functions)
│   ├── routes/              ← URL PATHS DEFINED HERE
│   │   ├── auctionRoutes.ts
│   │   └── materialRequirementRoutes.ts
│   ├── models/              ← DATABASE SCHEMAS
│   │   ├── User.ts
│   │   ├── Auction.ts
│   │   ├── Bid.ts
│   │   ├── MaterialRequirement.ts
│   │   └── Notification.ts
│   ├── config/
│   │   └── database.ts      ← MongoDB connection
│   └── server.ts            ← Main entry point
```

---

## 📍 Where GET Functions Are Defined

### 🎯 **Controllers = WHERE THE LOGIC IS**

All your API functions (GET, POST, PUT, DELETE) are defined in **controller files**:

---

## 📁 File 1: `src/controllers/auctionController.ts`

**Contains 6 auction-related API functions:**

### 1️⃣ `getAllAuctions()` - Line 10
```typescript
export const getAllAuctions = async (req: Request, res: Response): Promise<void> => {
  // Gets all auctions with optional filters
  // URL: GET /api/auctions
  // Query params: status, materialType, minPrice, maxPrice
}
```

### 2️⃣ `getAuctionById()` - Line 44
```typescript
export const getAuctionById = async (req: Request, res: Response): Promise<void> => {
  // Gets single auction by ID
  // URL: GET /api/auctions/:id
  // Params: id (from URL)
}
```

### 3️⃣ `checkEligibility()` - Line 82
```typescript
export const checkEligibility = async (req: Request, res: Response): Promise<void> => {
  // Checks if user meets auction requirements
  // URL: POST /api/auctions/:id/check-eligibility
  // Body: { userId }
}
```

### 4️⃣ `placeBid()` - Line 144
```typescript
export const placeBid = async (req: Request, res: Response): Promise<void> => {
  // Places a bid on an auction
  // URL: POST /api/auctions/:id/bid
  // Body: { bidderId, bidAmount, bidType }
}
```

### 5️⃣ `getUserBids()` - Line 270
```typescript
export const getUserBids = async (req: Request, res: Response): Promise<void> => {
  // Gets all bids for a specific user
  // URL: GET /api/users/:userId/bids
  // Params: userId (from URL)
}
```

### 6️⃣ `getAuctionBids()` - Line 293
```typescript
export const getAuctionBids = async (req: Request, res: Response): Promise<void> => {
  // Gets all bids for a specific auction
  // URL: GET /api/auctions/:id/bids
  // Params: id (from URL)
}
```

---

## 📁 File 2: `src/controllers/materialRequirementController.ts`

**Contains 8 material requirement API functions:**

### 7️⃣ `createMaterialRequirement()` - Line 10
```typescript
export const createMaterialRequirement = async (req: Request, res: Response): Promise<void> => {
  // Creates new material requirement
  // URL: POST /api/material-requirements
  // Body: { companyId, materialType, quantity, ... }
}
```

### 8️⃣ `getAllMaterialRequirements()` - Line 82
```typescript
export const getAllMaterialRequirements = async (req: Request, res: Response): Promise<void> => {
  // Gets all requirements with filters
  // URL: GET /api/material-requirements
  // Query params: status, materialType, urgency, companyId
}
```

### 9️⃣ `getMaterialRequirementById()` - Line 109
```typescript
export const getMaterialRequirementById = async (req: Request, res: Response): Promise<void> => {
  // Gets single requirement by ID
  // URL: GET /api/material-requirements/:id
  // Params: id (from URL)
}
```

### 🔟 `updateMaterialRequirement()` - Line 133
```typescript
export const updateMaterialRequirement = async (req: Request, res: Response): Promise<void> => {
  // Updates existing requirement
  // URL: PUT /api/material-requirements/:id
  // Body: { quantity, maxPrice, urgency, ... }
}
```

### 1️⃣1️⃣ `deleteMaterialRequirement()` - Line 165
```typescript
export const deleteMaterialRequirement = async (req: Request, res: Response): Promise<void> => {
  // Deletes (cancels) requirement
  // URL: DELETE /api/material-requirements/:id
  // Params: id (from URL)
}
```

### 1️⃣2️⃣ `getMatchingAuctions()` - Line 193
```typescript
export const getMatchingAuctions = async (req: Request, res: Response): Promise<void> => {
  // Finds auctions matching a requirement
  // URL: GET /api/material-requirements/:id/matches
  // Params: id (from URL)
}
```

### 1️⃣3️⃣ `getCompanyNotifications()` - Line 223
```typescript
export const getCompanyNotifications = async (req: Request, res: Response): Promise<void> => {
  // Gets notifications for a company
  // URL: GET /api/companies/:companyId/notifications
  // Params: companyId (from URL)
  // Query params: isRead, type
}
```

### 1️⃣4️⃣ `markNotificationAsRead()` - Line 251
```typescript
export const markNotificationAsRead = async (req: Request, res: Response): Promise<void> => {
  // Marks notification as read
  // URL: PUT /api/notifications/:id/read
  // Params: id (from URL)
}
```

---

## 🛣️ How URLs Connect to Functions

The **routes files** connect URLs to controller functions:

### File: `src/routes/auctionRoutes.ts`

```typescript
import { Router } from 'express';
import {
  getAllAuctions,          // Function imported from controller
  getAuctionById,
  checkEligibility,
  placeBid,
  getUserBids,
  getAuctionBids
} from '../controllers/auctionController';

const router = Router();

// URL → Function mapping
router.get('/auctions', getAllAuctions);                    // GET /api/auctions
router.get('/auctions/:id', getAuctionById);                // GET /api/auctions/:id
router.post('/auctions/:id/check-eligibility', checkEligibility); // POST /api/auctions/:id/check-eligibility
router.post('/auctions/:id/bid', placeBid);                 // POST /api/auctions/:id/bid
router.get('/users/:userId/bids', getUserBids);             // GET /api/users/:userId/bids
router.get('/auctions/:id/bids', getAuctionBids);          // GET /api/auctions/:id/bids

export default router;
```

### File: `src/routes/materialRequirementRoutes.ts`

```typescript
import { Router } from 'express';
import {
  createMaterialRequirement,
  getAllMaterialRequirements,
  getMaterialRequirementById,
  updateMaterialRequirement,
  deleteMaterialRequirement,
  getMatchingAuctions,
  getCompanyNotifications,
  markNotificationAsRead
} from '../controllers/materialRequirementController';

const router = Router();

// URL → Function mapping
router.post('/material-requirements', createMaterialRequirement);
router.get('/material-requirements', getAllMaterialRequirements);
router.get('/material-requirements/:id', getMaterialRequirementById);
router.put('/material-requirements/:id', updateMaterialRequirement);
router.delete('/material-requirements/:id', deleteMaterialRequirement);
router.get('/material-requirements/:id/matches', getMatchingAuctions);
router.get('/companies/:companyId/notifications', getCompanyNotifications);
router.put('/notifications/:id/read', markNotificationAsRead);

export default router;
```

---

## 🔄 Request Flow (How It Works)

```
1. User sends request → http://localhost:1213/api/auctions
                                                 ↓
2. Express server.ts → Receives request
                                                 ↓
3. Routes file       → Matches URL pattern "/auctions"
                                                 ↓
4. Controller        → Calls getAllAuctions() function
                                                 ↓
5. Database query    → Auction.find({...})
                                                 ↓
6. Response          → Returns JSON data to user
```

---

## 📖 Quick Reference Table

| API # | Method | URL | Controller File | Function Name | Line # |
|-------|--------|-----|----------------|---------------|--------|
| 1 | GET | `/api/auctions` | auctionController.ts | `getAllAuctions` | 10 |
| 2 | GET | `/api/auctions/:id` | auctionController.ts | `getAuctionById` | 44 |
| 3 | POST | `/api/auctions/:id/check-eligibility` | auctionController.ts | `checkEligibility` | 82 |
| 4 | POST | `/api/auctions/:id/bid` | auctionController.ts | `placeBid` | 144 |
| 5 | GET | `/api/users/:userId/bids` | auctionController.ts | `getUserBids` | 270 |
| 6 | GET | `/api/auctions/:id/bids` | auctionController.ts | `getAuctionBids` | 293 |
| 7 | POST | `/api/material-requirements` | materialRequirementController.ts | `createMaterialRequirement` | 10 |
| 8 | GET | `/api/material-requirements` | materialRequirementController.ts | `getAllMaterialRequirements` | 82 |
| 9 | GET | `/api/material-requirements/:id` | materialRequirementController.ts | `getMaterialRequirementById` | 109 |
| 10 | PUT | `/api/material-requirements/:id` | materialRequirementController.ts | `updateMaterialRequirement` | 133 |
| 11 | DELETE | `/api/material-requirements/:id` | materialRequirementController.ts | `deleteMaterialRequirement` | 165 |
| 12 | GET | `/api/material-requirements/:id/matches` | materialRequirementController.ts | `getMatchingAuctions` | 193 |
| 13 | GET | `/api/companies/:companyId/notifications` | materialRequirementController.ts | `getCompanyNotifications` | 223 |
| 14 | PUT | `/api/notifications/:id/read` | materialRequirementController.ts | `markNotificationAsRead` | 251 |

---

## 💡 Key Concepts

### What is a Controller?
A **controller** is a file that contains the logic for handling API requests. Each function in a controller:
- Receives the request (URL, body data, parameters)
- Processes it (validates, queries database)
- Sends back a response (JSON data)

### What is a Route?
A **route** connects a URL pattern to a controller function.
```typescript
router.get('/auctions', getAllAuctions);
//         ↑ URL       ↑ Function to call
```

### How to Add a New API?

1. **Create function in controller:**
   ```typescript
   // src/controllers/auctionController.ts
   export const myNewFunction = async (req: Request, res: Response) => {
     // Your logic here
   }
   ```

2. **Add route:**
   ```typescript
   // src/routes/auctionRoutes.ts
   import { myNewFunction } from '../controllers/auctionController';
   router.get('/my-new-endpoint', myNewFunction);
   ```

3. **Test:**
   ```
   GET http://localhost:1213/api/my-new-endpoint
   ```

---

## 🔍 How to Find Specific Code

### Want to see how GET All Auctions works?
```
1. Open: src/controllers/auctionController.ts
2. Go to: Line 10
3. Function: getAllAuctions
```

### Want to modify Place Bid logic?
```
1. Open: src/controllers/auctionController.ts
2. Go to: Line 144
3. Function: placeBid
```

### Want to change notification behavior?
```
1. Open: src/controllers/materialRequirementController.ts
2. Go to: Line 251
3. Function: markNotificationAsRead
```

---

## 📝 Summary

**All API logic is in 2 files:**
1. ✅ `src/controllers/auctionController.ts` (6 auction APIs)
2. ✅ `src/controllers/materialRequirementController.ts` (8 material requirement APIs)

**Routes connect URLs to functions:**
1. ✅ `src/routes/auctionRoutes.ts`
2. ✅ `src/routes/materialRequirementRoutes.ts`

**Main server file:**
1. ✅ `src/server.ts` (registers routes)

---

**Now you know where everything is! 🎉**
