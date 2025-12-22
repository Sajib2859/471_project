# Check Database Collections Status
Write-Host "Checking database collections..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:9371/api"

# Check Blogs
try {
    $blogs = Invoke-RestMethod -Uri "$baseUrl/blogs" -Method GET
    Write-Host "✅ Blogs: $($blogs.data.Count) items" -ForegroundColor Green
} catch {
    Write-Host "❌ Blogs: Error or 0 items" -ForegroundColor Red
}

# Check Campaigns
try {
    $campaigns = Invoke-RestMethod -Uri "$baseUrl/campaigns" -Method GET
    Write-Host "✅ Campaigns: $($campaigns.data.Count) items" -ForegroundColor Green
} catch {
    Write-Host "❌ Campaigns: Error or 0 items" -ForegroundColor Red
}

# Check Waste Hubs
try {
    $hubs = Invoke-RestMethod -Uri "$baseUrl/waste-hubs" -Method GET
    Write-Host "✅ Waste Hubs: $($hubs.data.Count) items" -ForegroundColor Green
} catch {
    Write-Host "❌ Waste Hubs: Error or 0 items" -ForegroundColor Red
}

# Check Deposits
try {
    $deposits = Invoke-RestMethod -Uri "$baseUrl/users/000000000000000000000004/deposits" -Method GET
    Write-Host "✅ User Deposits: $($deposits.data.Count) items" -ForegroundColor Green
} catch {
    Write-Host "❌ Deposits: Error or 0 items" -ForegroundColor Red
}

# Check Waste Reports
try {
    $reports = Invoke-RestMethod -Uri "$baseUrl/waste-reports" -Method GET
    Write-Host "✅ Waste Reports: $($reports.data.Count) items" -ForegroundColor Green
} catch {
    Write-Host "❌ Waste Reports: Error or 0 items" -ForegroundColor Red
}

Write-Host ""
Write-Host "Database check complete!" -ForegroundColor Cyan
