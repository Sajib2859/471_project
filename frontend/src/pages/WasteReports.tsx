import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

const API_URL = API_BASE_URL;

interface WasteReport {
  _id: string;
  title: string;
  description: string;
  location: string;
  wasteTypes: string[];
  severity: string;
  estimatedQuantity?: number;
  unit?: string;
  photos: string[];
  status: string;
  reportedBy: any;
  upvotes: any[];
  comments: any[];
  createdAt: string;
}

const WasteReports: React.FC = () => {
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: "", severity: "" });
  const [showReportForm, setShowReportForm] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [newReport, setNewReport] = useState({
    title: "",
    description: "",
    location: "",
    wasteTypes: "",
    severity: "medium",
    estimatedQuantity: "",
    unit: "kg",
  });

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter.status) params.append("status", filter.status);
      if (filter.severity) params.append("severity", filter.severity);

      const response = await axios.get(`${API_URL}/waste-reports?${params}`);
      setReports(response.data.data);
    } catch (error) {
      console.error("Error fetching waste reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to report waste");
      return;
    }

    try {
      const reportData = {
        ...newReport,
        wasteTypes: newReport.wasteTypes.split(",").map((t) => t.trim()),
        estimatedQuantity: newReport.estimatedQuantity
          ? parseFloat(newReport.estimatedQuantity)
          : undefined,
        reportedBy: user.id || user._id,
      };

      await axios.post(`${API_URL}/waste-reports`, reportData);
      alert("Waste report submitted successfully!");
      setShowReportForm(false);
      fetchReports();
      setNewReport({
        title: "",
        description: "",
        location: "",
        wasteTypes: "",
        severity: "medium",
        estimatedQuantity: "",
        unit: "kg",
      });
    } catch (error: any) {
      alert(error.response?.data?.message || "Error submitting report");
    }
  };

  const handleUpvote = async (reportId: string) => {
    if (!user) {
      alert("Please login to upvote");
      return;
    }
    try {
      await axios.post(`${API_URL}/waste-reports/${reportId}/upvote`, {
        userId: user.id || user._id,
      });
      alert("Report upvoted!");
      fetchReports();
    } catch (error: any) {
      alert(error.response?.data?.message || "Error upvoting");
    }
  };

  const hasUpvoted = (report: WasteReport) => {
    return report.upvotes.some((u: any) => u === user?.id || u === user?._id || u._id === user?.id || u._id === user?._id);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return { bg: "#ffebee", color: "#c62828" };
      case "high":
        return { bg: "#fff3e0", color: "#e65100" };
      case "medium":
        return { bg: "#fff9c4", color: "#f57f17" };
      case "low":
        return { bg: "#e8f5e9", color: "#2e7d32" };
      default:
        return { bg: "#e0e0e0", color: "#424242" };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return { bg: "#c8e6c9", color: "#2e7d32" };
      case "in-progress":
        return { bg: "#fff9c4", color: "#f57f17" };
      case "verified":
        return { bg: "#bbdefb", color: "#1565c0" };
      case "pending":
        return { bg: "#ffccbc", color: "#bf360c" };
      default:
        return { bg: "#e0e0e0", color: "#424242" };
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          📍 Waste Location Reports
        </h1>
        <p style={{ color: "#666", marginBottom: "1rem" }}>
          Report locations where waste has accumulated and help keep our community clean
        </p>

        <button
          onClick={() => setShowReportForm(!showReportForm)}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#FF5722",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            marginBottom: "1rem",
          }}
        >
          {showReportForm ? "Cancel" : "🚨 Report Waste Location"}
        </button>

        {showReportForm && (
          <div
            style={{
              backgroundColor: "#f9f9f9",
              padding: "2rem",
              borderRadius: "12px",
              marginBottom: "2rem",
            }}
          >
            <h2 style={{ marginBottom: "1rem" }}>Report Waste Location</h2>
            <form onSubmit={handleSubmitReport}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>
                  Report Title *
                </label>
                <input
                  type="text"
                  value={newReport.title}
                  onChange={(e) =>
                    setNewReport({ ...newReport, title: e.target.value })
                  }
                  required
                  placeholder="e.g., Illegal dumping at Park Street"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>
                  Description *
                </label>
                <textarea
                  value={newReport.description}
                  onChange={(e) =>
                    setNewReport({ ...newReport, description: e.target.value })
                  }
                  required
                  rows={4}
                  placeholder="Describe the waste accumulation situation..."
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem" }}>
                    Location *
                  </label>
                  <input
                    type="text"
                    value={newReport.location}
                    onChange={(e) =>
                      setNewReport({ ...newReport, location: e.target.value })
                    }
                    required
                    placeholder="Address or landmark"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem" }}>
                    Waste Types (comma-separated) *
                  </label>
                  <input
                    type="text"
                    value={newReport.wasteTypes}
                    onChange={(e) =>
                      setNewReport({ ...newReport, wasteTypes: e.target.value })
                    }
                    required
                    placeholder="plastic, organic, metal"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem" }}>
                    Severity *
                  </label>
                  <select
                    value={newReport.severity}
                    onChange={(e) =>
                      setNewReport({ ...newReport, severity: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem" }}>
                    Estimated Quantity
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      type="number"
                      value={newReport.estimatedQuantity}
                      onChange={(e) =>
                        setNewReport({
                          ...newReport,
                          estimatedQuantity: e.target.value,
                        })
                      }
                      placeholder="100"
                      style={{
                        flex: 1,
                        padding: "0.75rem",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                      }}
                    />
                    <select
                      value={newReport.unit}
                      onChange={(e) =>
                        setNewReport({ ...newReport, unit: e.target.value })
                      }
                      style={{
                        padding: "0.75rem",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                      }}
                    >
                      <option value="kg">kg</option>
                      <option value="tons">tons</option>
                      <option value="bags">bags</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: "1rem",
                  padding: "0.75rem 2rem",
                  backgroundColor: "#FF5722",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                Submit Report
              </button>
            </form>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            style={{
              padding: "0.5rem",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={filter.severity}
            onChange={(e) => setFilter({ ...filter, severity: e.target.value })}
            style={{
              padding: "0.5rem",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          >
            <option value="">All Severity</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      {loading ? (
        <p>Loading reports...</p>
      ) : reports.length === 0 ? (
        <p>No waste reports found.</p>
      ) : (
        <div style={{ display: "grid", gap: "1.5rem" }}>
          {reports.map((report) => {
            const severityStyle = getSeverityColor(report.severity);
            const statusStyle = getStatusColor(report.status);

            return (
              <div
                key={report._id}
                style={{
                  backgroundColor: "white",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                  }}
                >
                  <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                    {report.title}
                  </h3>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <span
                      style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: "20px",
                        fontSize: "0.875rem",
                        backgroundColor: severityStyle.bg,
                        color: severityStyle.color,
                      }}
                    >
                      {report.severity.toUpperCase()}
                    </span>
                    <span
                      style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: "20px",
                        fontSize: "0.875rem",
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.color,
                      }}
                    >
                      {report.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <p style={{ color: "#666", marginBottom: "1rem" }}>
                  {report.description}
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <strong>📍 Location:</strong> {report.location}
                  </div>
                  <div>
                    <strong>🗑️ Waste Types:</strong> {report.wasteTypes.join(", ")}
                  </div>
                  {report.estimatedQuantity && (
                    <div>
                      <strong>⚖️ Quantity:</strong> {report.estimatedQuantity}{" "}
                      {report.unit}
                    </div>
                  )}
                  <div>
                    <strong>📅 Reported:</strong>{" "}
                    {new Date(report.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "#666" }}>
                    👍 {report.upvotes.length} upvotes
                  </span>
                  {user && !hasUpvoted(report) && (
                    <button
                      onClick={() => handleUpvote(report._id)}
                      style={{
                        padding: "0.5rem 1.5rem",
                        backgroundColor: "#2196F3",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      👍 Upvote
                    </button>
                  )}
                  {hasUpvoted(report) && (
                    <span
                      style={{
                        padding: "0.5rem 1.5rem",
                        backgroundColor: "#bbdefb",
                        color: "#1565c0",
                        borderRadius: "8px",
                      }}
                    >
                      ✅ Upvoted
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WasteReports;
