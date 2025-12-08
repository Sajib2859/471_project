import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database";
import auctionRoutes from "./routes/auctionRoutes";
import materialRequirementRoutes from "./routes/materialRequirementRoutes";
import wasteHubRoutes from "./routes/wasteHubRoutes";
import creditRoutes from "./routes/creditRoutes";
import depositRoutes from "./routes/depositRoutes";

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = parseInt(process.env.PORT || "9371", 10);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Waste Management API Server",
    studentId: "22299371",
    port: PORT,
    endpoints: {
      wasteHubs: "/api/waste-hubs",
      credits: "/api/users/:userId/credits",
      auctions: "/api/auctions",
      materialRequirements: "/api/material-requirements",
      deposits: "/api/deposits",
      documentation: "/api/docs",
    },
  });
});

// API Routes
app.use("/api", wasteHubRoutes);
app.use("/api", creditRoutes);
app.use("/api", auctionRoutes);
app.use("/api", materialRequirementRoutes);
app.use("/api", depositRoutes);

// API Documentation route
app.get("/api/docs", (req: Request, res: Response) => {
  res.json({
    success: true,
    studentId: "22299371",
    modules: "Module 1 & Module 2",
    features: [
      {
        feature: "Module 1 - Member 1",
        description:
          "Find and filter waste disposal hubs by location and waste type",
        endpoints: [
          "GET /api/waste-hubs - View all waste hubs",
          "GET /api/waste-hubs/:id - View single waste hub",
          "GET /api/waste-hubs/nearby - Find nearby waste hubs",
          "GET /api/waste-hubs/filter-by-waste-type/:wasteType - Filter by waste type",
          "GET /api/waste-hubs/status/:status - Get hubs by status",
          "GET /api/waste-hubs/:id/accepted-materials - Get accepted materials",
        ],
      },
      {
        feature: "Module 2 - Member 1",
        description:
          "View credit balance, transaction history, and redeem credits for cash",
        endpoints: [
          "GET /api/users/:userId/credits/balance - View credit balance",
          "GET /api/users/:userId/credits/transactions - View transaction history",
          "POST /api/users/:userId/credits/redeem - Redeem credits for cash",
          "GET /api/users/:userId/credits/redemptions - View redemption history",
          "GET /api/users/:userId/credits/redemptions/:redemptionId - Get redemption details",
          "GET /api/credits/summary - Get credit statistics",
        ],
      },
      {
        feature: "Module 2 - Member 2",
        description:
          "Users and companies can participate in live online auctions",
        endpoints: [
          "GET /api/auctions - View all auctions",
          "GET /api/auctions/:id - View single auction",
          "POST /api/auctions/:id/check-eligibility - Check eligibility",
          "POST /api/auctions/:id/bid - Place a bid",
          "GET /api/auctions/:id/bids - View all bids for auction",
          "GET /api/users/:userId/bids - View user bid history",
        ],
      },
      {
        feature: "Module 2 - Member 3",
        description:
          "Companies can post material requirements and receive notifications",
        endpoints: [
          "POST /api/material-requirements - Create requirement",
          "GET /api/material-requirements - View all requirements",
          "GET /api/material-requirements/:id - View single requirement",
          "PUT /api/material-requirements/:id - Update requirement",
          "DELETE /api/material-requirements/:id - Cancel requirement",
          "GET /api/material-requirements/:id/matches - Find matching auctions",
          "GET /api/companies/:companyId/notifications - View notifications",
          "PUT /api/notifications/:id/read - Mark notification as read",
        ],
      },
      {
        feature: "Module 1 - Member 3",
        description:
          "Admins verify registered deposits, reject with reasons, and allocate credits to users",
        endpoints: [
          "POST /api/deposits - Register a new waste deposit",
          "GET /api/deposits/pending - View all pending deposits (admin only)",
          "GET /api/deposits/:depositId - Get deposit details",
          "POST /api/deposits/:depositId/verify - Verify deposit and allocate credits (admin only)",
          "POST /api/deposits/:depositId/reject - Reject deposit with reason (admin only)",
          "GET /api/users/:userId/deposits - View user's deposit history",
          "GET /api/deposits/admin/summary - Get admin dashboard summary (admin only)",
        ],
      },
    ],
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server with database connection
const startServer = async () => {
  try {
    // Try to connect to database (but don't exit if it fails)
    await connectDB();

    // Then start the server
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log("═══════════════════════════════════════════════════");
      console.log("🚀 Waste Management API Server Started");
      console.log("═══════════════════════════════════════════════════");
      console.log(`📍 Server running on: http://localhost:${PORT}`);
      console.log(`👤 Student ID: 22299371`);
      console.log(`📝 API Documentation: http://localhost:${PORT}/api/docs`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log("═══════════════════════════════════════════════════");
      console.log("✅ Server is listening and ready to accept connections");
    });

    server.on("error", (error: any) => {
      console.error("❌ Server Error:", error);
      if (error.code === "EADDRINUSE") {
        console.error(
          `Port ${PORT} is already in use. Please use a different port.`
        );
      }
      process.exit(1);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
