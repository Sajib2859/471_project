import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config";

const API_BASE = API_BASE_URL;

interface Auction {
  _id: string;
  title: string;
  materialType: string;
  startTime: string;
  endTime: string;
  startingBid: number;
  currentBid: number;
  status: "scheduled" | "live" | "completed" | "cancelled";
  createdAt: string;
}

const AdminAuctionHistory: React.FC = () => {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    id: string;
  }>({
    show: false,
    id: "",
  });

  const [editModal, setEditModal] = useState<{
    show: boolean;
    auction: Auction | null;
  }>({
    show: false,
    auction: null,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "scheduled" | "live" | "completed" | "cancelled"
  >("all");
  const [sortBy, setSortBy] = useState<"date" | "bids" | "highestBid">("date");

  // Fetch auctions on component mount
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get(`${API_BASE}/auctions`);
        if (response.data.success) {
          // Transform API data to match UI interface
          const transformedAuctions = response.data.data.map(
            (auction: any) => ({
              _id: auction._id,
              title: auction.title,
              materialType: auction.materialType,
              startTime: auction.startTime,
              endTime: auction.endTime,
              startingBid: auction.startingBid,
              currentBid: auction.currentBid,
              status: auction.status,
              createdAt: auction.createdAt,
            })
          );
          setAuctions(transformedAuctions);
        } else {
          console.error("Failed to load auctions");
        }
      } catch (err: any) {
        console.error(err.message || "Error fetching auctions");
        // Fall back to empty array if API fails
        setAuctions([]);
      }
    };

    fetchAuctions();
  }, []);

  // Filter and sort auctions
  const filteredAuctions = useMemo(() => {
    let result = auctions.filter((auction) => {
      const matchesSearch = auction.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || auction.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sort
    if (sortBy === "date") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortBy === "bids") {
      result.sort(
        (a, b) => b.currentBid - b.startingBid - (a.currentBid - a.startingBid)
      );
    } else if (sortBy === "highestBid") {
      result.sort((a, b) => b.currentBid - a.currentBid);
    }

    return result;
  }, [auctions, searchTerm, statusFilter, sortBy]);

  const getStatusBadgeColor = (
    status: "scheduled" | "live" | "completed" | "cancelled"
  ) => {
    switch (status) {
      case "live":
        return { backgroundColor: "#c8e6c9", color: "#2e7d32" };
      case "completed":
        return { backgroundColor: "#bbdefb", color: "#1565c0" };
      case "scheduled":
        return { backgroundColor: "#ffe0b2", color: "#e65100" };
      case "cancelled":
        return { backgroundColor: "#ffcdd2", color: "#c62828" };
    }
  };

  const getWasteTypeColor = (wasteType: string) => {
    const colors: { [key: string]: string } = {
      plastic: "#42a5f5",
      glass: "#ab47bc",
      paper: "#d32f2f",
      metal: "#9ccc65",
      organic: "#8d6e63",
      electronic: "#ffa726",
      textile: "#ec407a",
      hazardous: "#ef5350",
    };
    return colors[wasteType] || "#757575";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Delete handlers
  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ show: true, id });
  };

  const confirmDelete = async () => {
    try {
      const id = deleteConfirm.id;
      await axios.delete(`${API_BASE}/auctions/${id}`);
      setAuctions((prev) => prev.filter((a) => a._id !== id));
      setDeleteConfirm({ show: false, id: "" });
    } catch (err: any) {
      console.error(err.response?.data?.message || "Error deleting auction");
      setDeleteConfirm({ show: false, id: "" });
    }
  };

  // Edit handlers
  const handleEditClick = (auction: Auction) => {
    setEditModal({ show: true, auction });
  };

  const handleEditChange = (field: string, value: any) => {
    setEditModal((prev) => ({
      show: prev.show,
      auction: prev.auction
        ? { ...prev.auction, [field]: value }
        : prev.auction,
    }));
  };

  const submitEdit = async () => {
    if (!editModal.auction) return;
    const a = editModal.auction;
    try {
      const payload = {
        auctionName: a.title,
        wasteType: a.materialType,
        startDate: a.startTime,
        endDate: a.endTime,
        startingPrice: a.startingBid,
      };
      const res = await axios.put(`${API_BASE}/auctions/${a._id}`, payload);
      if (res.data.success) {
        setAuctions((prev) =>
          prev.map((item) => (item._id === a._id ? res.data.data : item))
        );
        setEditModal({ show: false, auction: null });
      }
    } catch (err: any) {
      console.error(err.response?.data?.message || "Error updating auction");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          padding: "30px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#333" }}>
            📜 Auction History
          </h1>
          <button
            onClick={() => navigate("/admin-dashboard")}
            style={{
              padding: "8px 16px",
              backgroundColor: "#f5f5f5",
              color: "#666",
              border: "1px solid #ddd",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#eee";
              e.currentTarget.style.color = "#333";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#f5f5f5";
              e.currentTarget.style.color = "#666";
            }}
          >
            ← Back
          </button>
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginBottom: "25px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {/* Search */}
          <input
            type="text"
            placeholder="Search auction name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "10px 12px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              fontSize: "14px",
              flex: "1",
              minWidth: "250px",
              transition: "all 0.3s ease",
              boxSizing: "border-box",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#1976d2";
              e.currentTarget.style.boxShadow =
                "0 0 0 2px rgba(25, 118, 210, 0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#ddd";
              e.currentTarget.style.boxShadow = "none";
            }}
          />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as
                  | "all"
                  | "scheduled"
                  | "live"
                  | "completed"
                  | "cancelled"
              )
            }
            style={{
              padding: "10px 12px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              fontSize: "14px",
              backgroundColor: "white",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#1976d2";
              e.currentTarget.style.boxShadow =
                "0 0 0 2px rgba(25, 118, 210, 0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#ddd";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <option value="all">All Status</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
            <option value="scheduled">Scheduled</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "date" | "bids" | "highestBid")
            }
            style={{
              padding: "10px 12px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              fontSize: "14px",
              backgroundColor: "white",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#1976d2";
              e.currentTarget.style.boxShadow =
                "0 0 0 2px rgba(25, 118, 210, 0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#ddd";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <option value="date">Sort by Date</option>
            <option value="bids">Sort by Bids</option>
            <option value="highestBid">Sort by Highest Bid</option>
          </select>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              padding: "16px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              borderLeft: "4px solid #1976d2",
            }}
          >
            <p style={{ fontSize: "12px", color: "#666", margin: "0 0 4px 0" }}>
              Total Auctions
            </p>
            <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0" }}>
              {auctions.length}
            </p>
          </div>
          <div
            style={{
              padding: "16px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              borderLeft: "4px solid #c8e6c9",
            }}
          >
            <p style={{ fontSize: "12px", color: "#666", margin: "0 0 4px 0" }}>
              Live
            </p>
            <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0" }}>
              {auctions.filter((a) => a.status === "live").length}
            </p>
          </div>
          <div
            style={{
              padding: "16px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              borderLeft: "4px solid #bbdefb",
            }}
          >
            <p style={{ fontSize: "12px", color: "#666", margin: "0 0 4px 0" }}>
              Completed
            </p>
            <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0" }}>
              {auctions.filter((a) => a.status === "completed").length}
            </p>
          </div>
          <div
            style={{
              padding: "16px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              borderLeft: "4px solid #ffe0b2",
            }}
          >
            <p style={{ fontSize: "12px", color: "#666", margin: "0 0 4px 0" }}>
              Scheduled
            </p>
            <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0" }}>
              {auctions.filter((a) => a.status === "scheduled").length}
            </p>
          </div>
        </div>

        {/* Results Count */}
        <p
          style={{
            fontSize: "13px",
            color: "#666",
            marginBottom: "16px",
            fontWeight: "500",
          }}
        >
          Showing {filteredAuctions.length} of {auctions.length} auctions
        </p>

        {/* Auctions Table */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#f9f9f9",
                  borderBottom: "2px solid #ddd",
                }}
              >
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  Auction Name
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  Waste Type
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  Bids
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  Highest Bid
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  Start Date
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  End Date
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  Start Price
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  Created
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAuctions.length > 0 ? (
                filteredAuctions.map((auction) => (
                  <tr
                    key={auction._id}
                    style={{
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px",
                        color: "#333",
                        fontWeight: "500",
                      }}
                    >
                      {auction.title}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        color: "#666",
                      }}
                    >
                      <span
                        style={{
                          padding: "4px 8px",
                          backgroundColor: getWasteTypeColor(
                            auction.materialType
                          ),
                          color: "white",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        {auction.materialType.charAt(0).toUpperCase() +
                          auction.materialType.slice(1)}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        color: "#666",
                      }}
                    >
                      <span
                        style={{
                          padding: "6px 12px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "600",
                          ...getStatusBadgeColor(auction.status),
                        }}
                      >
                        {auction.status.charAt(0).toUpperCase() +
                          auction.status.slice(1)}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        color: "#666",
                        fontWeight: "500",
                      }}
                    >
                      {Math.max(
                        0,
                        Math.ceil(auction.currentBid - auction.startingBid)
                      )}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        color: "#333",
                        fontWeight: "600",
                      }}
                    >
                      ${auction.currentBid.toFixed(2)}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        color: "#666",
                        fontWeight: "500",
                      }}
                    >
                      {formatDate(auction.startTime)}
                      <br />
                      <span style={{ fontSize: "12px", color: "#999" }}>
                        {formatTime(auction.startTime)}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        color: "#666",
                        fontWeight: "500",
                      }}
                    >
                      {formatDate(auction.endTime)}
                      <br />
                      <span style={{ fontSize: "12px", color: "#999" }}>
                        {formatTime(auction.endTime)}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        color: "#666",
                      }}
                    >
                      ${auction.startingBid.toFixed(2)}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        color: "#666",
                        fontSize: "13px",
                      }}
                    >
                      {formatDate(auction.createdAt)}
                      <br />
                      <span style={{ fontSize: "12px", color: "#999" }}>
                        {formatTime(auction.createdAt)}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        color: "#666",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          style={{
                            padding: "6px 10px",
                            backgroundColor: "#ff9800",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                          onClick={() => handleEditClick(auction)}
                        >
                          Edit
                        </button>
                        <button
                          style={{
                            padding: "6px 10px",
                            backgroundColor: "#f44336",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                          onClick={() => handleDeleteClick(auction._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: "32px 12px",
                      textAlign: "center",
                      color: "#999",
                    }}
                  >
                    No auctions found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm.show && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: "1.5rem",
                borderRadius: "8px",
                maxWidth: "420px",
                width: "90%",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Confirm Delete</h3>
              <p>
                Are you sure you want to delete this auction? This action cannot
                be undone.
              </p>
              <div style={{ display: "flex", gap: "8px", marginTop: "1rem" }}>
                <button
                  onClick={confirmDelete}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm({ show: false, id: "" })}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#eee",
                    color: "#333",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editModal.show && editModal.auction && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: "1.25rem",
                borderRadius: "8px",
                width: "520px",
                maxWidth: "95%",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Edit Auction</h3>
              <div style={{ display: "grid", gap: "8px" }}>
                <label>
                  Auction Name
                  <input
                    type="text"
                    value={editModal.auction.title}
                    onChange={(e) => handleEditChange("title", e.target.value)}
                    style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                  />
                </label>
                <label>
                  Waste Type
                  <input
                    type="text"
                    value={editModal.auction.materialType}
                    onChange={(e) =>
                      handleEditChange("materialType", e.target.value)
                    }
                    style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                  />
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <label style={{ flex: 1 }}>
                    Start
                    <input
                      type="datetime-local"
                      value={new Date(editModal.auction.startTime)
                        .toISOString()
                        .slice(0, 16)}
                      onChange={(e) =>
                        handleEditChange(
                          "startTime",
                          new Date(e.target.value).toISOString()
                        )
                      }
                      style={{
                        width: "100%",
                        padding: "8px",
                        marginTop: "4px",
                      }}
                    />
                  </label>
                  <label style={{ flex: 1 }}>
                    End
                    <input
                      type="datetime-local"
                      value={new Date(editModal.auction.endTime)
                        .toISOString()
                        .slice(0, 16)}
                      onChange={(e) =>
                        handleEditChange(
                          "endTime",
                          new Date(e.target.value).toISOString()
                        )
                      }
                      style={{
                        width: "100%",
                        padding: "8px",
                        marginTop: "4px",
                      }}
                    />
                  </label>
                </div>
                <label>
                  Starting Price
                  <input
                    type="number"
                    value={editModal.auction.startingBid}
                    onChange={(e) =>
                      handleEditChange("startingBid", Number(e.target.value))
                    }
                    style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                  />
                </label>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "flex-end",
                    marginTop: "6px",
                  }}
                >
                  <button
                    onClick={() => setEditModal({ show: false, auction: null })}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#eee",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitEdit}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#1976d2",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAuctionHistory;
