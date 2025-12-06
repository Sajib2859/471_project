# My API Documentation - Student Submission

**Student ID:** 22299371  
**Module:** Module 1 (Member 1) & Module 2 (Member 1)  
**Server Port:** 9371

---

## 📋 Overview

This document contains REST API endpoints for:
1. **Module 1 - Member 1:** Waste Hubs & Finding/Filtering
2. **Module 2 - Member 1:** Credit Management & Redemption

**Base URL:** `http://localhost:9371/api`

---

## Module 1 - Member 1: Waste Hubs

### API 1: Get All Waste Hubs

**Endpoint:** `GET /api/waste-hubs`

**Description:** Retrieve all waste disposal hubs with optional filters by waste type, city, and status.

**Query Parameters:**
- `wasteType` (optional): Filter by waste type (plastic, glass, paper, metal, organic, electronic, textile, hazardous)
- `city` (optional): Filter by city name (case-insensitive)
- `status` (optional): Filter by status (open, closed, maintenance)

**Request Example:**
```http
GET http://localhost:9371/api/waste-hubs?wasteType=plastic&city=Dhaka&status=open
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "000000000000000000000501",
      "name": "Dhaka Central Waste Hub",
      "location": {
        "address": "123 Green Road, Dhanmondi",
        "city": "Dhaka",
        "coordinates": {
          "latitude": 23.7461,
          "longitude": 90.3742
        }
      },
      "wasteTypes": ["plastic", "paper", "metal", "glass"],
      "status": "open",
      "operatingHours": {
        "open": "08:00",
        "close": "18:00"
      },
      "acceptedMaterials": [
        {
          "type": "plastic",
          "pricePerKg": 20
        },
        {
          "type": "paper",
          "pricePerKg": 10
        }
      ],
      "capacity": {
        "current": 5000,
        "maximum": 10000
      },
      "contactNumber": "+880-1711-111111",
      "createdAt": "2025-12-06T10:00:00.000Z",
      "updatedAt": "2025-12-06T10:00:00.000Z"
    }
  ]
}
```

**Code Snippet:**
```typescript
// src/controllers/wasteHubController.ts
export const getAllWasteHubs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { wasteType, city, status } = req.query;

    const filter: any = {};
    if (wasteType) filter.wasteTypes = wasteType;
    if (city) filter['location.city'] = { $regex: city, $options: 'i' };
    if (status) filter.status = status;

    const hubs = await WasteHub.find(filter).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: hubs.length,
      data: hubs
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching waste hubs',
      error: error.message
    });
  }
};
```

---

### API 2: Get Waste Hub by ID

**Endpoint:** `GET /api/waste-hubs/:id`

**Description:** Retrieve details of a specific waste hub by its ID.

**URL Parameters:**
- `id` (required): Waste hub ID

**Request Example:**
```http
GET http://localhost:9371/api/waste-hubs/000000000000000000000501
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "000000000000000000000501",
    "name": "Dhaka Central Waste Hub",
    "location": {
      "address": "123 Green Road, Dhanmondi",
      "city": "Dhaka",
      "coordinates": {
        "latitude": 23.7461,
        "longitude": 90.3742
      }
    },
    "wasteTypes": ["plastic", "paper", "metal", "glass"],
    "status": "open",
    "operatingHours": {
      "open": "08:00",
      "close": "18:00"
    },
    "acceptedMaterials": [
      {
        "type": "plastic",
        "pricePerKg": 20
      }
    ],
    "capacity": {
      "current": 5000,
      "maximum": 10000
    },
    "contactNumber": "+880-1711-111111"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Waste hub not found"
}
```

**Code Snippet:**
```typescript
export const getWasteHubById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const hub = await WasteHub.findById(id);

    if (!hub) {
      res.status(404).json({
        success: false,
        message: 'Waste hub not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: hub
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching waste hub',
      error: error.message
    });
  }
};
```

---

### API 3: Find Nearby Waste Hubs

**Endpoint:** `GET /api/waste-hubs/nearby`

**Description:** Find waste hubs near a specific location using coordinates.

**Query Parameters:**
- `latitude` (required): Latitude coordinate
- `longitude` (required): Longitude coordinate
- `maxDistance` (optional): Maximum distance in meters (default: 10000)
- `wasteType` (optional): Filter by waste type

