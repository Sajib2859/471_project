import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:9371/api";
const USER_ID = "000000000000000000000004"; // Regular user from seed data

interface WasteHub {
  _id: string;
  name: string;
  location: { address: string; city: string };
  status: string;
}

interface Deposit {
  _id: string;
  wasteType: string;
  amount: number;
  status: "pending" | "verified" | "rejected";
  estimatedCredits: number;
  wasteHubId: { name: string };
  createdAt: string;
}

interface DepositSummary {
  pending: number;
  verified: number;
  rejected: number;
}

const DepositManagement: React.FC = () => {
  const [wasteHubs, setWasteHubs] = useState<WasteHub[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"register" | "history">(
    "register"
  );
  const [summary, setSummary] = useState<DepositSummary | null>(null);

  // Form state
  const [selectedHub, setSelectedHub] = useState("");
  const [wasteType, setWasteType] = useState("plastic");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const WASTE_TYPES = [
    "plastic",
    "glass",
    "paper",
    "metal",
    "organic",
    "electronic",
    "textile",
    "hazardous",
  ];
  const CREDIT_RATES: Record<string, number> = {
    plastic: 2.5,
    glass: 3.0,
    paper: 1.5,
    metal: 4.0,
    organic: 0.5,
    electronic: 8.0,
    textile: 2.0,
    hazardous: 5.0,
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hubsRes, depositsRes] = await Promise.all([
        axios.get(`${API_BASE}/waste-hubs`),
        axios.get(`${API_BASE}/users/${USER_ID}/deposits`),
      ]);

      setWasteHubs(hubsRes.data.data);
      setDeposits(depositsRes.data.data);
      setSummary(depositsRes.data.summary);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateEstimatedCredits = (type: string, amt: string): number => {
    if (!amt) return 0;
    const rate = CREDIT_RATES[type] || 1;
    return Math.round(rate * parseFloat(amt) * 100) / 100;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedHub || !amount) {
      alert("Please select a waste hub and enter amount");
      return;
    }

    try {
      setFormLoading(true);
      const res = await axios.post(`${API_BASE}/deposits`, {
        userId: USER_ID,
        wasteHubId: selectedHub,
        wasteType,
        amount: parseFloat(amount),
        description,
        photoUrl,
      });

      alert(
        `✅ Deposit registered successfully! Estimated credits: ${res.data.data.estimatedCredits}`
      );

      // Reset form
      setSelectedHub("");
      setWasteType("plastic");
      setAmount("");
      setDescription("");
      setPhotoUrl("");

      // Refresh data
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || "Error registering deposit");
    } finally {
      setFormLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "pending":
        return "#ff9800";
      case "verified":
        return "#4caf50";
      case "rejected":
        return "#f44336";
      default:
        return "#757575";
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

  if (loading) {
    return <div className="loading">Loading deposit information...</div>;
  }

  return (
    <>
      <section className="hero">
        <h1>♻️ Register & Track Deposits</h1>
        <p>Register your waste deposits and earn eco-credits</p>
      </section>

      <div className="container">
        {summary && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value" style={{ color: "#ff9800" }}>
                {summary.pending}
              </div>
              <div className="stat-label">Pending Review</div>
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
            onClick={() => setActiveTab("register")}
            style={{
              padding: "1rem 2rem",
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              borderBottom:
                activeTab === "register" ? "3px solid #7cb342" : "none",
              fontWeight: activeTab === "register" ? "bold" : "normal",
              color: activeTab === "register" ? "#7cb342" : "#757575",
            }}
          >
            Register Deposit
          </button>
          <button
            onClick={() => setActiveTab("history")}
            style={{
              padding: "1rem 2rem",
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              borderBottom:
                activeTab === "history" ? "3px solid #7cb342" : "none",
              fontWeight: activeTab === "history" ? "bold" : "normal",
              color: activeTab === "history" ? "#7cb342" : "#757575",
            }}
          >
            Deposit History
          </button>
        </div>

        {activeTab === "register" && (
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h2 style={{ marginBottom: "2rem" }}>Register New Waste Deposit</h2>
            <form
              onSubmit={handleSubmit}
              style={{
                backgroundColor: "#f9f9e8",
                padding: "2rem",
                borderRadius: "10px",
              }}
            >
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "bold",
                  }}
                >
                  Select Waste Hub *
                </label>
                <select
                  value={selectedHub}
                  onChange={(e) => setSelectedHub(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    boxSizing: "border-box",
                    fontSize: "1rem",
                  }}
                >
                  <option value="">-- Select a Waste Hub --</option>
                  {wasteHubs.map((hub) => (
                    <option key={hub._id} value={hub._id}>
                      {hub.name} ({hub.location.city})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "bold",
                  }}
                >
                  Waste Type *
                </label>
                <select
                  value={wasteType}
                  onChange={(e) => setWasteType(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    boxSizing: "border-box",
                    fontSize: "1rem",
                  }}
                >
                  {WASTE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)} (
                      {CREDIT_RATES[type]} credits/kg)
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "bold",
                  }}
                >
                  Amount (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount in kilograms"
                  required
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    boxSizing: "border-box",
                    fontSize: "1rem",
                  }}
                />
                {amount && (
                  <p
                    style={{
                      margin: "0.5rem 0 0 0",
                      color: "#7cb342",
                      fontWeight: "bold",
                    }}
                  >
                    Estimated Credits:{" "}
                    {calculateEstimatedCredits(wasteType, amount)}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "bold",
                  }}
                >
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add any details about the waste..."
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    boxSizing: "border-box",
                    fontSize: "1rem",
                    minHeight: "100px",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "bold",
                  }}
                >
                  Photo URL (Optional)
                </label>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    boxSizing: "border-box",
                    fontSize: "1rem",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={formLoading}
                style={{
                  width: "100%",
                  padding: "1rem",
                  backgroundColor: "#7cb342",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: formLoading ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  opacity: formLoading ? 0.6 : 1,
                }}
              >
                {formLoading ? "Registering..." : "Register Deposit"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "history" && (
          <div>
            <h2 style={{ marginBottom: "2rem" }}>Your Deposit History</h2>
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
                  No deposits registered yet
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "1.5rem" }}>
                {deposits.map((deposit) => (
                  <div
                    key={deposit._id}
                    style={{
                      border: `2px solid ${getStatusColor(deposit.status)}`,
                      borderRadius: "10px",
                      padding: "1.5rem",
                      backgroundColor: "#fff",
                      transition: "all 0.3s ease",
                    }}
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
                        <h3 style={{ margin: "0 0 0.5rem 0" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "0.4rem 1rem",
                              backgroundColor: getWasteTypeColor(
                                deposit.wasteType
                              ),
                              color: "#fff",
                              borderRadius: "20px",
                              fontSize: "0.9rem",
                              fontWeight: "bold",
                              marginRight: "0.5rem",
                            }}
                          >
                            {deposit.wasteType.toUpperCase()}
                          </span>
                          {deposit.amount} kg at {deposit.wasteHubId.name}
                        </h3>
                      </div>
                      <div
                        style={{
                          padding: "0.6rem 1.2rem",
                          backgroundColor: getStatusColor(deposit.status),
                          color: "#fff",
                          borderRadius: "20px",
                          fontWeight: "bold",
                          textTransform: "capitalize",
                          fontSize: "0.9rem",
                        }}
                      >
                        {deposit.status}
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
                      <div>
                        <span style={{ color: "#666", fontSize: "0.9rem" }}>
                          Registered
                        </span>
                        <p
                          style={{
                            margin: "0.5rem 0 0 0",
                            fontSize: "0.95rem",
                            fontWeight: "bold",
                          }}
                        >
                          {new Date(deposit.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {deposit.status === "rejected" && (
                      <div
                        style={{
                          padding: "1rem",
                          backgroundColor: "#ffe0e0",
                          borderLeft: "4px solid #f44336",
                          borderRadius: "5px",
                          marginTop: "1rem",
                        }}
                      >
                        <strong style={{ color: "#f44336" }}>
                          Rejection Reason:
                        </strong>
                        <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>
                          Contact admin for details
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default DepositManagement;
