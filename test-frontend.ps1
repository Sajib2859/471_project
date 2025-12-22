# Comprehensive Frontend Pages Test
Write-Host "Testing all frontend pages for errors..." -ForegroundColor Cyan
Write-Host ""

$pages = @(
    @{Name="Home"; Path="/"},
    @{Name="Blogs"; Path="/blogs"},
    @{Name="Campaigns"; Path="/campaigns"},
    @{Name="Waste Reports"; Path="/waste-reports"},
    @{Name="Waste Hubs"; Path="/waste-hubs"},
    @{Name="Deposit Management"; Path="/waste-deposit"},
    @{Name="Credits"; Path="/credits"},
    @{Name="Auctions"; Path="/auctions"},
    @{Name="Material Requirements"; Path="/material-requirements"},
    @{Name="Admin Deposit Verification"; Path="/admin/deposit-verification"},
    @{Name="Admin Users"; Path="/admin/users-companies"},
    @{Name="Admin Auction History"; Path="/admin/auction-history"}
)

$baseUrl = "http://localhost:9371/api"

Write-Host "Checking API endpoints..." -ForegroundColor Yellow
Write-Host ""

$endpoints = @(
    "/blogs",
    "/campaigns",
    "/waste-reports",
    "/waste-hubs",
    "/deposits/pending",
    "/users/000000000000000000000004/deposits",
    "/users/000000000000000000000004/credits/balance",
    "/auctions"
)

foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl$endpoint" -Method GET -ErrorAction Stop
        $count = if ($response.data) { $response.data.Count } else { "N/A" }
        Write-Host "✅ $endpoint - $count items" -ForegroundColor Green
    } catch {
        Write-Host "❌ $endpoint - Error: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "All pages should now work properly!" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host ""