**Request Example:**
```http
GET http://localhost:9371/api/waste-hubs/nearby?latitude=23.7461&longitude=90.3742&maxDistance=5000&wasteType=plastic
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "searchRadius": "5 km",
  "data": [
    {
      "_id": "000000000000000000000501",
      "name": "Dhaka Central Waste Hub",
      "location": {
        "address": "123 Green Road, Dhanmondi",
        "city": "Dhaka",
        "coordinates": {
          "latitude": 23.7461,
          "longitude": 90.3742
        }
      },
      "wasteTypes": ["plastic", "paper", "metal", "glass"],
      "status": "open"
    }
  ]
}
```

**Code Snippet:**
```typescript
export const getNearbyWasteHubs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { latitude, longitude, maxDistance = 10000, wasteType } = req.query;

    if (!latitude || !longitude) {
      res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
      return;
    }

    const lat = parseFloat(latitude as string);
    const lng = parseFloat(longitude as string);
    const distance = parseInt(maxDistance as string);

    const matchCriteria: any = {
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: distance
        }
      }
    };

    if (wasteType) matchCriteria.wasteTypes = wasteType;

    const hubs = await WasteHub.find(matchCriteria).limit(20);

    res.status(200).json({
      success: true,
      count: hubs.length,
      searchRadius: `${distance / 1000} km`,
      data: hubs
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error finding nearby waste hubs',
      error: error.message
    });
  }
};
```

---

### API 4: Filter Hubs by Waste Type

**Endpoint:** `GET /api/waste-hubs/filter-by-waste-type/:wasteType`

**Description:** Filter waste hubs by a specific waste type.

**URL Parameters:**
- `wasteType` (required): Type of waste (plastic, glass, paper, metal, etc.)

**Query Parameters:**
- `status` (optional): Filter by status
- `city` (optional): Filter by city

**Request Example:**
```http
GET http://localhost:9371/api/waste-hubs/filter-by-waste-type/plastic?status=open&city=Dhaka
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "success": true,
  "wasteType": "plastic",
  "count": 2,
  "data": [
    {
      "_id": "000000000000000000000501",
      "name": "Dhaka Central Waste Hub",
      "wasteTypes": ["plastic", "paper", "metal", "glass"],
      "status": "open"
    }
  ]
}
```

---

### API 5: Get Hubs by Status

**Endpoint:** `GET /api/waste-hubs/status/:status`

**Description:** Get all waste hubs filtered by their operational status.

**URL Parameters:**
- `status` (required): Status value (open, closed, maintenance)

**Request Example:**
```http
GET http://localhost:9371/api/waste-hubs/status/open
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "success": true,
  "status": "open",
  "count": 3,
  "data": [
    {
      "_id": "000000000000000000000501",
      "name": "Dhaka Central Waste Hub",
      "status": "open",
      "operatingHours": {
        "open": "08:00",
        "close": "18:00"
      }
    }
  ]
}
```

---

### API 6: Get Accepted Materials

**Endpoint:** `GET /api/waste-hubs/:id/accepted-materials`

**Description:** Get list of accepted materials and their pricing for a specific hub.

**URL Parameters:**
- `id` (required): Waste hub ID

**Request Example:**
```http
GET http://localhost:9371/api/waste-hubs/000000000000000000000501/accepted-materials
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "success": true,
  "hubName": "Dhaka Central Waste Hub",
  "acceptedMaterials": [
    {
      "type": "plastic",
      "pricePerKg": 20
    },
    {
      "type": "paper",
      "pricePerKg": 10
    },
    {
      "type": "metal",
      "pricePerKg": 50
    },
    {
      "type": "glass",
      "pricePerKg": 15
    }
  ]
}
```

---

## Module 2 - Member 1: Credit Management

### API 7: Get Credit Balance

**Endpoint:** `GET /api/users/:userId/credits/balance`

**Description:** View current credit and cash balance for a user.

**URL Parameters:**
- `userId` (required): User ID

**Request Example:**
```http
GET http://localhost:9371/api/users/000000000000000000000004/credits/balance
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": "000000000000000000000004",
    "name": "Regular User",
    "email": "user@test.com",
    "creditBalance": 500,
    "cashBalance": 10000
  }
}
```

**Code Snippet:**
```typescript
export const getCreditBalance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId, 'name email creditBalance cashBalance');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        creditBalance: user.creditBalance,
        cashBalance: user.cashBalance
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching credit balance',
      error: error.message
    });
  }
};
```

---

### API 8: Get Transaction History

**Endpoint:** `GET /api/users/:userId/credits/transactions`

