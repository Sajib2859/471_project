import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/database";
import auctionRoutes from "./routes/auctionRoutes";
import materialRequirementRoutes from "./routes/materialRequirementRoutes";
import wasteHubRoutes from "./routes/wasteHubRoutes";
import creditRoutes from "./routes/creditRoutes";
import depositRoutes from "./routes/depositRoutes";
import campaignRoutes from "./routes/campaignRoutes";
import wasteReportRoutes from "./routes/wasteReportRoutes";
import blogRoutes from "./routes/blogRoutes";
import userRoutes from "./routes/userRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import roleRoutes from "./routes/roleRoutes";
import ratingRoutes from "./routes/ratingRoutes";
import announcementRoutes from "./routes/announcementRoutes";
import profileRoutes from "./routes/profileRoutes";

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = parseInt(process.env.PORT || "9371", 10);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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
      campaigns: "/api/campaigns",
      wasteReports: "/api/waste-reports",
      blogs: "/api/blogs",
      notifications: "/api/users/:userId/notifications",
      analytics: "/api/analytics",
      roles: "/api/roles",
      documentation: "/api/docs",
    },
  });
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api", wasteHubRoutes);
app.use("/api", creditRoutes);
app.use("/api", auctionRoutes);
app.use("/api", materialRequirementRoutes);
app.use("/api", depositRoutes);
app.use("/api", campaignRoutes);
app.use("/api", wasteReportRoutes);
app.use("/api", blogRoutes);
app.use("/api", ratingRoutes);
app.use("/api", announcementRoutes);
app.use("/api", profileRoutes);
app.use("/api", notificationRoutes);
app.use("/api", analyticsRoutes);
app.use("/api", roleRoutes);

