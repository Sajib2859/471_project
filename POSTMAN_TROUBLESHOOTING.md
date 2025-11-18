# 🔧 Postman Troubleshooting Guide

## ❌ Problem: "Why do I keep getting ALL data when I put specific data in Body?"

### **Answer: You're probably using a GET request!**

**GET requests IGNORE the body!** They only read data from the URL.

---

## 📚 Understanding HTTP Methods

### 🟢 GET Requests (Read Data)
- **Purpose:** Retrieve/read data
- **Body:** ❌ NOT USED - Postman will ignore it!
- **Data location:** URL parameters
- **Example:**
  ```
  GET /api/auctions/000000000000000000000101
  ```
  - ID goes in URL, NOT in body
  - Returns: Single auction with ID 101

### 🔵 POST Requests (Create Data)
- **Purpose:** Create new resources
- **Body:** ✅ YES - Required!
- **Data location:** Request body (JSON)
- **Example:**
  ```
  POST /api/auctions/101/bid
  Body: {
    "bidderId": "000000000000000000000002",
    "bidAmount": 1500,
    "bidType": "cash"
  }
  ```

### 🟡 PUT Requests (Update Data)
- **Purpose:** Update existing resources
- **Body:** ✅ YES - Required!
- **Data location:** ID in URL + data in body
- **Example:**
  ```
  PUT /api/material-requirements/301
  Body: {
    "quantity": 1500,
    "maxPrice": 6000
  }
  ```

### 🔴 DELETE Requests (Remove Data)
- **Purpose:** Delete resources
- **Body:** ❌ Usually not used
- **Data location:** ID in URL
- **Example:**
  ```
  DELETE /api/material-requirements/304
  ```

---

## 🎯 Common Mistakes & Fixes

### ❌ Mistake 1: Adding Body to GET Request

**Wrong:**
```
Method: GET
URL: http://localhost:1213/api/auctions
Body: {
  "id": "000000000000000000000101"
}
```
**Result:** Returns ALL auctions (body is ignored!)

**Right:**
```
Method: GET
URL: http://localhost:1213/api/auctions/000000000000000000000101
Body: (empty - leave it blank!)
```
**Result:** Returns ONLY auction 101 ✅

---

### ❌ Mistake 2: Putting ID in Body Instead of URL

**Wrong:**
```
Method: GET
URL: http://localhost:1213/api/auctions
Body: { "auctionId": "101" }
```

**Right:**
```
Method: GET
URL: http://localhost:1213/api/auctions/000000000000000000000101
Body: (empty)
```

---

### ❌ Mistake 3: Wrong Tab Selected

**Problem:** You're typing in the wrong place!

**Check these tabs in Postman:**
1. **Params** tab - For query parameters (e.g., `?status=live`)
2. **Body** tab - Only for POST/PUT requests
3. **Headers** tab - For Content-Type, etc.

**For GET requests:** Don't use Body tab at all!

---

## 📋 Quick Reference: Which APIs Use Body?

### ❌ NO BODY (GET Requests - IDs go in URL):

| API # | Name | URL Example |
|-------|------|-------------|
| 1 | Get All Auctions | `GET /api/auctions` |
| 2 | Get Single Auction | `GET /api/auctions/101` ← ID here |
| 5 | Get Auction Bids | `GET /api/auctions/101/bids` |
| 6 | Get User Bid History | `GET /api/users/2/bids` |
| 8 | Get All Requirements | `GET /api/material-requirements` |
| 9 | Get Single Requirement | `GET /api/material-requirements/301` |
| 11 | Find Matching Auctions | `GET /api/material-requirements/301/matches` |
| 12 | Get Company Notifications | `GET /api/companies/2/notifications` |

### ✅ YES BODY (POST/PUT Requests):

