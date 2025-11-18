# 🗄️ MongoDB Compass Connection Guide

**Problem:** "No connections imported" or empty connection screen  
**Solution:** Create a new connection manually

---

## ✅ Step-by-Step Connection Guide

### Step 1: Verify MongoDB is Running

MongoDB service is currently: **✅ RUNNING**

If you need to check status later:
```powershell
Get-Service -Name MongoDB
```

---

### Step 2: Open MongoDB Compass

1. Launch **MongoDB Compass** application
2. You'll see one of these screens:
   - "Connect to MongoDB" screen (new users)
   - "My Connections" screen (existing users)

---

### Step 3: Create New Connection

#### Method A: If you see "Connect" screen directly

1. You'll see a text box labeled **"URI"** or **"Connection String"**
2. It might have a default value like: `mongodb://localhost:27017`
3. **Make sure it says:** `mongodb://localhost:27017`
4. Click the green **"Connect"** button
5. ✅ Skip to Step 4!

#### Method B: If you see "My Connections" or "Saved Connections"

1. Click **"New Connection"** button (green button, usually top right or center)
2. You'll see connection form
3. In the **"URI"** field, enter:
   ```
   mongodb://localhost:27017
   ```
4. Click **"Save & Connect"** or just **"Connect"**

#### Method C: Advanced - Manual Configuration

If you need to fill individual fields:

| Field | Value |
|-------|-------|
| **Host** | `localhost` |
| **Port** | `27017` |
| **Authentication** | None (leave empty) |
| **Database** | (leave empty for now) |

---

### Step 4: View Your Database

After connecting successfully:

1. **Left Sidebar:** You'll see a list of databases
2. **Find:** `waste_management` database
3. **Click:** On `waste_management` to expand
4. **See:** 5 collections:
   - `auctions`
   - `bids`
   - `materialrequirements`
   - `notifications`
   - `users`

---

## 🔍 Verify Your Data

### Click on "users" collection

You should see **5 documents**:
```javascript
{
  _id: ObjectId("000000000000000000000001"),
  name: "Regular User",
  email: "user@test.com",
  role: "user"
}

{
  _id: ObjectId("000000000000000000000002"),
  name: "Company ABC",
  email: "company@abc.com",
  role: "company"
}

// ... 3 more users
```

### Click on "auctions" collection

You should see **5 documents**:
```javascript
{
  _id: ObjectId("000000000000000000000101"),
  title: "Recycled Plastic Bottles Auction",
  materialType: "plastic",
  status: "live"
}

// ... 4 more auctions
```

---

## ❗ Troubleshooting

### Issue 1: "No connections imported"

**Solution:**
- Click **"New Connection"** button
- Enter: `mongodb://localhost:27017`
- Click **"Connect"**

### Issue 2: "Can't connect to MongoDB server"

**Check MongoDB is running:**
```powershell
Get-Service -Name MongoDB
```

**If status is "Stopped", start it:**
```powershell
# Right-click PowerShell → Run as Administrator
net start MongoDB
```

### Issue 3: Don't see "waste_management" database

**Re-seed the database:**
```powershell
cd F:\CSE\471
node seed.js
```

**Refresh Compass:**
- Click the circular refresh icon next to "Databases"
- Or press F5

### Issue 4: Connection string error

**Try these alternatives:**

```
mongodb://localhost:27017

mongodb://127.0.0.1:27017

mongodb://localhost:27017/waste_management
```

### Issue 5: Collections are empty

**Verify data was seeded:**
```powershell
node seed.js
```

Look for output:
```
✅ Database seeded successfully!
✅ Created 5 users
✅ Created 5 auctions
✅ Created 4 material requirements
✅ Created 5 notifications
```

---

## 📸 Visual Guide

### What You Should See:

**1. Connection Screen:**
```
┌─────────────────────────────────────┐
│  Connect to MongoDB                 │
│                                     │
│  URI: mongodb://localhost:27017     │
│                                     │
│  [ Advanced Options ▼ ]            │
│                                     │
│           [Connect] ←── Click this │
└─────────────────────────────────────┘
```

**2. Connected View:**
```
Left Sidebar:
├── 📁 admin
├── 📁 config
├── 📁 local
└── 📁 waste_management ←── Your database!
    ├── 📄 auctions (5)
    ├── 📄 bids (0 or more)
    ├── 📄 materialrequirements (4)
    ├── 📄 notifications (5)
    └── 📄 users (5)
```

**3. Collection View:**
```
┌────────────────────────────────────────────┐
│ waste_management > users                   │
├────────────────────────────────────────────┤
│ [+] Documents  Schema  Explain  Indexes    │
├────────────────────────────────────────────┤
│ Filter: { }                    [Apply]     │
├────────────────────────────────────────────┤
│ {                                          │
│   _id: ObjectId("000000000000000000000001")│
│   name: "Regular User"                     │
│   email: "user@test.com"                   │
│   role: "user"                             │
│   creditBalance: 500                       │
│   cashBalance: 10000                       │
│ }                                          │
└────────────────────────────────────────────┘
```

---

## 💡 Quick Tips

### Save Connection for Future

1. After successful connection, click **"Save"**
2. Give it a name: "Waste Management Local"
3. Next time, just click saved connection!

### Keyboard Shortcuts

- **F5** - Refresh database/collections
- **Ctrl+F** - Search/filter documents
- **Ctrl+K** - Open command palette

### Useful Filters

**Find all companies:**
```javascript
{ "role": "company" }
```

**Find live auctions:**
```javascript
{ "status": "live" }
```

**Find specific user:**
```javascript
{ "_id": ObjectId("000000000000000000000002") }
```

**Find plastic materials:**
```javascript
{ "materialType": "plastic" }
```

---

## ✅ Success Checklist

After successful connection, you should:

- [ ] See "waste_management" database in left sidebar
- [ ] See 5 collections when expanded
- [ ] See 5 users in "users" collection
- [ ] See 5 auctions in "auctions" collection
- [ ] See 4 requirements in "materialrequirements" collection
- [ ] See 5 notifications in "notifications" collection
- [ ] See ObjectIDs starting with "000000000000000000000..."

---

## 🎯 Next Steps

Once connected successfully:

1. ✅ Browse your collections to verify data
2. ✅ Start your server: `npm run dev`
3. ✅ Test APIs in Postman
4. ✅ Refresh Compass to see changes after API calls

---

## 📞 Still Having Issues?

### Try This Quick Fix:

```powershell
# 1. Stop server if running
# Press Ctrl+C in server terminal

# 2. Verify MongoDB is running
Get-Service -Name MongoDB

# 3. Re-seed database
node seed.js

# 4. Open Compass
# 5. Connect to: mongodb://localhost:27017
# 6. Click refresh icon (circular arrow)
```

### Check if database exists:

```powershell
# Open MongoDB Shell (if installed)
mongosh

# List databases
show dbs

# Should see: waste_management

# Switch to database
use waste_management

# List collections
show collections

# Count documents
db.users.countDocuments()
# Should return: 5
```

---

**Need more help?** Your MongoDB is running and ready to connect! Just follow the steps above to create a new connection in Compass.