**Description:** View credit transaction history with optional filters and pagination.

**URL Parameters:**
- `userId` (required): User ID

**Query Parameters:**
- `type` (optional): Transaction type (earned, spent, redeemed)
- `limit` (optional): Number of results per page (default: 50)
- `page` (optional): Page number (default: 1)

**Request Example:**
```http
GET http://localhost:9371/api/users/000000000000000000000004/credits/transactions?type=earned&limit=10&page=1
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "success": true,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "pages": 1
  },
  "summary": [
    {
      "_id": "earned",
      "total": 500,
      "count": 3
    }
  ],
  "data": [
    {
      "_id": "000000000000000000000603",
      "userId": "000000000000000000000004",
      "type": "earned",
      "amount": 250,
      "description": "Deposit validation reward - 25kg paper",
      "referenceType": "deposit",
      "balanceAfter": 500,
      "createdAt": "2025-11-10T11:00:00.000Z"
    },
    {
      "_id": "000000000000000000000602",
      "userId": "000000000000000000000004",
      "type": "earned",
      "amount": 150,
      "description": "Deposit validation reward - 15kg glass",
      "referenceType": "deposit",
      "balanceAfter": 250,
      "createdAt": "2025-11-05T14:00:00.000Z"
    }
  ]
}
```

**Code Snippet:**
```typescript
export const getTransactionHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { type, limit = '50', page = '1' } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    const filter: any = { userId };
    if (type) filter.type = type;

    const limitNum = parseInt(limit as string);
    const pageNum = parseInt(page as string);
    const skip = (pageNum - 1) * limitNum;

    const transactions = await CreditTransaction.find(filter)
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await CreditTransaction.countDocuments(filter);

    const stats = await CreditTransaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      },
      summary: stats,
      data: transactions
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching transaction history',
      error: error.message
    });
  }
};
```

---

### API 9: Redeem Credits for Cash

**Endpoint:** `POST /api/users/:userId/credits/redeem`

**Description:** Submit a request to redeem credits for cash.

**URL Parameters:**
- `userId` (required): User ID

**Request Body:**
```json
{
  "creditsToRedeem": 200,
  "paymentMethod": "bank_transfer",
  "paymentDetails": {
    "accountNumber": "1234567890",
    "accountName": "John Doe",
    "bankName": "Example Bank"
  }
}
```

**Request Example:**
```http
POST http://localhost:9371/api/users/000000000000000000000004/credits/redeem
Content-Type: application/json

{
  "creditsToRedeem": 200,
  "paymentMethod": "bank_transfer",
  "paymentDetails": {
    "accountNumber": "1234567890",
    "accountName": "Regular User",
    "bankName": "Example Bank"
  }
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Redemption request created successfully",
  "data": {
    "redemptionId": "67535f8c1234567890abcdef",
    "creditsRedeemed": 200,
    "cashAmount": 200,
    "status": "pending",
    "remainingBalance": 300
  }
}
```

**Error Response (400) - Insufficient Balance:**
```json
{
  "success": false,
  "message": "Insufficient credit balance",
  "currentBalance": 500,
  "requested": 600
}
```

