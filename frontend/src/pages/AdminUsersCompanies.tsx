import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:9371/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "company";
  creditBalance: number;
  cashBalance: number;
  createdAt: string;
}

const AdminUsersCompanies: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState<
    "all" | "user" | "company" | "admin"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    userId: string;
  }>({
    show: false,
    userId: "",
  });

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/users`);
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Error loading users from database");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleEdit = (user: User) => {
    setEditingUser({ ...user });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (editingUser) {
      try {
        await axios.put(`${API_BASE}/users/${editingUser._id}`, {
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role,
          creditBalance: editingUser.creditBalance,
          cashBalance: editingUser.cashBalance
        });
        alert("User updated successfully!");
        fetchUsers(); // Refresh the list
        setShowModal(false);
        setEditingUser(null);
      } catch (error: any) {
        alert(error.response?.data?.message || "Error updating user");
      }
    }
  };

  const handleDelete = (userId: string) => {
    setDeleteConfirm({ show: true, userId });
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/users/${deleteConfirm.userId}`);
      alert("User deleted successfully!");
      fetchUsers(); // Refresh the list
      setDeleteConfirm({ show: false, userId: "" });
    } catch (error: any) {
      alert(error.response?.data?.message || "Error deleting user");
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "#d32f2f";
      case "company":
        return "#1976d2";
      case "user":
        return "#7cb342";
      default:
        return "#757575";
    }
  };

  return (
    <>
      <section className="hero">
        <h1>👥 Users & Companies Management</h1>
        <p>View, search, and manage all registered users and companies</p>
      </section>

      <div className="container" style={{ padding: "3rem 2rem" }}>
        {/* Controls */}
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => navigate("/admin-dashboard")}
            style={{
              padding: "0.8rem 1.5rem",
              backgroundColor: "#757575",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ← Back to Dashboard
          </button>

          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: "0.8rem",
              border: "1px solid #ccc",
              borderRadius: "5px",
              fontSize: "1rem",
              minWidth: "200px",
            }}
          />

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as any)}
            style={{
              padding: "0.8rem",
              border: "1px solid #ccc",
              borderRadius: "5px",
              fontSize: "1rem",
              backgroundColor: "#fff",
              cursor: "pointer",
            }}
          >
            <option value="all">All Roles</option>
            <option value="user">Users Only</option>
            <option value="company">Companies Only</option>
            <option value="admin">Admins Only</option>
          </select>

          <div style={{ color: "#666", fontWeight: "bold" }}>
            Total: {filteredUsers.length}
          </div>
        </div>

        {/* Table */}
        <div
          style={{
            overflowX: "auto",
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.95rem",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#f5f5f5",
                  borderBottom: "2px solid #ddd",
                }}
              >
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "left",
                    fontWeight: "bold",
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "left",
                    fontWeight: "bold",
                  }}
                >
                  Email
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  Role
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "right",
                    fontWeight: "bold",
                  }}
                >
                  Credits
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "right",
                    fontWeight: "bold",
                  }}
                >
                  Cash Balance
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  style={{
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <td style={{ padding: "1rem" }}>
                    <strong>{user.name}</strong>
                  </td>
                  <td style={{ padding: "1rem", color: "#666" }}>
                    {user.email}
                  </td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>
                    <span
                      style={{
                        padding: "0.4rem 0.8rem",
                        backgroundColor: getRoleColor(user.role),
                        color: "#fff",
                        borderRadius: "20px",
                        fontSize: "0.85rem",
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "1rem",
                      textAlign: "right",
                      fontWeight: "bold",
                      color: "#7cb342",
                    }}
                  >
                    {user.creditBalance}
                  </td>
                  <td
                    style={{
                      padding: "1rem",
                      textAlign: "right",
                      fontWeight: "bold",
                      color: "#1976d2",
                    }}
                  >
                    ৳{user.cashBalance.toLocaleString()}
                  </td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>
                    <button
                      onClick={() => handleEdit(user)}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#4caf50",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        marginRight: "0.5rem",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#f44336",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {showModal && editingUser && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: "2rem",
                borderRadius: "10px",
                maxWidth: "500px",
                width: "90%",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              }}
            >
              <h2 style={{ marginBottom: "1.5rem", color: "#2c2c2c" }}>
                Edit User
              </h2>

              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Credit Balance</label>
                <input
                  type="number"
                  className="form-control"
                  value={editingUser.creditBalance}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      creditBalance: parseInt(e.target.value),
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Cash Balance</label>
                <input
                  type="number"
                  className="form-control"
                  value={editingUser.cashBalance}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      cashBalance: parseInt(e.target.value),
                    })
                  }
                />
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                <button
                  onClick={handleSave}
                  style={{
                    flex: 1,
                    padding: "0.8rem",
                    backgroundColor: "#4caf50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    padding: "0.8rem",
                    backgroundColor: "#757575",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deleteConfirm.show && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: "2rem",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                maxWidth: "400px",
                width: "90%",
              }}
            >
              <h2 style={{ marginTop: 0, color: "#333" }}>Confirm Delete</h2>
              <p style={{ color: "#666", marginBottom: "2rem" }}>
                Are you sure you want to delete this user? This action cannot be
                undone.
              </p>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  onClick={confirmDelete}
                  style={{
                    flex: 1,
                    padding: "0.8rem",
                    backgroundColor: "#f44336",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm({ show: false, userId: "" })}
                  style={{
                    flex: 1,
                    padding: "0.8rem",
                    backgroundColor: "#757575",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminUsersCompanies;
