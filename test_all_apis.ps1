# Comprehensive API Testing Script
# Student ID: 22201213
# Port: 1213

$BaseUrl = "http://localhost:1213"
$ApiUrl = "$BaseUrl/api"

# Simple IDs for testing
$AdminId = "000000000000000000000001"
$CompanyABCId = "000000000000000000000002"
$GreenIndustriesId = "000000000000000000000003"
$RegularUserId = "000000000000000000000004"
$PlasticAuctionId = "000000000000000000000101"
$GlassAuctionId = "000000000000000000000102"
$PaperAuctionId = "000000000000000000000103"
$PlasticReqId = "000000000000000000000301"
$GlassReqId = "000000000000000000000302"
$NotificationId = "000000000000000000000401"

$TestResults = @()

Write-Host "`n`n═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "       TESTING ALL 14 REST APIs" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════`n" -ForegroundColor Cyan

# Test 0: Health Check
Write-Host "Test 0: Server Health Check" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri $BaseUrl -Method Get
    Write-Host "✅ PASSED - Server is running" -ForegroundColor Green
    Write-Host "   Student ID: $($response.studentId)" -ForegroundColor White
    Write-Host "   Port: $($response.port)`n" -ForegroundColor White
    $TestResults += @{Test="Health Check"; Status="PASSED"}
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)`n" -ForegroundColor Red
    $TestResults += @{Test="Health Check"; Status="FAILED"}
}

Write-Host "`n═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   MODULE 2 - MEMBER 2: AUCTION PARTICIPATION" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════`n" -ForegroundColor Cyan

# Test 1: GET all auctions
Write-Host "Test 1: GET /api/auctions - View all auctions" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$ApiUrl/auctions" -Method Get
    if ($response.success -eq $true -and $response.count -gt 0) {
        Write-Host "✅ PASSED - Retrieved $($response.count) auctions" -ForegroundColor Green
        Write-Host "   Sample: $($response.data[0].title)`n" -ForegroundColor White
        $TestResults += @{Test="GET All Auctions"; Status="PASSED"}
    } else {
        throw "No auctions found"
    }
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)`n" -ForegroundColor Red
    $TestResults += @{Test="GET All Auctions"; Status="FAILED"}
}

# Test 2: GET single auction
Write-Host "Test 2: GET /api/auctions/:id - View single auction" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$ApiUrl/auctions/$PlasticAuctionId" -Method Get
    if ($response.success -eq $true) {
        Write-Host "✅ PASSED - Retrieved auction details" -ForegroundColor Green
        Write-Host "   Title: $($response.data.title)" -ForegroundColor White
        Write-Host "   Current Bid: $($response.data.currentBid)" -ForegroundColor White
        Write-Host "   Status: $($response.data.status)`n" -ForegroundColor White
        $TestResults += @{Test="GET Single Auction"; Status="PASSED"}
    } else {
        throw "Auction not found"
    }
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)`n" -ForegroundColor Red
    $TestResults += @{Test="GET Single Auction"; Status="FAILED"}
}

# Test 3: Check eligibility
Write-Host "Test 3: POST /api/auctions/:id/check-eligibility - Check bidding eligibility" -ForegroundColor Yellow
try {
    $body = @{
        userId = $CompanyABCId
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$ApiUrl/auctions/$PlasticAuctionId/check-eligibility" -Method Post -Body $body -ContentType "application/json"
    if ($response.success -eq $true) {
        Write-Host "✅ PASSED - Eligibility check completed" -ForegroundColor Green
        Write-Host "   Eligible: $($response.data.eligible)" -ForegroundColor White
        Write-Host "   Message: $($response.data.message)`n" -ForegroundColor White
        $TestResults += @{Test="Check Eligibility"; Status="PASSED"}
    } else {
        throw "Eligibility check failed"
    }
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)`n" -ForegroundColor Red
    $TestResults += @{Test="Check Eligibility"; Status="FAILED"}
}

# Test 4: Place a bid
Write-Host "Test 4: POST /api/auctions/:id/bid - Place a bid" -ForegroundColor Yellow
try {
    $body = @{
        bidderId = $CompanyABCId
        bidAmount = 1300
        bidType = "cash"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$ApiUrl/auctions/$PlasticAuctionId/bid" -Method Post -Body $body -ContentType "application/json"
    if ($response.success -eq $true) {
        Write-Host "✅ PASSED - Bid placed successfully" -ForegroundColor Green
        Write-Host "   Bid Amount: $($response.data.bidAmount)" -ForegroundColor White
        Write-Host "   Status: $($response.data.status)`n" -ForegroundColor White
        $TestResults += @{Test="Place Bid"; Status="PASSED"}
    } else {
        throw "Bid placement failed"
    }
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)`n" -ForegroundColor Red
    $TestResults += @{Test="Place Bid"; Status="FAILED"}
}

# Test 5: Get auction bids
Write-Host "Test 5: GET /api/auctions/:id/bids - View all bids for auction" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$ApiUrl/auctions/$PlasticAuctionId/bids" -Method Get
    if ($response.success -eq $true) {
        Write-Host "✅ PASSED - Retrieved $($response.count) bids" -ForegroundColor Green
        if ($response.count -gt 0) {
            Write-Host "   Latest Bid: $($response.data[0].bidAmount)`n" -ForegroundColor White
        }
        $TestResults += @{Test="GET Auction Bids"; Status="PASSED"}
    } else {
        throw "Failed to retrieve bids"
    }
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)`n" -ForegroundColor Red
    $TestResults += @{Test="GET Auction Bids"; Status="FAILED"}
}

# Test 6: Get user bids
Write-Host "Test 6: GET /api/users/:userId/bids - View user bid history" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$ApiUrl/users/$CompanyABCId/bids" -Method Get
    if ($response.success -eq $true) {
        Write-Host "✅ PASSED - Retrieved user bid history ($($response.count) bids)" -ForegroundColor Green
        $TestResults += @{Test="GET User Bids"; Status="PASSED"}
    } else {
        throw "Failed to retrieve user bids"
    }
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)`n" -ForegroundColor Red
    $TestResults += @{Test="GET User Bids"; Status="FAILED"}
}

