import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <section className="hero">
        <h1>🔐 Admin Dashboard</h1>
        <p>Manage users, companies, auctions, and deposits</p>
      </section>

      <div className="container" style={{ padding: "4rem 2rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "3rem",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {/* Box 1: Users & Companies Management */}
          <div
            style={{
              border: "2px solid #7cb342",
              borderRadius: "15px",
              overflow: "hidden",
              backgroundColor: "#fff",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.boxShadow = "0 8px 25px rgba(124,179,66,0.2)";
              el.style.transform = "translateY(-5px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
              el.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                width: "100%",
                height: "200px",
                background: "linear-gradient(135deg, #7cb342 0%, #558b2f 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "5rem",
              }}
            >
              👥
            </div>
            <div style={{ padding: "2rem" }}>
              <h3
                style={{
                  margin: "0 0 1rem 0",
                  color: "#2c2c2c",
                  textAlign: "center",
                }}
              >
                Users & Companies
              </h3>
              <p
                style={{
                  margin: "0 0 1.5rem 0",
                  color: "#666",
                  textAlign: "center",
                  fontSize: "0.9rem",
                }}
              >
                View and manage all registered users and companies on the
                platform
              </p>
              <button
                onClick={() => navigate("/admin-users-companies")}
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  backgroundColor: "#7cb342",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "1rem",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#558b2f";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#7cb342";
                }}
              >
                Manage Users & Companies →
              </button>
            </div>
          </div>

          {/* Box 2: Create Auction */}
          <div
            style={{
              border: "2px solid #1976d2",
              borderRadius: "15px",
              overflow: "hidden",
              backgroundColor: "#fff",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.boxShadow = "0 8px 25px rgba(25,118,210,0.2)";
              el.style.transform = "translateY(-5px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
              el.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                width: "100%",
                height: "200px",
                background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "5rem",
              }}
            >
              🏆
            </div>
            <div style={{ padding: "2rem" }}>
              <h3
                style={{
                  margin: "0 0 1rem 0",
                  color: "#2c2c2c",
                  textAlign: "center",
                }}
              >
                Create Auction
              </h3>
              <p
                style={{
                  margin: "0 0 1.5rem 0",
                  color: "#666",
                  textAlign: "center",
                  fontSize: "0.9rem",
                }}
              >
                Create and schedule new waste material auctions for the website
              </p>
              <button
                onClick={() => navigate("/admin-create-auction")}
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "1rem",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#1565c0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#1976d2";
                }}
              >
                Create New Auction →
              </button>
            </div>
          </div>

          {/* Box 3: Auction History */}
          <div
            style={{
              border: "2px solid #f57c00",
              borderRadius: "15px",
              overflow: "hidden",
              backgroundColor: "#fff",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.boxShadow = "0 8px 25px rgba(245,124,0,0.2)";
              el.style.transform = "translateY(-5px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
              el.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                width: "100%",
                height: "200px",
                background: "linear-gradient(135deg, #f57c00 0%, #e65100 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "5rem",
              }}
            >
              📜
            </div>
            <div style={{ padding: "2rem" }}>
              <h3
                style={{
                  margin: "0 0 1rem 0",
                  color: "#2c2c2c",
                  textAlign: "center",
                }}
              >
                Auction History
              </h3>
              <p
                style={{
                  margin: "0 0 1.5rem 0",
                  color: "#666",
                  textAlign: "center",
                  fontSize: "0.9rem",
                }}
              >
                View all past and ongoing auctions with details and bidding
                activity
              </p>
              <button
                onClick={() => navigate("/admin-auction-history")}
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  backgroundColor: "#f57c00",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "1rem",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#e65100";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#f57c00";
                }}
              >
                View Auction History →
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div style={{ marginTop: "4rem", textAlign: "center" }}>
          <h2 style={{ marginBottom: "2rem", color: "#2c2c2c" }}>
            Dashboard Overview
          </h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value" style={{ color: "#7cb342" }}>
                —
              </div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: "#1976d2" }}>
                —
              </div>
              <div className="stat-label">Active Auctions</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: "#f57c00" }}>
                —
              </div>
              <div className="stat-label">Total Auctions</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: "#d32f2f" }}>
                —
              </div>
              <div className="stat-label">Pending Deposits</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