| API # | Name | Body Required |
|-------|------|---------------|
| 3 | Check Eligibility | `{ "userId": "2" }` |
| 4 | Place Bid | `{ "bidderId": "2", "bidAmount": 1500, "bidType": "cash" }` |
| 7 | Create Requirement | `{ "companyId": "2", "materialType": "plastic", ... }` |
| 10 | Update Requirement | `{ "quantity": 1500, "maxPrice": 6000 }` |
| 13 | Mark Notification Read | (no body needed, ID in URL) |
| 14 | Delete Requirement | (no body needed, ID in URL) |

---

## 🔍 How to Fix Your Issue

### Step 1: Check Which API You're Testing

**If you want to get a SPECIFIC auction:**
- ❌ Don't put ID in body
- ✅ Use: `GET /api/auctions/000000000000000000000101`

### Step 2: Clear the Body Tab

For GET requests:
1. Click **Body** tab
2. Select **"none"** radio button
3. Leave it empty

### Step 3: Put ID in URL

**Example - Get Plastic Auction (ID: 101):**

```
Method: GET
URL: http://localhost:1213/api/auctions/000000000000000000000101
                                                    ↑
                                              ID goes here!
Body: (none - leave empty)
```

---

## 🎯 Postman Collection Already Has This Fixed!

**Good news:** The imported collection (`Postman_Collection_22201213.json`) already has everything set up correctly!

**Just:**
1. Click the request name (e.g., "2. GET Single Auction")
2. Click **Send**
3. Don't change anything!

**The collection uses variables:**
- `{{plastic_auction_id}}` = `000000000000000000000101`
- `{{company_abc_id}}` = `000000000000000000000002`
- These are automatically inserted into URLs

---

## 💡 Pro Tips

### ✅ How to Test Each API Correctly:

**API 1: Get All Auctions**
```
GET /api/auctions
No body, no parameters
Returns: Array of 5 auctions
```

**API 2: Get Single Auction**
```
GET /api/auctions/{{plastic_auction_id}}
No body
Returns: Only plastic auction (ID: 101)
```

**API 3: Check Eligibility**
```
POST /api/auctions/{{plastic_auction_id}}/check-eligibility
Body: { "userId": "{{company_abc_id}}" }
Returns: { "eligible": true/false }
```

**API 4: Place Bid**
```
POST /api/auctions/{{plastic_auction_id}}/bid
Body: {
  "bidderId": "{{company_abc_id}}",
  "bidAmount": 1500,
  "bidType": "cash"
}
Returns: Bid confirmation
```

---

## 🔧 Visual Checklist

Before clicking Send, check:

- [ ] **Method correct?** (GET/POST/PUT/DELETE)
- [ ] **URL has ID?** (if getting single item)
- [ ] **Body tab = "none"?** (for GET requests)
- [ ] **Body has JSON?** (for POST/PUT that need it)
- [ ] **Content-Type header?** (`application/json` for POST/PUT)

---

## 📞 Still Having Issues?

### Check these:

1. **Server running?**
   ```powershell
   npm run dev
   ```

2. **Correct URL?**
   - Should be: `http://localhost:1213/api/...`
   - NOT: `http://localhost:1213/...` (missing `/api`)

3. **Database seeded?**
   ```powershell
   node seed.js
   ```

4. **Using collection variables?**
   - Collection should have variables defined
   - Check: Collection → Variables tab

---

## 🎓 Summary

**GET requests = URL only, NO body**
```
✅ GET /api/auctions/101
❌ GET /api/auctions + Body: { "id": 101 }
```

**POST/PUT requests = URL + Body**
```
✅ POST /api/auctions/101/bid + Body: { bidderId, bidAmount }
❌ POST /api/auctions/101/bid (no body)
```

**Remember:** 
- GET = Read data (no body)
- POST = Create data (needs body)
- PUT = Update data (needs body)
- DELETE = Remove data (usually no body)

---

**Hope this helps! 🚀**

Now you know why your GET request was returning all data - it was ignoring your body completely!
