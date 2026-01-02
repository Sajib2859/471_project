import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

const API_URL = API_BASE_URL;

interface Campaign {
  _id: string;
  title: string;
  description: string;
  campaignType: string;
  location: string;
  startDate: string;
  endDate: string;
  status: string;
  progress: number;
  maxParticipants?: number;
  participants: any[];
  volunteers: any[];
  followers: any[];
  goals: string[];
  achievements: string[];
  organizer: any;
}

const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: "", type: "" });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [userCampaigns, setUserCampaigns] = useState<any>(null);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [newCampaign, setNewCampaign] = useState({
    title: "",
    description: "",
    campaignType: "cleanup",
    location: "",
    startDate: "",
    endDate: "",
    maxParticipants: "",
    goals: "",
  });

  useEffect(() => {
    fetchCampaigns();
    if (user) {
      fetchUserCampaigns();
    }
  }, [filter]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter.status) params.append("status", filter.status);
      if (filter.type) params.append("campaignType", filter.type);

      const response = await axios.get(`${API_URL}/campaigns?${params}`);
      setCampaigns(response.data.data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCampaigns = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/${user._id}/campaigns`);
      setUserCampaigns(response.data.data);
    } catch (error) {
      console.error("Error fetching user campaigns:", error);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const campaignData = {
        ...newCampaign,
        maxParticipants: newCampaign.maxParticipants
          ? parseInt(newCampaign.maxParticipants)
          : undefined,
        goals: newCampaign.goals.split(",").map((g) => g.trim()),
        createdBy: user._id,
      };

      await axios.post(`${API_URL}/campaigns`, campaignData);
      alert("Campaign created successfully!");
      setShowCreateForm(false);
      fetchCampaigns();
      setNewCampaign({
        title: "",
        description: "",
        campaignType: "cleanup",
        location: "",
        startDate: "",
        endDate: "",
        maxParticipants: "",
        goals: "",
      });
    } catch (error: any) {
      alert(error.response?.data?.message || "Error creating campaign");
    }
  };

  const handleVolunteer = async (campaignId: string) => {
    if (!user) {
      alert("Please login to volunteer");
      return;
    }
    try {
      await axios.post(`${API_URL}/campaigns/${campaignId}/volunteer`, {
        userId: user._id,
      });
      alert("Successfully volunteered for campaign!");
      fetchCampaigns();
      fetchUserCampaigns();
    } catch (error: any) {
      alert(error.response?.data?.message || "Error volunteering");
    }
  };

  const handleFollow = async (campaignId: string) => {
    if (!user) {
      alert("Please login to follow");
      return;
    }
    try {
      await axios.post(`${API_URL}/campaigns/${campaignId}/follow`, {
        userId: user._id,
      });
      alert("Successfully following campaign!");
      fetchCampaigns();
      fetchUserCampaigns();
    } catch (error: any) {
      alert(error.response?.data?.message || "Error following campaign");
    }
  };

  const isVolunteered = (campaign: Campaign) => {
    return campaign.volunteers.some((v: any) => v === user?._id || v._id === user?._id);
  };

  const isFollowing = (campaign: Campaign) => {
    return campaign.followers.some((f: any) => f === user?._id || f._id === user?._id);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          🌍 Campaigns & Cleanup Drives
        </h1>
        <p style={{ color: "#666", marginBottom: "1rem" }}>
          Join community-driven campaigns to make a difference in waste management
        </p>

        {user?.role === "admin" && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem",
              marginBottom: "1rem",
            }}
          >
            {showCreateForm ? "Cancel" : "➕ Create New Campaign"}
          </button>
        )}

        {showCreateForm && (
          <div
            style={{
              backgroundColor: "#f9f9f9",
              padding: "2rem",
              borderRadius: "12px",
              marginBottom: "2rem",
            }}
          >
            <h2 style={{ marginBottom: "1rem" }}>Create New Campaign</h2>
            <form onSubmit={handleCreateCampaign}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>
                  Campaign Title *
                </label>
                <input
                  type="text"
                  value={newCampaign.title}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, title: e.target.value })
                  }
                  required
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
                  value={newCampaign.description}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, description: e.target.value })
                  }
                  required
                  rows={4}
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
                    Campaign Type *
                  </label>
                  <select
                    value={newCampaign.campaignType}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, campaignType: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                  >
                    <option value="cleanup">Cleanup</option>
                    <option value="waste-management">Waste Management</option>
                    <option value="awareness">Awareness</option>
                    <option value="recycling">Recycling</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem" }}>
                    Location *
                  </label>
                  <input
                    type="text"
                    value={newCampaign.location}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, location: e.target.value })
                    }
                    required
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
                    Start Date *
                  </label>
                  <input
                    type="datetime-local"
                    value={newCampaign.startDate}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, startDate: e.target.value })
                    }
                    required
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
                    End Date *
                  </label>
                  <input
                    type="datetime-local"
                    value={newCampaign.endDate}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, endDate: e.target.value })
                    }
                    required
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
                    Max Participants
                  </label>
                  <input
                    type="number"
                    value={newCampaign.maxParticipants}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, maxParticipants: e.target.value })
                    }
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
                    Goals (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newCampaign.goals}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, goals: e.target.value })
                    }
                    placeholder="Collect 500kg waste, 100 volunteers"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: "1rem",
                  padding: "0.75rem 2rem",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                Create Campaign
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
            <option value="scheduled">Scheduled</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            style={{
              padding: "0.5rem",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          >
            <option value="">All Types</option>
            <option value="cleanup">Cleanup</option>
            <option value="waste-management">Waste Management</option>
            <option value="awareness">Awareness</option>
            <option value="recycling">Recycling</option>
          </select>
        </div>
      </div>

      {/* User's Campaigns Section */}
      {user && userCampaigns && (
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ marginBottom: "1rem" }}>Your Campaigns</h2>
          <div style={{ display: "flex", gap: "1rem" }}>
            <div
              style={{
                padding: "1rem",
                backgroundColor: "#e3f2fd",
                borderRadius: "8px",
                flex: 1,
              }}
            >
              <h3 style={{ marginBottom: "0.5rem" }}>Volunteered</h3>
              <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#1976d2" }}>
                {userCampaigns.volunteeredCount}
              </p>
            </div>
            <div
              style={{
                padding: "1rem",
                backgroundColor: "#f3e5f5",
                borderRadius: "8px",
                flex: 1,
              }}
            >
              <h3 style={{ marginBottom: "0.5rem" }}>Following</h3>
              <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#7b1fa2" }}>
                {userCampaigns.followingCount}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Campaigns List */}
      {loading ? (
        <p>Loading campaigns...</p>
      ) : campaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        <div style={{ display: "grid", gap: "1.5rem" }}>
          {campaigns.map((campaign) => (
            <div
              key={campaign._id}
              style={{
                backgroundColor: "white",
                padding: "1.5rem",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                  {campaign.title}
                </h3>
                <span
                  style={{
                    padding: "0.25rem 0.75rem",
                    borderRadius: "20px",
                    fontSize: "0.875rem",
                    backgroundColor:
                      campaign.status === "completed"
                        ? "#c8e6c9"
                        : campaign.status === "ongoing"
                        ? "#fff9c4"
                        : "#e3f2fd",
                    color:
                      campaign.status === "completed"
                        ? "#2e7d32"
                        : campaign.status === "ongoing"
                        ? "#f57f17"
                        : "#1565c0",
                  }}
                >
                  {campaign.status.toUpperCase()}
                </span>
              </div>

              <p style={{ color: "#666", marginBottom: "1rem" }}>
                {campaign.description}
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
                  <strong>📍 Location:</strong> {campaign.location}
                </div>
                <div>
                  <strong>🏷️ Type:</strong> {campaign.campaignType}
                </div>
                <div>
                  <strong>📅 Start:</strong>{" "}
                  {new Date(campaign.startDate).toLocaleDateString()}
                </div>
                <div>
                  <strong>📅 End:</strong>{" "}
                  {new Date(campaign.endDate).toLocaleDateString()}
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <strong>Progress: {campaign.progress}%</strong>
                <div
                  style={{
                    width: "100%",
                    height: "10px",
                    backgroundColor: "#e0e0e0",
                    borderRadius: "5px",
                    marginTop: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      width: `${campaign.progress}%`,
                      height: "100%",
                      backgroundColor: "#4CAF50",
                      borderRadius: "5px",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  marginBottom: "1rem",
                  fontSize: "0.9rem",
                  color: "#666",
                }}
              >
                <span>👥 Volunteers: {campaign.volunteers.length}</span>
                <span>👁️ Followers: {campaign.followers.length}</span>
                {campaign.maxParticipants && (
                  <span>📊 Max: {campaign.maxParticipants}</span>
                )}
              </div>

              {campaign.goals.length > 0 && (
                <div style={{ marginBottom: "1rem" }}>
                  <strong>Goals:</strong>
                  <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
                    {campaign.goals.map((goal, idx) => (
                      <li key={idx}>{goal}</li>
                    ))}
                  </ul>
                </div>
              )}

              {user && campaign.status !== "completed" && (
                <div style={{ display: "flex", gap: "1rem" }}>
                  {!isVolunteered(campaign) && (
                    <button
                      onClick={() => handleVolunteer(campaign._id)}
                      style={{
                        padding: "0.5rem 1.5rem",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      🙋 Volunteer
                    </button>
                  )}
                  {isVolunteered(campaign) && (
                    <span
                      style={{
                        padding: "0.5rem 1.5rem",
                        backgroundColor: "#c8e6c9",
                        color: "#2e7d32",
                        borderRadius: "8px",
                      }}
                    >
                      ✅ Volunteered
                    </span>
                  )}
                  {!isFollowing(campaign) && (
                    <button
                      onClick={() => handleFollow(campaign._id)}
                      style={{
                        padding: "0.5rem 1.5rem",
                        backgroundColor: "#2196F3",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      ➕ Follow
                    </button>
                  )}
                  {isFollowing(campaign) && (
                    <span
                      style={{
                        padding: "0.5rem 1.5rem",
                        backgroundColor: "#bbdefb",
                        color: "#1565c0",
                        borderRadius: "8px",
                      }}
                    >
                      👁️ Following
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Campaigns;
