import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import WasteHubs from "./pages/WasteHubs";
import Credits from "./pages/Credits";
import Home from "./pages/Home";
import Auctions from "./pages/Auctions";
import MaterialRequirements from "./pages/MaterialRequirements";
import Login from "./pages/Login";
import CompanyDashboard from "./pages/CompanyDashboard";
import DepositManagement from "./pages/DepositManagement";
import AdminDepositVerification from "./pages/AdminDepositVerification";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsersCompanies from "./pages/AdminUsersCompanies";
import AdminCreateAuction from "./pages/AdminCreateAuction";
import AdminAuctionHistory from "./pages/AdminAuctionHistory";
import Campaigns from "./pages/Campaigns";
import WasteReports from "./pages/WasteReports";
import Blogs from "./pages/Blogs";
import Notifications from "./pages/Notifications";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminRoleManagement from "./pages/AdminRoleManagement";
import CompanyAnalytics from "./pages/CompanyAnalytics";

function AppContent() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="App">
      <header className="header">
        <div className="header-container">
          <Link
            to={user?.role === "company" ? "/company-dashboard" : user?.role === "admin" ? "/admin-dashboard" : "/"}
            className="logo"
          >
            ♻️ WasteWise
          </Link>
          <nav className="nav">
            {user ? (
              <>
                {user.role === "company" ? (
                  <>
                    <Link to="/company-dashboard">Dashboard</Link>
                    <Link to="/auctions">Auctions</Link>
                    <Link to="/materials">Materials</Link>
                    <Link to="/company-analytics">Analytics</Link>
                    <Link to="/campaigns">Campaigns</Link>
                    <Link to="/waste-reports">Reports</Link>
                    <Link to="/blogs">Blogs</Link>
                    <Link to="/notifications">Notifications</Link>
                    <Link to="/credits">Account</Link>
                  </>
                ) : user.role === "admin" ? (
                  <>
                    <Link to="/admin-dashboard">Dashboard</Link>
                    <Link to="/deposits-verify">Verify Deposits</Link>
                    <Link to="/admin-analytics">Analytics</Link>
                    <Link to="/admin-roles">Role Management</Link>
                    <Link to="/waste-hubs">Waste Hubs</Link>
                    <Link to="/campaigns">Campaigns</Link>
                    <Link to="/waste-reports">Reports</Link>
                    <Link to="/blogs">Blogs</Link>
                    <Link to="/notifications">Notifications</Link>
                  </>
                ) : (
                  <>
                    <Link to="/">Home</Link>
                    <Link to="/waste-hubs">Waste Hubs</Link>
                    <Link to="/deposits">My Deposits</Link>
                    <Link to="/campaigns">Campaigns</Link>
                    <Link to="/waste-reports">Reports</Link>
                    <Link to="/blogs">Blogs</Link>
                    <Link to="/notifications">Notifications</Link>
                    <Link to="/credits">Credits</Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#757575",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    padding: "0.5rem 0",
                  }}
                >
                  Logout ({user.email})
                </button>
              </>
            ) : (
              <>
                <Link to="/">Home</Link>
                <Link to="/waste-hubs">Waste Hubs</Link>
                <Link to="/campaigns">Campaigns</Link>
                <Link to="/waste-reports">Reports</Link>
                <Link to="/blogs">Blogs</Link>
                <Link to="/login">Login</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/" element={<Home />} />
        <Route path="/waste-hubs" element={<WasteHubs />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="/deposits" element={<DepositManagement />} />
        <Route path="/deposits-verify" element={<AdminDepositVerification />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route
          path="/admin-users-companies"
          element={<AdminUsersCompanies />}
        />
        <Route path="/admin-create-auction" element={<AdminCreateAuction />} />
        <Route
          path="/admin-auction-history"
          element={<AdminAuctionHistory />}
        />
        <Route path="/auctions" element={<Auctions />} />
        <Route path="/materials" element={<MaterialRequirements />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/waste-reports" element={<WasteReports />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/admin-analytics" element={<AdminAnalytics />} />
        <Route path="/admin-roles" element={<AdminRoleManagement />} />
        <Route path="/company-analytics" element={<CompanyAnalytics />} />
      </Routes>

      <footer className="footer">
        <div className="footer-content">
          <p>♻️ WasteWise - Smart Waste Management System</p>
          <p>&copy; 2025 All Rights Reserved</p>
          <div className="team-info">
            <p>Developed by Group 13 | CSE 471 Project</p>
            <p>Student IDs: 22299371, 22201213, 22201613, 22201607</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
