import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:9371/api";
const ADMIN_ID = "000000000000000000000001"; // Admin user from seed data

interface Deposit {
  _id: string;
  userId: { _id: string; name: string; email: string } | null;
  wasteHubId: { _id: string; name: string } | null;
  wasteType: string;
  amount: number;
  description?: string;
  photoUrl?: string;
  status: "pending" | "verified" | "rejected";
  estimatedCredits: number;
  createdAt: string;
  updatedAt: string;
}

interface DepositSummary {
  pending: number;
  verified: number;
  rejected: number;
  total: number;
}

const AdminDepositVerification: React.FC = () => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [summary, setSummary] = useState<DepositSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "all" | "summary">(
    "pending"
  );
  const [statusFilter, setStatusFilter] = useState<"pending" | "all">(
    "pending"
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Verification form
  const [customCredits, setCustomCredits] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);

  useEffect(() => {
    fetchDeposits();
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const endpoint =
        statusFilter === "pending" ? "/deposits/pending" : "/deposits/pending";
      const res = await axios.get(`${API_BASE}${endpoint}`, {
        params: {
          adminId: ADMIN_ID,
          page: page,
          limit: 10,
        },
      });
      setDeposits(res.data.data);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch (error) {
      console.error("Error fetching deposits:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await axios.get(`${API_BASE}/deposits/admin/summary`, {
        params: { adminId: ADMIN_ID },
      });
      setSummary(res.data.summary);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  const handleVerify = async (depositId: string) => {
    if (
      !customCredits &&
      (!selectedDeposit || !selectedDeposit.estimatedCredits)
    ) {
      alert("Please enter credits or use estimated credits");
      return;
    }

    try {
      setVerificationLoading(true);
      const creditsToAllocate = customCredits
        ? parseFloat(customCredits)
        : selectedDeposit?.estimatedCredits;

      const res = await axios.post(`${API_BASE}/deposits/${depositId}/verify`, {
        adminId: ADMIN_ID,
        creditsToAllocate,
      });

      alert(
        `✅ Deposit verified! ${creditsToAllocate} credits allocated to ${res.data.data.userName}`
      );
      setCustomCredits("");
      setSelectedDeposit(null);
      fetchDeposits();
      fetchSummary();
    } catch (error: any) {
      alert(error.response?.data?.message || "Error verifying deposit");
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleReject = async (depositId: string) => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    try {
      setVerificationLoading(true);
      await axios.post(`${API_BASE}/deposits/${depositId}/reject`, {
        adminId: ADMIN_ID,
        reason: rejectionReason,
      });

      alert("✅ Deposit rejected successfully");
      setRejectionReason("");
      setSelectedDeposit(null);
      fetchDeposits();
      fetchSummary();
    } catch (error: any) {
      alert(error.response?.data?.message || "Error rejecting deposit");
    } finally {
      setVerificationLoading(false);
    }
  };

  const getWasteTypeColor = (wasteType: string): string => {
    const colors: Record<string, string> = {
      plastic: "#1976d2",
      glass: "#0097a7",
      paper: "#7cb342",
      metal: "#f57f17",
      organic: "#558b2f",
      electronic: "#6f0298",
      textile: "#d81b60",
      hazardous: "#d32f2f",
    };
    return colors[wasteType] || "#757575";
  };

  const getStatusBadgeStyle = (status: string): React.CSSProperties => {
    const styles: Record<string, React.CSSProperties> = {
      pending: {
        backgroundColor: "#fff3cd",
        color: "#856404",
        padding: "0.4rem 0.8rem",
        borderRadius: "20px",
        fontSize: "0.85rem",
        fontWeight: "bold",
      },
      verified: {
        backgroundColor: "#d4edda",
        color: "#155724",
        padding: "0.4rem 0.8rem",
        borderRadius: "20px",
        fontSize: "0.85rem",
        fontWeight: "bold",
      },
      rejected: {
        backgroundColor: "#f8d7da",
        color: "#721c24",
        padding: "0.4rem 0.8rem",
        borderRadius: "20px",
        fontSize: "0.85rem",
        fontWeight: "bold",
      },
    };
    return styles[status] || {};
  };

  if (loading && deposits.length === 0) {
    return <div className="loading">Loading deposits...</div>;
  }

  return (
    <>
      <section className="hero">
        <h1>📋 Deposit Verification Dashboard</h1>
        <p>Review, verify, and allocate credits for waste deposits</p>
      </section>

      <div className="container">
        {summary && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value" style={{ color: "#ff9800" }}>
                {summary.pending}
              </div>
              <div className="stat-label">Pending Verification</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: "#4caf50" }}>
                {summary.verified}
              </div>
              <div className="stat-label">Verified</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: "#f44336" }}>
                {summary.rejected}
              </div>
              <div className="stat-label">Rejected</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{summary.total}</div>
              <div className="stat-label">Total Deposits</div>
            </div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
            borderBottom: "2px solid #e0e0e0",
          }}
        >
          <button
            onClick={() => {
              setActiveTab("pending");
              setStatusFilter("pending");
              setPage(1);
            }}
            style={{
              padding: "1rem 2rem",
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              borderBottom:
                activeTab === "pending" ? "3px solid #7cb342" : "none",
              fontWeight: activeTab === "pending" ? "bold" : "normal",
              color: activeTab === "pending" ? "#7cb342" : "#757575",
            }}
          >
            Pending Deposits
          </button>
          <button
            onClick={() => setActiveTab("summary")}
            style={{
              padding: "1rem 2rem",
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              borderBottom:
                activeTab === "summary" ? "3px solid #7cb342" : "none",
              fontWeight: activeTab === "summary" ? "bold" : "normal",
              color: activeTab === "summary" ? "#7cb342" : "#757575",
            }}
          >
            Summary
          </button>
        </div>

        {activeTab === "pending" && (
          <div>
            <h2 style={{ marginBottom: "2rem" }}>
              Pending Deposits for Verification
            </h2>
            {deposits.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  backgroundColor: "#f9f9e8",
                  borderRadius: "10px",
                }}
              >
                <p style={{ fontSize: "1.1rem", color: "#666" }}>
                  No pending deposits to review
                </p>
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: "grid",
                    gap: "1.5rem",
                    marginBottom: "2rem",
                  }}
                >
                  {deposits.map((deposit) => (
                    <div
                      key={deposit._id}
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "1.5rem",
                        backgroundColor:
                          selectedDeposit?._id === deposit._id
                            ? "#f0f7ff"
                            : "#fff",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onClick={() =>
                        setSelectedDeposit(
                          selectedDeposit?._id === deposit._id ? null : deposit
                        )
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "1rem",
                        }}
                      >
                        <div>
                          <h3
                            style={{
                              margin: "0 0 0.5rem 0",
                              fontSize: "1.2rem",
                            }}
                          >
                            User: {deposit.userId?.name || "Unknown User"}
                          </h3>
                          <p
                            style={{
                              margin: "0.25rem 0",
                              color: "#666",
                              fontSize: "0.9rem",
                            }}
                          >
                            Email: {deposit.userId?.email || "N/A"}
                          </p>
                          <p
                            style={{
                              margin: "0.25rem 0",
                              color: "#666",
                              fontSize: "0.9rem",
                            }}
                          >
                            Hub: {deposit.wasteHubId?.name || "Unknown Hub"}
                          </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={getStatusBadgeStyle(deposit.status)}>
                            {deposit.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "2rem",
                          marginBottom: "1rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <div>
                          <span style={{ color: "#666", fontSize: "0.9rem" }}>
                            Waste Type
                          </span>
                          <p
                            style={{
                              margin: "0.5rem 0 0 0",
                              padding: "0.5rem 1rem",
                              backgroundColor: getWasteTypeColor(
                                deposit.wasteType
                              ),
                              color: "#fff",
                              borderRadius: "5px",
                              fontWeight: "bold",
                              display: "inline-block",
                            }}
                          >
                            {deposit.wasteType.toUpperCase()}
                          </p>
                        </div>
                        <div>
                          <span style={{ color: "#666", fontSize: "0.9rem" }}>
                            Amount
                          </span>
                          <p
                            style={{
                              margin: "0.5rem 0 0 0",
                              fontSize: "1.3rem",
                              fontWeight: "bold",
                            }}
                          >
                            {deposit.amount} kg
                          </p>
                        </div>
                        <div>
                          <span style={{ color: "#666", fontSize: "0.9rem" }}>
                            Estimated Credits
                          </span>
                          <p
                            style={{
                              margin: "0.5rem 0 0 0",
                              fontSize: "1.3rem",
                              fontWeight: "bold",
                              color: "#7cb342",
                            }}
                          >
                            {deposit.estimatedCredits}
                          </p>
                        </div>
                      </div>

                      {deposit.description && (
                        <div
                          style={{
                            marginBottom: "1rem",
                            padding: "1rem",
                            backgroundColor: "#f5f5f5",
                            borderRadius: "5px",
                          }}
                        >
                          <strong>Description:</strong> {deposit.description}
                        </div>
                      )}

                      <p
                        style={{
                          margin: "0.5rem 0 0 0",
                          color: "#999",
                          fontSize: "0.85rem",
                        }}
                      >
                        Registered:{" "}
                        {new Date(deposit.createdAt).toLocaleString()}
                      </p>

                      {selectedDeposit?._id === deposit._id && (
                        <div
                          style={{
                            marginTop: "2rem",
                            borderTop: "2px solid #e0e0e0",
                            paddingTop: "2rem",
                          }}
                        >
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: "2rem",
                            }}
                          >
                            {/* Verify Section */}
                            <div
                              style={{
                                padding: "1.5rem",
                                backgroundColor: "#d4edda",
                                borderRadius: "10px",
                              }}
                            >
                              <h4 style={{ marginTop: 0, color: "#155724" }}>
                                ✅ Verify Deposit
                              </h4>
                              <div style={{ marginBottom: "1rem" }}>
                                <label
                                  style={{
                                    display: "block",
                                    marginBottom: "0.5rem",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Credits to Allocate (default:{" "}
                                  {deposit.estimatedCredits})
                                </label>
                                <input
                                  type="number"
                                  value={customCredits}
                                  onChange={(e) =>
                                    setCustomCredits(e.target.value)
                                  }
                                  placeholder={deposit.estimatedCredits.toString()}
                                  style={{
                                    width: "100%",
                                    padding: "0.7rem",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                    boxSizing: "border-box",
                                  }}
                                />
                              </div>
                              <button
                                onClick={() => handleVerify(deposit._id)}
                                disabled={verificationLoading}
                                style={{
                                  width: "100%",
                                  padding: "0.8rem",
                                  backgroundColor: "#28a745",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "5px",
                                  cursor: verificationLoading
                                    ? "not-allowed"
                                    : "pointer",
                                  fontWeight: "bold",
                                  opacity: verificationLoading ? 0.6 : 1,
                                }}
                              >
                                {verificationLoading
                                  ? "Processing..."
                                  : "Verify & Allocate Credits"}
                              </button>
                            </div>

                            {/* Reject Section */}
                            <div
                              style={{
                                padding: "1.5rem",
                                backgroundColor: "#f8d7da",
                                borderRadius: "10px",
                              }}
                            >
                              <h4 style={{ marginTop: 0, color: "#721c24" }}>
                                ❌ Reject Deposit
                              </h4>
                              <div style={{ marginBottom: "1rem" }}>
                                <label
                                  style={{
                                    display: "block",
                                    marginBottom: "0.5rem",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Rejection Reason
                                </label>
                                <textarea
                                  value={rejectionReason}
                                  onChange={(e) =>
                                    setRejectionReason(e.target.value)
                                  }
                                  placeholder="Explain why this deposit is being rejected..."
                                  style={{
                                    width: "100%",
                                    padding: "0.7rem",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                    boxSizing: "border-box",
                                    minHeight: "80px",
                                    fontFamily: "inherit",
                                    fontSize: "0.95rem",
                                  }}
                                />
                              </div>
                              <button
                                onClick={() => handleReject(deposit._id)}
                                disabled={verificationLoading}
                                style={{
                                  width: "100%",
                                  padding: "0.8rem",
                                  backgroundColor: "#dc3545",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "5px",
                                  cursor: verificationLoading
                                    ? "not-allowed"
                                    : "pointer",
                                  fontWeight: "bold",
                                  opacity: verificationLoading ? 0.6 : 1,
                                }}
                              >
                                {verificationLoading
                                  ? "Processing..."
                                  : "Reject Deposit"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "1rem",
                    marginTop: "2rem",
                  }}
                >
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    style={{
                      padding: "0.7rem 1.5rem",
                      backgroundColor: page === 1 ? "#ccc" : "#7cb342",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: page === 1 ? "not-allowed" : "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    ← Previous
                  </button>
                  <span
                    style={{
                      padding: "0.7rem 1.5rem",
                      alignSelf: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    style={{
                      padding: "0.7rem 1.5rem",
                      backgroundColor: page === totalPages ? "#ccc" : "#7cb342",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: page === totalPages ? "not-allowed" : "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Next →
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "summary" && summary && (
          <div>
            <h2 style={{ marginBottom: "2rem" }}>Deposit Statistics</h2>
            <div className="stats-grid" style={{ marginTop: "2rem" }}>
              <div className="card">
                <h3 style={{ color: "#ff9800", marginTop: 0 }}>Pending</h3>
                <p
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    margin: 0,
                    color: "#ff9800",
                  }}
                >
                  {summary.pending}
                </p>
                <p style={{ color: "#666", margin: "0.5rem 0 0 0" }}>
                  deposits awaiting verification
                </p>
              </div>

              <div className="card">
                <h3 style={{ color: "#4caf50", marginTop: 0 }}>Verified</h3>
                <p
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    margin: 0,
                    color: "#4caf50",
                  }}
                >
                  {summary.verified}
                </p>
                <p style={{ color: "#666", margin: "0.5rem 0 0 0" }}>
                  deposits successfully verified
                </p>
              </div>

              <div className="card">
                <h3 style={{ color: "#f44336", marginTop: 0 }}>Rejected</h3>
                <p
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    margin: 0,
                    color: "#f44336",
                  }}
                >
                  {summary.rejected}
                </p>
                <p style={{ color: "#666", margin: "0.5rem 0 0 0" }}>
                  deposits rejected
                </p>
              </div>

              <div className="card">
                <h3 style={{ marginTop: 0 }}>Total</h3>
                <p
                  style={{ fontSize: "2.5rem", fontWeight: "bold", margin: 0 }}
                >
                  {summary.total}
                </p>
                <p style={{ color: "#666", margin: "0.5rem 0 0 0" }}>
                  total deposits
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDepositVerification;
