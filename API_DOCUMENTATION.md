# Waste Management System - REST API Documentation
**Student ID:** 22201213  
**Module:** Module 2 - Credit, Auctions, & Marketplace  
**Server Port:** 1213  
**Base URL:** `http://localhost:1213/api`

---

## Table of Contents
1. [Module 2 - Member 2: Auction Participation APIs](#module-2---member-2-auction-participation-apis)
2. [Module 2 - Member 3: Material Requirements APIs](#module-2---member-3-material-requirements-apis)
3. [Setup Instructions](#setup-instructions)
4. [Database Models](#database-models)

---

## Module 2 - Member 2: Auction Participation APIs

### 1. Get All Auctions
**Endpoint:** `GET /api/auctions`  
**Description:** Retrieve all available auctions with optional filters  
**HTTP Method:** GET  
**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Query Parameters (Optional):**
- `status` - Filter by auction status (scheduled, live, completed, cancelled)
- `materialType` - Filter by material type (plastic, glass, etc.)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter

**Request Example:**
```
GET http://localhost:1213/api/auctions?status=live&materialType=plastic
```

**Code Snippet:**
```typescript
export const getAllAuctions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, materialType, minPrice, maxPrice } = req.query;
    
    let filter: any = {};
    
    if (status) filter.status = status;
    if (materialType) filter.materialType = materialType;
    if (minPrice || maxPrice) {
      filter.currentBid = {};
      if (minPrice) filter.currentBid.$gte = Number(minPrice);
      if (maxPrice) filter.currentBid.$lte = Number(maxPrice);
    }
    
    const auctions = await Auction.find(filter)
      .populate('createdBy', 'name email role')
      .populate('winnerId', 'name email')
      .sort({ startTime: -1 });
    
    res.status(200).json({
      success: true,
      count: auctions.length,
      data: auctions
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching auctions',
      error: error.message
    });
  }
};
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "64a1b2c3d4e5f6789012345",
      "title": "Recycled Plastic Bottles Auction",
      "description": "High quality PET plastic bottles",
      "materialType": "plastic",
      "quantity": 500,
      "unit": "kg",
      "startingBid": 1000,
      "currentBid": 1500,
      "minimumCreditRequired": 100,
      "minimumCashRequired": 500,
      "startTime": "2025-11-20T10:00:00.000Z",
      "endTime": "2025-11-20T18:00:00.000Z",
      "status": "live",
      "location": "Dhaka Hub",
      "createdBy": {
        "_id": "64a1b2c3d4e5f678901234a",
        "name": "Admin User",
        "email": "admin@waste.com",
        "role": "admin"
      },
      "createdAt": "2025-11-15T09:30:00.000Z"
    }
  ]
}
```

---

### 2. Get Single Auction by ID
**Endpoint:** `GET /api/auctions/:id`  
**Description:** Get detailed information about a specific auction including all bids  
**HTTP Method:** GET  
**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**URL Parameters:**
- `id` - Auction ID (MongoDB ObjectId)

**Request Example:**
```
GET http://localhost:1213/api/auctions/64a1b2c3d4e5f6789012345
```

**Code Snippet:**
```typescript
export const getAuctionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const auction = await Auction.findById(id)
      .populate('createdBy', 'name email role')
      .populate('winnerId', 'name email');
    
    if (!auction) {
      res.status(404).json({
        success: false,
        message: 'Auction not found'
      });
      return;
    }
    
    const bids = await Bid.find({ auctionId: id })
      .populate('bidderId', 'name email role')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: {
        auction,
        bids,
        totalBids: bids.length
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching auction',
      error: error.message
    });
  }
};
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "auction": {
      "_id": "64a1b2c3d4e5f6789012345",
      "title": "Recycled Plastic Bottles Auction",
      "materialType": "plastic",
      "currentBid": 1500,
      "status": "live"
    },
    "bids": [
      {
        "_id": "64a1b2c3d4e5f678901234b",
        "auctionId": "64a1b2c3d4e5f6789012345",
        "bidderId": {
          "_id": "64a1b2c3d4e5f678901234c",
          "name": "Company ABC",
          "email": "company@abc.com",
          "role": "company"
        },
        "bidAmount": 1500,
        "bidType": "cash",
        "status": "active",
        "createdAt": "2025-11-17T14:30:00.000Z"
      }
    ],
    "totalBids": 1
  }
}
```

---

### 3. Check Auction Eligibility
**Endpoint:** `POST /api/auctions/:id/check-eligibility`  
**Description:** Check if a user/company meets eligibility requirements to participate in an auction  
**HTTP Method:** POST  
**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**URL Parameters:**
- `id` - Auction ID

**Body Parameters:**
```json
{
  "userId": "64a1b2c3d4e5f678901234c"
}
```

**Request Example:**
```
POST http://localhost:1213/api/auctions/64a1b2c3d4e5f6789012345/check-eligibility
Content-Type: application/json

{
  "userId": "64a1b2c3d4e5f678901234c"
}
```

**Code Snippet:**
```typescript
export const checkEligibility = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'userId is required'
      });
      return;
    }
    
    const auction = await Auction.findById(id);
    if (!auction) {
      res.status(404).json({
        success: false,
        message: 'Auction not found'
      });
      return;
    }
    
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }
    
    const isEligible = 
      user.creditBalance >= auction.minimumCreditRequired &&
      user.cashBalance >= auction.minimumCashRequired;
    
    const reasons: string[] = [];
    if (user.creditBalance < auction.minimumCreditRequired) {
      reasons.push(`Insufficient credits. Required: ${auction.minimumCreditRequired}, Current: ${user.creditBalance}`);
    }
    if (user.cashBalance < auction.minimumCashRequired) {
      reasons.push(`Insufficient cash. Required: ${auction.minimumCashRequired}, Current: ${user.cashBalance}`);
    }
    
    res.status(200).json({
      success: true,
      data: {
        eligible: isEligible,
        user: {
          id: user._id,
          name: user.name,
          creditBalance: user.creditBalance,
          cashBalance: user.cashBalance
        },
        requirements: {
          minimumCredit: auction.minimumCreditRequired,
          minimumCash: auction.minimumCashRequired
        },
        reasons: isEligible ? [] : reasons
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error checking eligibility',
      error: error.message
    });
  }
};
```

**Response (200 OK - Eligible):**
```json
{
  "success": true,
  "data": {
    "eligible": true,
    "user": {
      "id": "64a1b2c3d4e5f678901234c",
      "name": "Company ABC",
      "creditBalance": 500,
      "cashBalance": 10000
    },
    "requirements": {
      "minimumCredit": 100,
      "minimumCash": 500
    },
    "reasons": []
  }
}
```

**Response (200 OK - Not Eligible):**
```json
{
  "success": true,
  "data": {
    "eligible": false,
    "user": {
      "id": "64a1b2c3d4e5f678901234c",
      "name": "User XYZ",
      "creditBalance": 50,
      "cashBalance": 200
    },
    "requirements": {
      "minimumCredit": 100,
      "minimumCash": 500
    },
    "reasons": [
      "Insufficient credits. Required: 100, Current: 50",
      "Insufficient cash. Required: 500, Current: 200"
    ]
  }
}
```

---

### 4. Place a Bid
**Endpoint:** `POST /api/auctions/:id/bid`  
**Description:** Place a bid on a live auction  
**HTTP Method:** POST  
**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**URL Parameters:**
- `id` - Auction ID

**Body Parameters:**
```json
{
  "bidderId": "64a1b2c3d4e5f678901234c",
  "bidAmount": 2000,
  "bidType": "cash"
}
```

**Parameters:**
- `bidderId` (required) - User/Company ID placing the bid
- `bidAmount` (required) - Bid amount (must be higher than current bid)
- `bidType` (required) - "credit" or "cash"

**Request Example:**
```
POST http://localhost:1213/api/auctions/64a1b2c3d4e5f6789012345/bid
Content-Type: application/json

{
  "bidderId": "64a1b2c3d4e5f678901234c",
  "bidAmount": 2000,
  "bidType": "cash"
}
```

**Code Snippet:**
```typescript
export const placeBid = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { bidderId, bidAmount, bidType } = req.body;
    
    // Validation
    if (!bidderId || !bidAmount || !bidType) {
      res.status(400).json({
        success: false,
        message: 'bidderId, bidAmount, and bidType are required'
      });
      return;
    }
    
    if (!['credit', 'cash'].includes(bidType)) {
      res.status(400).json({
        success: false,
        message: 'bidType must be either "credit" or "cash"'
      });
      return;
    }
    
    const auction = await Auction.findById(id);
    if (!auction) {
      res.status(404).json({
        success: false,
        message: 'Auction not found'
      });
      return;
    }
    
    // Check auction status
    if (auction.status !== 'live') {
      res.status(400).json({
        success: false,
        message: `Auction is not live. Current status: ${auction.status}`
      });
      return;
    }
    
    const user = await User.findById(bidderId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }
    
    // Check eligibility
    if (user.creditBalance < auction.minimumCreditRequired ||
        user.cashBalance < auction.minimumCashRequired) {
      res.status(403).json({
        success: false,
        message: 'User does not meet minimum eligibility requirements'
      });
      return;
    }
    
    // Check bid amount
    if (bidAmount <= auction.currentBid) {
      res.status(400).json({
        success: false,
        message: `Bid amount must be higher than current bid of ${auction.currentBid}`
      });
      return;
    }
    
    // Check user balance
    if (bidType === 'credit' && user.creditBalance < bidAmount) {
      res.status(400).json({
        success: false,
        message: 'Insufficient credit balance'
      });
      return;
    }
    
    if (bidType === 'cash' && user.cashBalance < bidAmount) {
      res.status(400).json({
        success: false,
        message: 'Insufficient cash balance'
      });
      return;
    }
    
    // Mark previous bids as outbid
    await Bid.updateMany(
      { auctionId: id, status: 'active' },
      { status: 'outbid' }
    );
    
    // Create new bid
    const newBid = new Bid({
      auctionId: id,
      bidderId,
      bidAmount,
      bidType,
      status: 'active'
    });
    
    await newBid.save();
    
    // Update auction current bid
    auction.currentBid = bidAmount;
    await auction.save();
    
    // Populate bid details
    const populatedBid = await Bid.findById(newBid._id)
      .populate('bidderId', 'name email role')
      .populate('auctionId', 'title materialType');
    
    res.status(201).json({
      success: true,
      message: 'Bid placed successfully',
      data: populatedBid
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error placing bid',
      error: error.message
    });
  }
};
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Bid placed successfully",
  "data": {
    "_id": "64a1b2c3d4e5f678901234d",
    "auctionId": {
      "_id": "64a1b2c3d4e5f6789012345",
      "title": "Recycled Plastic Bottles Auction",
      "materialType": "plastic"
    },
    "bidderId": {
      "_id": "64a1b2c3d4e5f678901234c",
      "name": "Company ABC",
      "email": "company@abc.com",
      "role": "company"
    },
    "bidAmount": 2000,
    "bidType": "cash",
    "status": "active",
    "createdAt": "2025-11-17T15:00:00.000Z"
  }
}
```

---

### 5. Get User Bid History
**Endpoint:** `GET /api/users/:userId/bids`  
**Description:** Get all bids placed by a specific user  
**HTTP Method:** GET  
**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**URL Parameters:**
- `userId` - User/Company ID

**Query Parameters (Optional):**
- `status` - Filter by bid status (active, outbid, won, lost)

**Request Example:**
```
GET http://localhost:1213/api/users/64a1b2c3d4e5f678901234c/bids?status=active
```

**Code Snippet:**
```typescript
export const getUserBids = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { status } = req.query;
    
    let filter: any = { bidderId: userId };
    if (status) filter.status = status;
    
    const bids = await Bid.find(filter)
      .populate('auctionId', 'title materialType quantity currentBid status endTime')
      .populate('bidderId', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: bids.length,
      data: bids
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user bids',
      error: error.message
    });
  }
};
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "64a1b2c3d4e5f678901234d",
      "auctionId": {
        "_id": "64a1b2c3d4e5f6789012345",
        "title": "Recycled Plastic Bottles Auction",
        "materialType": "plastic",
        "quantity": 500,
        "currentBid": 2000,
        "status": "live",
        "endTime": "2025-11-20T18:00:00.000Z"
      },
      "bidderId": {
        "_id": "64a1b2c3d4e5f678901234c",
        "name": "Company ABC",
        "email": "company@abc.com"
      },
      "bidAmount": 2000,
      "bidType": "cash",
      "status": "active",
      "createdAt": "2025-11-17T15:00:00.000Z"
    }
  ]
}
```

---

### 6. Get All Bids for an Auction
**Endpoint:** `GET /api/auctions/:id/bids`  
**Description:** Get all bids placed on a specific auction  
**HTTP Method:** GET  
**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**URL Parameters:**
- `id` - Auction ID

**Request Example:**
```
GET http://localhost:1213/api/auctions/64a1b2c3d4e5f6789012345/bids
```

**Code Snippet:**
```typescript
export const getAuctionBids = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const auction = await Auction.findById(id);
    if (!auction) {
      res.status(404).json({
        success: false,
        message: 'Auction not found'
      });
      return;
    }
    
    const bids = await Bid.find({ auctionId: id })
      .populate('bidderId', 'name email role')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      auction: {
        id: auction._id,
        title: auction.title,
        currentBid: auction.currentBid,
        status: auction.status
      },
      count: bids.length,
      data: bids
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching auction bids',
      error: error.message
    });
  }
};
```

**Response (200 OK):**
```json
{
  "success": true,
  "auction": {
    "id": "64a1b2c3d4e5f6789012345",
    "title": "Recycled Plastic Bottles Auction",
    "currentBid": 2000,
    "status": "live"
  },
  "count": 2,
  "data": [
    {
      "_id": "64a1b2c3d4e5f678901234d",
      "auctionId": "64a1b2c3d4e5f6789012345",
      "bidderId": {
        "_id": "64a1b2c3d4e5f678901234c",
        "name": "Company ABC",
        "email": "company@abc.com",
        "role": "company"
      },
      "bidAmount": 2000,
      "bidType": "cash",
      "status": "active",
      "createdAt": "2025-11-17T15:00:00.000Z"
    }
  ]
}
```

---

## Module 2 - Member 3: Material Requirements APIs

### 7. Create Material Requirement
**Endpoint:** `POST /api/material-requirements`  
**Description:** Create a new material requirement (companies only)  
**HTTP Method:** POST  
**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body Parameters:**
```json
{
  "companyId": "64a1b2c3d4e5f678901234c",
  "materialType": "plastic",
  "quantity": 1000,
  "unit": "kg",
  "description": "Need high-quality PET plastic for manufacturing",
  "maxPrice": 5000,
  "urgency": "high",
  "preferredLocations": ["Dhaka", "Chittagong"],
  "notificationPreferences": {
    "auctionMatch": true,
    "inventoryMatch": true,
    "priceAlert": true
  }
}
```

**Parameters:**
- `companyId` (required) - Company user ID
- `materialType` (required) - Type of material needed
- `quantity` (required) - Quantity needed
- `unit` (required) - Unit of measurement (kg, ton, etc.)
- `description` (required) - Detailed description
- `maxPrice` (required) - Maximum price willing to pay
- `urgency` (optional) - "low", "medium", "high" (default: "medium")
- `preferredLocations` (optional) - Array of preferred locations
- `notificationPreferences` (optional) - Notification settings

**Request Example:**
```
POST http://localhost:1213/api/material-requirements
Content-Type: application/json

{
  "companyId": "64a1b2c3d4e5f678901234c",
  "materialType": "plastic",
  "quantity": 1000,
  "unit": "kg",
  "description": "Need high-quality PET plastic for manufacturing",
  "maxPrice": 5000,
  "urgency": "high",
  "preferredLocations": ["Dhaka", "Chittagong"]
}
```

**Code Snippet:**
```typescript
export const createMaterialRequirement = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      companyId,
      materialType,
      quantity,
      unit,
      description,
      maxPrice,
      urgency,
      preferredLocations,
      notificationPreferences
    } = req.body;
    
    // Validation
    if (!companyId || !materialType || !quantity || !unit || !description || !maxPrice) {
      res.status(400).json({
        success: false,
        message: 'companyId, materialType, quantity, unit, description, and maxPrice are required'
      });
      return;
    }
    
    // Verify user is a company
    const company = await User.findById(companyId);
    if (!company) {
      res.status(404).json({
        success: false,
        message: 'Company not found'
      });
      return;
    }
    
    if (company.role !== 'company') {
      res.status(403).json({
        success: false,
        message: 'Only companies can create material requirements'
      });
      return;
    }
    
    // Create material requirement
    const materialRequirement = new MaterialRequirement({
      companyId,
      materialType,
      quantity,
      unit,
      description,
      maxPrice,
      urgency: urgency || 'medium',
      preferredLocations: preferredLocations || [],
      notificationPreferences: notificationPreferences || {
        auctionMatch: true,
        inventoryMatch: true,
        priceAlert: true
      }
    });
    
    await materialRequirement.save();
    
    // Check for matching auctions
    await checkMatchingAuctions(materialRequirement._id.toString());
    
    const populatedRequirement = await MaterialRequirement.findById(materialRequirement._id)
      .populate('companyId', 'name email');
    
    res.status(201).json({
      success: true,
      message: 'Material requirement created successfully',
      data: populatedRequirement
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error creating material requirement',
      error: error.message
    });
  }
};
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Material requirement created successfully",
  "data": {
    "_id": "64a1b2c3d4e5f678901234e",
    "companyId": {
      "_id": "64a1b2c3d4e5f678901234c",
      "name": "Company ABC",
      "email": "company@abc.com"
    },
    "materialType": "plastic",
    "quantity": 1000,
    "unit": "kg",
    "description": "Need high-quality PET plastic for manufacturing",
    "maxPrice": 5000,
    "urgency": "high",
    "status": "active",
    "preferredLocations": ["Dhaka", "Chittagong"],
    "notificationPreferences": {
      "auctionMatch": true,
      "inventoryMatch": true,
      "priceAlert": true
    },
    "createdAt": "2025-11-17T15:30:00.000Z",
    "updatedAt": "2025-11-17T15:30:00.000Z"
  }
}
```

---

### 8. Get All Material Requirements
**Endpoint:** `GET /api/material-requirements`  
**Description:** Get all material requirements with optional filters  
**HTTP Method:** GET  
**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Query Parameters (Optional):**
- `status` - Filter by status (active, fulfilled, cancelled)
- `materialType` - Filter by material type
- `urgency` - Filter by urgency (low, medium, high)
- `companyId` - Filter by company ID

**Request Example:**
```
GET http://localhost:1213/api/material-requirements?status=active&materialType=plastic
```

**Code Snippet:**
```typescript
export const getAllMaterialRequirements = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, materialType, urgency, companyId } = req.query;
    
    let filter: any = {};
    
    if (status) filter.status = status;
    if (materialType) filter.materialType = materialType;
    if (urgency) filter.urgency = urgency;
    if (companyId) filter.companyId = companyId;
    
    const requirements = await MaterialRequirement.find(filter)
      .populate('companyId', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: requirements.length,
      data: requirements
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching material requirements',
      error: error.message
    });
  }
};
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "64a1b2c3d4e5f678901234e",
      "companyId": {
        "_id": "64a1b2c3d4e5f678901234c",
        "name": "Company ABC",
        "email": "company@abc.com"
      },
      "materialType": "plastic",
      "quantity": 1000,
      "unit": "kg",
      "description": "Need high-quality PET plastic for manufacturing",
      "maxPrice": 5000,
      "urgency": "high",
      "status": "active",
      "preferredLocations": ["Dhaka", "Chittagong"],
      "createdAt": "2025-11-17T15:30:00.000Z"
    }
  ]
}
```

---

### 9. Get Single Material Requirement
**Endpoint:** `GET /api/material-requirements/:id`  
**Description:** Get detailed information about a specific material requirement  
**HTTP Method:** GET  
**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**URL Parameters:**
- `id` - Material Requirement ID

**Request Example:**
```
GET http://localhost:1213/api/material-requirements/64a1b2c3d4e5f678901234e
```

**Code Snippet:**
```typescript
export const getMaterialRequirementById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const requirement = await MaterialRequirement.findById(id)
      .populate('companyId', 'name email');
    
    if (!requirement) {
      res.status(404).json({
        success: false,
        message: 'Material requirement not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: requirement
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching material requirement',
      error: error.message
    });
  }
};
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f678901234e",
    "companyId": {
      "_id": "64a1b2c3d4e5f678901234c",
      "name": "Company ABC",
      "email": "company@abc.com"
    },
    "materialType": "plastic",
    "quantity": 1000,
    "unit": "kg",
    "description": "Need high-quality PET plastic for manufacturing",
    "maxPrice": 5000,
    "urgency": "high",
    "status": "active",
    "preferredLocations": ["Dhaka", "Chittagong"],
    "notificationPreferences": {
      "auctionMatch": true,
      "inventoryMatch": true,
      "priceAlert": true
    },
    "createdAt": "2025-11-17T15:30:00.000Z",
    "updatedAt": "2025-11-17T15:30:00.000Z"
  }
}
```

---

### 10. Update Material Requirement
**Endpoint:** `PUT /api/material-requirements/:id`  
**Description:** Update an existing material requirement  
**HTTP Method:** PUT  
**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**URL Parameters:**
- `id` - Material Requirement ID

**Body Parameters (all optional):**
```json
{
  "quantity": 1500,
  "maxPrice": 6000,
  "urgency": "medium",
  "status": "active"
}
```

**Request Example:**
```
PUT http://localhost:1213/api/material-requirements/64a1b2c3d4e5f678901234e
Content-Type: application/json

{
  "quantity": 1500,
  "maxPrice": 6000,
  "urgency": "medium"
}
```

**Code Snippet:**
```typescript
export const updateMaterialRequirement = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const requirement = await MaterialRequirement.findById(id);
    if (!requirement) {
      res.status(404).json({
        success: false,
        message: 'Material requirement not found'
      });
      return;
    }
    
    // Update fields
    updateData.updatedAt = new Date();
    
    const updatedRequirement = await MaterialRequirement.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('companyId', 'name email');
    
    res.status(200).json({
      success: true,
      message: 'Material requirement updated successfully',
      data: updatedRequirement
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating material requirement',
      error: error.message
    });
  }
};
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Material requirement updated successfully",
  "data": {
    "_id": "64a1b2c3d4e5f678901234e",
    "companyId": {
      "_id": "64a1b2c3d4e5f678901234c",
      "name": "Company ABC",
      "email": "company@abc.com"
    },
    "materialType": "plastic",
    "quantity": 1500,
    "unit": "kg",
    "description": "Need high-quality PET plastic for manufacturing",
    "maxPrice": 6000,
    "urgency": "medium",
    "status": "active",
    "updatedAt": "2025-11-17T16:00:00.000Z"
  }
}
```

---

### 11. Cancel Material Requirement
**Endpoint:** `DELETE /api/material-requirements/:id`  
**Description:** Cancel a material requirement (sets status to 'cancelled')  
**HTTP Method:** DELETE  
**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**URL Parameters:**
- `id` - Material Requirement ID

**Request Example:**
```
DELETE http://localhost:1213/api/material-requirements/64a1b2c3d4e5f678901234e
```

**Code Snippet:**
```typescript
export const deleteMaterialRequirement = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const requirement = await MaterialRequirement.findById(id);
    if (!requirement) {
      res.status(404).json({
        success: false,
        message: 'Material requirement not found'
      });
      return;
    }
    
    requirement.status = 'cancelled';
    requirement.updatedAt = new Date();
    await requirement.save();
    
    res.status(200).json({
      success: true,
      message: 'Material requirement cancelled successfully',
      data: requirement
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting material requirement',
      error: error.message
    });
  }
};
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Material requirement cancelled successfully",
  "data": {
    "_id": "64a1b2c3d4e5f678901234e",
    "status": "cancelled",
    "updatedAt": "2025-11-17T16:15:00.000Z"
  }
}
```

---

### 12. Find Matching Auctions
**Endpoint:** `GET /api/material-requirements/:id/matches`  
**Description:** Find auctions that match a material requirement  
**HTTP Method:** GET  
**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**URL Parameters:**
- `id` - Material Requirement ID

**Request Example:**
```
GET http://localhost:1213/api/material-requirements/64a1b2c3d4e5f678901234e/matches
```

**Code Snippet:**
```typescript
export const getMatchingAuctions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const requirement = await MaterialRequirement.findById(id);
    if (!requirement) {
      res.status(404).json({
        success: false,
        message: 'Material requirement not found'
      });
      return;
    }
    
    // Find matching auctions
    const matchingAuctions = await Auction.find({
      materialType: requirement.materialType,
      status: { $in: ['scheduled', 'live'] },
      currentBid: { $lte: requirement.maxPrice }
    }).populate('createdBy', 'name email');
    
    res.status(200).json({
      success: true,
      requirement: {
        id: requirement._id,
        materialType: requirement.materialType,
        quantity: requirement.quantity,
        maxPrice: requirement.maxPrice
      },
      matchCount: matchingAuctions.length,
      data: matchingAuctions
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error finding matching auctions',
      error: error.message
    });
  }
};
```

**Response (200 OK):**
```json
{
  "success": true,
  "requirement": {
    "id": "64a1b2c3d4e5f678901234e",
    "materialType": "plastic",
    "quantity": 1000,
    "maxPrice": 5000
  },
  "matchCount": 2,
  "data": [
    {
      "_id": "64a1b2c3d4e5f6789012345",
      "title": "Recycled Plastic Bottles Auction",
      "materialType": "plastic",
      "quantity": 500,
      "currentBid": 1500,
      "status": "live",
      "createdBy": {
        "_id": "64a1b2c3d4e5f678901234a",
        "name": "Admin User",
        "email": "admin@waste.com"
      }
    }
  ]
}
```

---

### 13. Get Company Notifications
**Endpoint:** `GET /api/companies/:companyId/notifications`  
**Description:** Get all notifications for a company regarding material requirements  
**HTTP Method:** GET  
**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**URL Parameters:**
- `companyId` - Company ID

**Query Parameters (Optional):**
- `isRead` - Filter by read status (true/false)
- `type` - Filter by notification type (auction_match, inventory_match, price_alert, etc.)

**Request Example:**
```
GET http://localhost:1213/api/companies/64a1b2c3d4e5f678901234c/notifications?isRead=false
```

**Code Snippet:**
```typescript
export const getCompanyNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { companyId } = req.params;
    const { isRead, type } = req.query;
    
    let filter: any = { recipientId: companyId };
    
    if (isRead !== undefined) {
      filter.isRead = isRead === 'true';
    }
    
    if (type) {
      filter.type = type;
    }
    
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
};
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "64a1b2c3d4e5f678901234f",
      "recipientId": "64a1b2c3d4e5f678901234c",
      "type": "auction_match",
      "title": "Matching Auctions Found",
      "message": "Found 2 auction(s) matching your requirement for plastic",
      "relatedId": "64a1b2c3d4e5f678901234e",
      "relatedType": "requirement",
      "isRead": false,
      "createdAt": "2025-11-17T15:30:00.000Z"
    }
  ]
}
```

---

### 14. Mark Notification as Read
**Endpoint:** `PUT /api/notifications/:id/read`  
**Description:** Mark a notification as read  
**HTTP Method:** PUT  
**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**URL Parameters:**
- `id` - Notification ID

**Request Example:**
```
PUT http://localhost:1213/api/notifications/64a1b2c3d4e5f678901234f/read
```

**Code Snippet:**
```typescript
export const markNotificationAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating notification',
      error: error.message
    });
  }
};
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": {
    "_id": "64a1b2c3d4e5f678901234f",
    "recipientId": "64a1b2c3d4e5f678901234c",
    "type": "auction_match",
    "title": "Matching Auctions Found",
    "message": "Found 2 auction(s) matching your requirement for plastic",
    "isRead": true,
    "createdAt": "2025-11-17T15:30:00.000Z"
  }
}
```

---

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up MongoDB
Make sure MongoDB is running on your local machine or update the `.env` file with your MongoDB connection string.

### 3. Configure Environment Variables
Edit the `.env` file:
```
PORT=1213
MONGODB_URI=mongodb://localhost:27017/waste_management
NODE_ENV=development
```

### 4. Run the Server

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm run build
npm start
```

### 5. Test the Server
Visit: `http://localhost:1213/` to see the server is running.
Visit: `http://localhost:1213/api/docs` to see API documentation.

---

## Database Models

### User Model
```typescript
{
  name: String,
  email: String (unique),
  role: 'user' | 'admin' | 'company',
  creditBalance: Number,
  cashBalance: Number,
  createdAt: Date
}
```

### Auction Model
```typescript
{
  title: String,
  description: String,
  materialType: String,
  quantity: Number,
  unit: String,
  startingBid: Number,
  currentBid: Number,
  minimumCreditRequired: Number,
  minimumCashRequired: Number,
  startTime: Date,
  endTime: Date,
  status: 'scheduled' | 'live' | 'completed' | 'cancelled',
  winnerId: ObjectId (ref: User),
  location: String,
  createdBy: ObjectId (ref: User),
  createdAt: Date
}
```

### Bid Model
```typescript
{
  auctionId: ObjectId (ref: Auction),
  bidderId: ObjectId (ref: User),
  bidAmount: Number,
  bidType: 'credit' | 'cash',
  status: 'active' | 'outbid' | 'won' | 'lost',
  createdAt: Date
}
```

### Material Requirement Model
```typescript
{
  companyId: ObjectId (ref: User),
  materialType: String,
  quantity: Number,
  unit: String,
  description: String,
  maxPrice: Number,
  urgency: 'low' | 'medium' | 'high',
  status: 'active' | 'fulfilled' | 'cancelled',
  preferredLocations: [String],
  notificationPreferences: {
    auctionMatch: Boolean,
    inventoryMatch: Boolean,
    priceAlert: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Model
```typescript
{
  recipientId: ObjectId (ref: User),
  type: 'auction_match' | 'inventory_match' | 'price_alert' | 'bid_update' | 'auction_won',
  title: String,
  message: String,
  relatedId: ObjectId,
  relatedType: 'auction' | 'requirement' | 'bid',
  isRead: Boolean,
  createdAt: Date
}
```

---

## Summary

**Total APIs Implemented: 14**

**Module 2 - Member 2 (Auction Participation): 6 APIs**
1. GET /api/auctions
2. GET /api/auctions/:id
3. POST /api/auctions/:id/check-eligibility
4. POST /api/auctions/:id/bid
5. GET /api/users/:userId/bids
6. GET /api/auctions/:id/bids

**Module 2 - Member 3 (Material Requirements): 8 APIs**
7. POST /api/material-requirements
8. GET /api/material-requirements
9. GET /api/material-requirements/:id
10. PUT /api/material-requirements/:id
11. DELETE /api/material-requirements/:id
12. GET /api/material-requirements/:id/matches
13. GET /api/companies/:companyId/notifications
14. PUT /api/notifications/:id/read

**Server Port:** 1213 (Last 4 digits of Student ID: 22201213)
