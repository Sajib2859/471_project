import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:9371/api";

interface AuctionFormData {
  auctionName: string;
  wasteType: string;
  startDate: string;
  endDate: string;
  startingPrice: number;
}

const AdminCreateAuction: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AuctionFormData>({
    auctionName: "",
    wasteType: "plastic",
    startDate: "",
    endDate: "",
    startingPrice: 0,
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const wasteTypes = [
    "plastic",
    "glass",
    "paper",
    "metal",
    "organic",
    "electronic",
    "textile",
    "hazardous",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "startingPrice") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.auctionName.trim()) {
      setErrorMessage("Auction name is required");
      return false;
    }
    if (!formData.startDate) {
      setErrorMessage("Start date is required");
      return false;
    }
    if (!formData.endDate) {
      setErrorMessage("End date is required");
      return false;
    }
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setErrorMessage("End date must be after start date");
      return false;
    }
    if (formData.startingPrice <= 0) {
      setErrorMessage("Starting price must be greater than 0");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(`${API_BASE}/auctions`, formData);

      setSuccessMessage("Auction created successfully!");

      // Reset form after 2 seconds and redirect
      setTimeout(() => {
        setFormData({
          auctionName: "",
          wasteType: "plastic",
          startDate: "",
          endDate: "",
          startingPrice: 0,
        });
        navigate("/admin-auction-history");
      }, 2000);

      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      setErrorMessage(
        error.response?.data?.message || "Failed to create auction"
      );
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
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          padding: "40px",
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
            🏆 Create New Auction
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

        {/* Messages */}
        {successMessage && (
          <div
            style={{
              padding: "12px 16px",
              backgroundColor: "#d4edda",
              color: "#155724",
              borderRadius: "6px",
              marginBottom: "20px",
              border: "1px solid #c3e6cb",
            }}
          >
            ✓ {successMessage}
          </div>
        )}

        {errorMessage && (
          <div
            style={{
              padding: "12px 16px",
              backgroundColor: "#f8d7da",
              color: "#721c24",
              borderRadius: "6px",
              marginBottom: "20px",
              border: "1px solid #f5c6cb",
            }}
          >
            ✗ {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Auction Name */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#333",
                marginBottom: "8px",
              }}
            >
              Auction Name *
            </label>
            <input
              type="text"
              name="auctionName"
              value={formData.auctionName}
              onChange={handleInputChange}
              placeholder="e.g., Spring 2024 Plastic Collection"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box",
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
            />
          </div>

          {/* Waste Type */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#333",
                marginBottom: "8px",
              }}
            >
              Waste Type *
            </label>
            <select
              name="wasteType"
              value={formData.wasteType}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                backgroundColor: "white",
                cursor: "pointer",
                boxSizing: "border-box",
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
              {wasteTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#333",
                marginBottom: "8px",
              }}
            >
              Start Date *
            </label>
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box",
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
            />
          </div>

          {/* End Date */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#333",
                marginBottom: "8px",
              }}
            >
              End Date *
            </label>
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box",
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
            />
          </div>

          {/* Starting Price */}
          <div style={{ marginBottom: "30px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#333",
                marginBottom: "8px",
              }}
            >
              Starting Price (in $) *
            </label>
            <input
              type="number"
              name="startingPrice"
              value={formData.startingPrice || ""}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box",
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
            />
          </div>

          {/* Form Actions */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={() => navigate("/admin-dashboard")}
              style={{
                padding: "10px 24px",
                backgroundColor: "#f5f5f5",
                color: "#666",
                border: "1px solid #ddd",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
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
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: "10px 32px",
                backgroundColor: isLoading ? "#ccc" : "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: isLoading ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontWeight: "600",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = "#1565c0";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(25, 118, 210, 0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = "#1976d2";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              {isLoading ? "Creating..." : "Create Auction"}
            </button>
          </div>
        </form>

        {/* Form Info */}
        <div
          style={{
            marginTop: "30px",
            padding: "16px",
            backgroundColor: "#f9f9f9",
            borderRadius: "6px",
            borderLeft: "4px solid #1976d2",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              color: "#666",
              margin: "0",
              lineHeight: "1.6",
            }}
          >
            <strong>Note:</strong> All fields are required. The end date must be
            after the start date. Starting price must be greater than 0.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateAuction;