// API Documentation route
app.get("/api/docs", (req: Request, res: Response) => {
  res.json({
    success: true,
    studentId: "22299371",
    modules: "Module 1, Module 2, Module 3 & Module 4",
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
      {
        feature: "Module 3 - Member 1",
        description:
          "Admins create and manage waste management or cleanup campaigns with scheduling, locations, and participant lists",
        endpoints: [
          "POST /api/campaigns - Create a new campaign (admin only)",
          "GET /api/campaigns - View all campaigns with filters",
          "GET /api/campaigns/:id - View single campaign details",
          "PUT /api/campaigns/:id - Update campaign (admin only)",
          "DELETE /api/campaigns/:id - Delete campaign (admin only)",
          "POST /api/campaigns/:id/volunteer - Volunteer for a campaign",
          "POST /api/campaigns/:id/follow - Follow a campaign",
          "POST /api/campaigns/:id/unfollow - Unfollow a campaign",
          "PUT /api/campaigns/:id/progress - Update campaign progress (admin only)",
          "GET /api/campaigns/:id/participants - View campaign participants",
          "GET /api/users/:userId/campaigns - View user's campaigns",
        ],
      },
      {
        feature: "Module 3 - Member 2",
        description:
          "Users report locations where waste has accumulated with photos and waste type specifications",
        endpoints: [
          "POST /api/waste-reports - Create a new waste report",
          "GET /api/waste-reports - View all waste reports with filters",
          "GET /api/waste-reports/stats - Get waste report statistics",
          "GET /api/waste-reports/:id - View single waste report",
          "PUT /api/waste-reports/:id - Update waste report",
          "DELETE /api/waste-reports/:id - Delete waste report",
          "POST /api/waste-reports/:id/verify - Verify report (admin only)",
          "POST /api/waste-reports/:id/assign - Assign report to cleanup team (admin only)",
          "POST /api/waste-reports/:id/resolve - Mark report as resolved (admin only)",
          "POST /api/waste-reports/:id/upvote - Upvote a waste report",
          "GET /api/users/:userId/waste-reports - View user's waste reports",
        ],
      },
      {
        feature: "Module 3 - Member 3",
        description:
          "Users and admins post blogs/articles about recycling, waste management best practices, and cleanup news",
        endpoints: [
          "POST /api/blogs - Create a new blog post",
          "GET /api/blogs - View all blogs with filters",
          "GET /api/blogs/stats - Get blog statistics",
          "GET /api/blogs/trending - Get trending blogs",
          "GET /api/blogs/category/:category - Get blogs by category",
          "GET /api/blogs/:id - View single blog",
          "PUT /api/blogs/:id - Update blog",
          "DELETE /api/blogs/:id - Delete blog",
          "POST /api/blogs/:id/like - Like a blog",
          "POST /api/blogs/:id/unlike - Unlike a blog",
          "POST /api/blogs/:id/comment - Add comment to blog",
          "DELETE /api/blogs/:id/comment/:commentIndex - Delete comment",
          "GET /api/users/:userId/blogs - View user's blogs",
        ],
      },
      {
        feature: "Module 3 - Member 4",
        description:
          "Users volunteer for or follow campaigns, view campaign progress, and receive updates and notifications",
        endpoints: [
          "POST /api/campaigns/:id/volunteer - Volunteer for a campaign",
          "POST /api/campaigns/:id/follow - Follow a campaign for updates",
          "POST /api/campaigns/:id/unfollow - Unfollow a campaign",
          "GET /api/campaigns/:id/participants - View volunteers and followers",
          "GET /api/users/:userId/campaigns - View user's volunteered and followed campaigns",
          "PUT /api/campaigns/:id/progress - Update progress (sends notifications to followers/volunteers)",
        ],
      },
      {
        feature: "Module 4 - Member 1",
        description:
          "Real-time notifications about deposit validation, campaign updates, auction activity, direct messages, and credit redemption events",
        endpoints: [
          "POST /api/notifications - Create notification",
          "GET /api/users/:userId/notifications - Get user notifications",
          "GET /api/users/:userId/notifications/stats - Get notification statistics",
          "PUT /api/notifications/:notificationId/read - Mark notification as read",
          "PUT /api/users/:userId/notifications/read-all - Mark all as read",
          "DELETE /api/notifications/:notificationId - Delete notification",
          "DELETE /api/users/:userId/notifications - Delete all notifications",
        ],
      },
      {
        feature: "Module 4 - Member 2",
        description:
          "Admins generate and export analytics reports on platform usage, waste deposited, campaign success, and user engagement",
        endpoints: [
          "GET /api/analytics/platform-usage - Get platform usage analytics",
          "GET /api/analytics/waste - Get waste analytics",
          "GET /api/analytics/campaigns - Get campaign analytics",
          "GET /api/analytics/user-engagement - Get user engagement analytics",
          "GET /api/analytics/activity-logs - Get activity logs",
          "GET /api/analytics/export?type=<type> - Export analytics as CSV (deposits, campaigns, auctions, activity-logs)",
        ],
      },
      {
        feature: "Module 4 - Member 3",
        description:
          "Admins assign and manage user roles (user, admin, company), adjust permissions, and view logs of platform activities",
        endpoints: [
          "GET /api/roles/users - Get all users with roles",
          "GET /api/roles/statistics - Get role statistics",
          "GET /api/roles/history - Get role change history",
          "GET /api/roles/users/:userId/permissions - Get user permissions",
          "PUT /api/roles/users/:userId - Update user role",
          "POST /api/roles/bulk-update - Bulk update user roles",
          "DELETE /api/roles/users/:userId - Delete user",
        ],
      },
      {
        feature: "Module 4 - Member 4",
        description:
          "Companies view analytics about their participation: auctions won, materials acquired, and transaction history",
        endpoints: [
          "GET /api/analytics/company/:companyId - Get company analytics",
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
    // For serverless (Vercel), connection is handled per-request
    // For local development, connect here
    if (process.env.NODE_ENV !== 'production') {
      try {
        await connectDB();
      } catch (error) {
        console.error('Database connection failed, but server will continue');
      }
    }

    // Start the server regardless of DB connection
    const PORT_NUMBER = parseInt(process.env.PORT || "9371", 10);
    
    const server = app.listen(PORT_NUMBER, () => {
      console.log("═══════════════════════════════════════════════════");
      console.log("🚀 Waste Management API Server Started");
      console.log("═══════════════════════════════════════════════════");
      console.log(`📍 Server running on port: ${PORT_NUMBER}`);
      console.log(`👤 Student ID: 22299371`);
      console.log(`📝 API Documentation: /api/docs`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log("═══════════════════════════════════════════════════");
      console.log("✅ Server is listening and ready to accept connections");
    });

    server.on("error", (error: any) => {
      console.error("❌ Server Error:", error);
      if (error.code === "EADDRINUSE") {
        console.error(
          `Port ${PORT_NUMBER} is already in use. Please use a different port.`
        );
      }
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();

export default app;