Write-Host "`n═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   MODULE 2 - MEMBER 3: MATERIAL REQUIREMENTS" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════`n" -ForegroundColor Cyan

# Test 7: Create material requirement
Write-Host "Test 7: POST /api/material-requirements - Create new requirement" -ForegroundColor Yellow
try {
    $body = @{
        companyId = $CompanyABCId
        materialType = "organic"
        quantity = 500
        unit = "kg"
        description = "Need organic waste for composting facility"
        maxPrice = 2000
        urgency = "medium"
        status = "active"
        preferredLocations = @("Dhaka", "Chittagong")
        notificationPreferences = @{
            auctionMatch = $true
            inventoryMatch = $true
            priceAlert = $true
        }
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$ApiUrl/material-requirements" -Method Post -Body $body -ContentType "application/json"
    if ($response.success -eq $true) {
        $NewReqId = $response.data._id
        Write-Host "✅ PASSED - Material requirement created" -ForegroundColor Green
        Write-Host "   ID: $($response.data._id)" -ForegroundColor White
        Write-Host "   Material: $($response.data.materialType)`n" -ForegroundColor White
        $TestResults += @{Test="Create Requirement"; Status="PASSED"}
    } else {
        throw "Failed to create requirement"
    }
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)`n" -ForegroundColor Red
    $TestResults += @{Test="Create Requirement"; Status="FAILED"}
}

# Test 8: Get all material requirements
Write-Host "Test 8: GET /api/material-requirements - View all requirements" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$ApiUrl/material-requirements" -Method Get
    if ($response.success -eq $true -and $response.count -gt 0) {
        Write-Host "✅ PASSED - Retrieved $($response.count) requirements" -ForegroundColor Green
        Write-Host "   Sample: $($response.data[0].materialType)`n" -ForegroundColor White
        $TestResults += @{Test="GET All Requirements"; Status="PASSED"}
    } else {
        throw "No requirements found"
    }
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)`n" -ForegroundColor Red
    $TestResults += @{Test="GET All Requirements"; Status="FAILED"}
}

# Test 9: Get single material requirement
Write-Host "Test 9: GET /api/material-requirements/:id - View single requirement" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$ApiUrl/material-requirements/$PlasticReqId" -Method Get
    if ($response.success -eq $true) {
        Write-Host "✅ PASSED - Retrieved requirement details" -ForegroundColor Green
        Write-Host "   Material: $($response.data.materialType)" -ForegroundColor White
        Write-Host "   Quantity: $($response.data.quantity) $($response.data.unit)`n" -ForegroundColor White
        $TestResults += @{Test="GET Single Requirement"; Status="PASSED"}
    } else {
        throw "Requirement not found"
    }
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)`n" -ForegroundColor Red
    $TestResults += @{Test="GET Single Requirement"; Status="FAILED"}
}

# Test 10: Update material requirement
Write-Host "Test 10: PUT /api/material-requirements/:id - Update requirement" -ForegroundColor Yellow
try {
    $body = @{
        quantity = 1500
        maxPrice = 6000
        urgency = "high"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$ApiUrl/material-requirements/$PlasticReqId" -Method Put -Body $body -ContentType "application/json"
    if ($response.success -eq $true) {
        Write-Host "✅ PASSED - Requirement updated" -ForegroundColor Green
        Write-Host "   New Quantity: $($response.data.quantity)" -ForegroundColor White
        Write-Host "   New Max Price: $($response.data.maxPrice)`n" -ForegroundColor White
        $TestResults += @{Test="Update Requirement"; Status="PASSED"}
    } else {
        throw "Failed to update requirement"
    }
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)`n" -ForegroundColor Red
    $TestResults += @{Test="Update Requirement"; Status="FAILED"}
}

# Test 11: Find matching auctions
Write-Host "Test 11: GET /api/material-requirements/:id/matches - Find matching auctions" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$ApiUrl/material-requirements/$PlasticReqId/matches" -Method Get
    if ($response.success -eq $true) {
        Write-Host "✅ PASSED - Found $($response.count) matching auctions" -ForegroundColor Green
        if ($response.count -gt 0) {
            Write-Host "   Match: $($response.data[0].title)`n" -ForegroundColor White
        } else {
            Write-Host "`n" -ForegroundColor White
        }
        $TestResults += @{Test="Find Matches"; Status="PASSED"}
    } else {
        throw "Failed to find matches"
    }
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)`n" -ForegroundColor Red
    $TestResults += @{Test="Find Matches"; Status="FAILED"}
}

# Test 12: Get company notifications
Write-Host "Test 12: GET /api/companies/:companyId/notifications - View notifications" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$ApiUrl/companies/$CompanyABCId/notifications" -Method Get
    if ($response.success -eq $true) {
        Write-Host "✅ PASSED - Retrieved $($response.count) notifications" -ForegroundColor Green
        if ($response.count -gt 0) {
            Write-Host "   Latest: $($response.data[0].title)`n" -ForegroundColor White
        } else {
            Write-Host "`n" -ForegroundColor White
        }
        $TestResults += @{Test="GET Notifications"; Status="PASSED"}
    } else {
        throw "Failed to retrieve notifications"
    }
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)`n" -ForegroundColor Red
    $TestResults += @{Test="GET Notifications"; Status="FAILED"}
}

# Test 13: Mark notification as read
Write-Host "Test 13: PUT /api/notifications/:id/read - Mark notification as read" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$ApiUrl/notifications/$NotificationId/read" -Method Put
    if ($response.success -eq $true) {
        Write-Host "✅ PASSED - Notification marked as read" -ForegroundColor Green
        Write-Host "   Status: $($response.data.isRead)`n" -ForegroundColor White
        $TestResults += @{Test="Mark Notification Read"; Status="PASSED"}
    } else {
        throw "Failed to mark notification"
    }
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)`n" -ForegroundColor Red
    $TestResults += @{Test="Mark Notification Read"; Status="FAILED"}
}

# Test 14: Delete material requirement (optional bonus test)
Write-Host "Test 14: DELETE /api/material-requirements/:id - Cancel requirement" -ForegroundColor Yellow
try {
    # Create a new requirement to delete
    $body = @{
        companyId = $CompanyABCId
        materialType = "test"
        quantity = 100
        unit = "kg"
        description = "Test requirement for deletion"
        maxPrice = 1000
        urgency = "low"
        status = "active"
        preferredLocations = @("Dhaka")
        notificationPreferences = @{
            auctionMatch = $true
            inventoryMatch = $true
            priceAlert = $true
        }
    } | ConvertTo-Json
    
    $createResponse = Invoke-RestMethod -Uri "$ApiUrl/material-requirements" -Method Post -Body $body -ContentType "application/json"
    $testReqId = $createResponse.data._id
    
    # Now delete it
    $response = Invoke-RestMethod -Uri "$ApiUrl/material-requirements/$testReqId" -Method Delete
    if ($response.success -eq $true) {
        Write-Host "✅ PASSED - Requirement deleted successfully" -ForegroundColor Green
        $TestResults += @{Test="Delete Requirement"; Status="PASSED"}
    } else {
        throw "Failed to delete requirement"
    }
} catch {
    Write-Host "❌ FAILED - $($_.Exception.Message)`n" -ForegroundColor Red
    $TestResults += @{Test="Delete Requirement"; Status="FAILED"}
}

# Summary
Write-Host "`n`n═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "               TEST SUMMARY" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════`n" -ForegroundColor Cyan

$PassedTests = ($TestResults | Where-Object { $_.Status -eq "PASSED" }).Count
$TotalTests = $TestResults.Count

Write-Host "Total Tests: $TotalTests" -ForegroundColor White
Write-Host "Passed: $PassedTests" -ForegroundColor Green
Write-Host "Failed: $($TotalTests - $PassedTests)" -ForegroundColor Red
Write-Host "Success Rate: $([math]::Round(($PassedTests/$TotalTests)*100, 2))%`n" -ForegroundColor Yellow

# Display results
Write-Host "Detailed Results:" -ForegroundColor Yellow
foreach ($result in $TestResults) {
    if ($result.Status -eq "PASSED") {
        Write-Host "  ✅ $($result.Test)" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $($result.Test)" -ForegroundColor Red
    }
}

Write-Host "`n═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "             ALL TESTS COMPLETED!" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════`n`n" -ForegroundColor Cyan