**Code Snippet:**
```typescript
export const redeemCredits = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { creditsToRedeem, paymentMethod, paymentDetails } = req.body;

    if (!creditsToRedeem || creditsToRedeem <= 0) {
      res.status(400).json({
        success: false,
        message: 'Valid credit amount is required'
      });
      return;
    }

    if (!paymentMethod || !['bank_transfer', 'mobile_banking', 'cash'].includes(paymentMethod)) {
      res.status(400).json({
        success: false,
        message: 'Valid payment method is required'
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

    if (user.creditBalance < creditsToRedeem) {
      res.status(400).json({
        success: false,
        message: 'Insufficient credit balance',
        currentBalance: user.creditBalance,
        requested: creditsToRedeem
      });
      return;
    }

    const conversionRate = 1;
    const cashAmount = creditsToRedeem * conversionRate;

    const redemption = await CreditRedemption.create({
      userId,
      creditsRedeemed: creditsToRedeem,
      cashAmount,
      conversionRate,
      paymentMethod,
      paymentDetails,
      status: 'pending'
    });

    user.creditBalance -= creditsToRedeem;
    await user.save();

    await CreditTransaction.create({
      userId,
      type: 'redeemed',
      amount: -creditsToRedeem,
      description: `Credit redemption request #${redemption._id}`,
      referenceId: redemption._id,
      referenceType: 'redemption',
      balanceAfter: user.creditBalance
    });

    res.status(201).json({
      success: true,
      message: 'Redemption request created successfully',
      data: {
        redemptionId: redemption._id,
        creditsRedeemed: creditsToRedeem,
        cashAmount,
        status: redemption.status,
        remainingBalance: user.creditBalance
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error processing redemption',
      error: error.message
    });
  }
};
```

---

### API 10: Get Redemption History

**Endpoint:** `GET /api/users/:userId/credits/redemptions`

**Description:** View all credit redemption requests for a user.

**URL Parameters:**
- `userId` (required): User ID

**Query Parameters:**
- `status` (optional): Filter by status (pending, processing, completed, rejected)

**Request Example:**
```http
GET http://localhost:9371/api/users/000000000000000000000004/credits/redemptions?status=pending
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "67535f8c1234567890abcdef",
      "userId": "000000000000000000000004",
      "creditsRedeemed": 200,
      "cashAmount": 200,
      "conversionRate": 1,
      "status": "pending",
      "paymentMethod": "bank_transfer",
      "paymentDetails": {
        "accountNumber": "1234567890",
        "accountName": "Regular User",
        "bankName": "Example Bank"
      },
      "createdAt": "2025-12-06T10:30:00.000Z",
      "updatedAt": "2025-12-06T10:30:00.000Z"
    }
  ]
}
```

---

### API 11: Get Redemption by ID

**Endpoint:** `GET /api/users/:userId/credits/redemptions/:redemptionId`

**Description:** Get details of a specific redemption request.

**URL Parameters:**
- `userId` (required): User ID
- `redemptionId` (required): Redemption request ID

**Request Example:**
```http
GET http://localhost:9371/api/users/000000000000000000000004/credits/redemptions/000000000000000000000701
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "000000000000000000000701",
    "userId": "000000000000000000000004",
    "creditsRedeemed": 0,
    "cashAmount": 0,
    "conversionRate": 1,
    "status": "completed",
    "paymentMethod": "bank_transfer",
    "paymentDetails": {
      "accountNumber": "1234567890",
      "accountName": "Regular User",
      "bankName": "Example Bank"
    },
    "processedBy": {
      "_id": "000000000000000000000001",
      "name": "Admin User",
      "email": "admin@waste.com"
    },
    "processedAt": "2025-10-28T16:00:00.000Z",
    "createdAt": "2025-10-25T10:00:00.000Z",
    "updatedAt": "2025-10-28T16:00:00.000Z"
  }
}
```

---

### API 12: Get Credit Summary (Analytics)

**Endpoint:** `GET /api/credits/summary`

**Description:** Get overall credit statistics across the platform (for admin/analytics).

**Request Example:**
```http
GET http://localhost:9371/api/credits/summary
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalUsers": 5,
    "totalCreditsInSystem": 3800,
    "transactionStats": [
      {
        "_id": "earned",
        "total": 3500,
        "count": 7
      }
    ],
    "redemptionStats": [
      {
        "_id": "completed",
        "totalCredits": 0,
        "totalCash": 0,
        "count": 1
      },
      {
        "_id": "pending",
        "totalCredits": 0,
        "totalCash": 0,
        "count": 1
      }
    ]
  }
}
```

---

## Test IDs Reference

Use these IDs for testing your APIs:

### Users
- Admin: `000000000000000000000001`
- Company ABC: `000000000000000000000002`
- Green Industries: `000000000000000000000003`
- Regular User: `000000000000000000000004`
- John Doe: `000000000000000000000005`

### Waste Hubs
- Dhaka Hub: `000000000000000000000501`
- Chittagong Hub: `000000000000000000000502`
- Sylhet Hub: `000000000000000000000503`
- Mirpur Hub: `000000000000000000000504`
- Uttara Hub: `000000000000000000000505`

---

## Summary

**Total APIs Implemented:** 12

**Module 1 - Member 1 (6 APIs):**
1. Get All Waste Hubs (with filters)
2. Get Waste Hub by ID
3. Find Nearby Waste Hubs
4. Filter Hubs by Waste Type
5. Get Hubs by Status
6. Get Accepted Materials

**Module 2 - Member 1 (6 APIs):**
7. Get Credit Balance
8. Get Transaction History
9. Redeem Credits for Cash
10. Get Redemption History
11. Get Redemption by ID
12. Get Credit Summary

---

**Date:** December 6, 2025
