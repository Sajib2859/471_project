# 🔑 Simple ID Reference Card

**Quick Reference for API Testing**

---

## 👥 USER IDs

| User | Simple ID | Email |
|------|-----------|-------|
| Admin | `000000000000000000000001` | admin@waste.com |
| Company ABC | `000000000000000000000002` | company@abc.com |
| Green Industries | `000000000000000000000003` | green@industries.com |
| Regular User | `000000000000000000000004` | user@test.com |
| John Doe | `000000000000000000000005` | john@example.com |

**Memory Trick:** Users are IDs 1-5

---

## 🔨 AUCTION IDs

| Auction | Simple ID | Material | Status |
|---------|-----------|----------|--------|
| Plastic Bottles | `000000000000000000000101` | plastic | live |
| Glass Bottles | `000000000000000000000102` | glass | scheduled |
| Paper Waste | `000000000000000000000103` | paper | live |
| Metal Cans | `000000000000000000000104` | metal | scheduled |
| Electronic Waste | `000000000000000000000105` | electronic | live |

**Memory Trick:** Auctions are IDs 101-105

---

## 📋 MATERIAL REQUIREMENT IDs

| Requirement | Simple ID | Material | Company |
|-------------|-----------|----------|---------|
| Plastic Req | `000000000000000000000301` | plastic | Company ABC |
| Glass Req | `000000000000000000000302` | glass | Green Industries |
| Paper Req | `000000000000000000000303` | paper | Company ABC |
| Metal Req | `000000000000000000000304` | metal | Green Industries |

**Memory Trick:** Requirements are IDs 301-304

---

## 🔔 NOTIFICATION IDs

| Notification | Simple ID | Type | Recipient |
|--------------|-----------|------|-----------|
| Auction Match 1 | `000000000000000000000401` | auction_match | Company ABC |
| Auction Match 2 | `000000000000000000000402` | auction_match | Green Industries |
| Outbid Alert | `000000000000000000000403` | bid_update | Company ABC |
| Leading Bid | `000000000000000000000404` | bid_update | Green Industries |
| Price Alert | `000000000000000000000405` | price_alert | Company ABC |

**Memory Trick:** Notifications are IDs 401-405

---

## 🚀 Quick Test Examples

### Test with Company ABC (ID: 2)
```powershell
# Check eligibility for plastic auction
curl -X POST http://localhost:1213/api/auctions/000000000000000000000101/check-eligibility `
  -H "Content-Type: application/json" `
  -d '{"userId":"000000000000000000000002"}'

# Place a bid
curl -X POST http://localhost:1213/api/auctions/000000000000000000000101/bid `
  -H "Content-Type: application/json" `
  -d '{"bidderId":"000000000000000000000002","bidAmount":1500,"bidType":"cash"}'

# Get notifications
curl http://localhost:1213/api/companies/000000000000000000000002/notifications
```

### Test with Green Industries (ID: 3)
```powershell
# Get user bids
curl http://localhost:1213/api/users/000000000000000000000003/bids

# Create material requirement
curl -X POST http://localhost:1213/api/material-requirements `
  -H "Content-Type: application/json" `
  -d '{"companyId":"000000000000000000000003","materialType":"plastic","quantity":1000,...}'
```

---

## 📝 Copy-Paste Ready IDs

### For Postman Variables
```javascript
// Users
admin_id = "000000000000000000000001"
company_abc_id = "000000000000000000000002"
green_industries_id = "000000000000000000000003"
regular_user_id = "000000000000000000000004"

// Auctions
plastic_auction_id = "000000000000000000000101"
glass_auction_id = "000000000000000000000102"
paper_auction_id = "000000000000000000000103"
metal_auction_id = "000000000000000000000104"
electronic_auction_id = "000000000000000000000105"

// Requirements
plastic_req_id = "000000000000000000000301"
glass_req_id = "000000000000000000000302"
paper_req_id = "000000000000000000000303"
metal_req_id = "000000000000000000000304"

// Notifications
notification_1_id = "000000000000000000000401"
notification_2_id = "000000000000000000000402"
notification_3_id = "000000000000000000000403"
```

---

## 🎯 Common Test Scenarios

### Scenario 1: Company ABC bids on Plastic Auction
```
User ID: 000000000000000000000002
Auction ID: 000000000000000000000101
```

### Scenario 2: Green Industries views notifications
```
Company ID: 000000000000000000000003
```

### Scenario 3: Update Plastic Requirement
```
Requirement ID: 000000000000000000000301
Company ID: 000000000000000000000002
```

### Scenario 4: Find matches for Glass Requirement
```
Requirement ID: 000000000000000000000302
Company ID: 000000000000000000000003
```

---

## 💡 Pro Tips

1. **Pattern Recognition:**
   - Users: 1-5
   - Auctions: 101-105
   - Requirements: 301-304
   - Notifications: 401-405

2. **Easy Typing:**
   - All IDs are 24 characters
   - Just zeros with the actual number at the end

3. **Testing Flow:**
   - Start with health check (/)
   - Test auctions with Company ABC (ID 2)
   - Test requirements with Green Industries (ID 3)
   - Check notifications for both companies

4. **Common Combinations:**
   - Company ABC + Plastic Auction = Most tested scenario
   - Green Industries + Glass Requirement = Secondary scenario
   - Use Regular User (ID 4) for user-specific tests

---

**Base URL:** `http://localhost:1213`  
**API Base:** `http://localhost:1213/api`  
**Student ID:** 22201213
