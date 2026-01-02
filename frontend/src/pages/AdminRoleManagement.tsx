import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const API_BASE = API_BASE_URL;

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'company' | 'admin';
  creditBalance: number;
  cashBalance: number;
  createdAt: string;
}

interface ActivityLog {
  _id: string;
  userName: string;
  userRole: string;
  action: string;
  actionType: string;
  resourceType: string;
  timestamp: string;
  details?: string;
}

const AdminRoleManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'logs'>('users');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [adminUser, setAdminUser] = useState<any>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<string>('');

  useEffect(() => {
    // Get admin user from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setAdminUser(user);
    }
    
    if (activeTab === 'users') {
      fetchUsers();
    } else {
      fetchActivityLogs();
    }
  }, [activeTab, roleFilter, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/roles/users`, {
        params: { role: roleFilter || undefined, search: searchTerm || undefined }
      });
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/analytics/activity-logs`, {
        params: { limit: 100 }
      });
      setActivityLogs(response.data.data);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      if (!adminUser?.id) {
        alert('Admin user not found. Please login again.');
        return;
      }
      
      await axios.put(`${API_BASE}/roles/users/${userId}`, {
        newRole: role,
        adminId: adminUser.id,
        adminName: adminUser.name || 'Admin'
      });
      
      alert('Role updated successfully!');
      setEditingUserId(null);
      setNewRole('');
      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update role');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      return;
    }

    try {
      if (!adminUser?.id) {
        alert('Admin user not found. Please login again.');
        return;
      }
      
      await axios.delete(`${API_BASE}/roles/users/${userId}`, {
        data: {
          adminId: adminUser.id,
          adminName: adminUser.name || 'Admin'
        }
      });
      
      alert('User deleted successfully!');
      fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: '#F44336',
      company: '#2196F3',
      user: '#4CAF50'
    };
    return colors[role] || '#9E9E9E';
  };

  const renderUsers = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading users...</p>
        </div>
      );
    }

    if (users.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No users found</p>
        </div>
      );
    }

    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Role</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Credits</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Cash</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Joined</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{user.name}</td>
                <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#666' }}>{user.email}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  {editingUserId === user._id ? (
                    <select
                      value={newRole || user.role}
                      onChange={(e) => setNewRole(e.target.value)}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '5px',
                        border: '1px solid #ddd'
                      }}
                    >
                      <option value="user">User</option>
                      <option value="company">Company</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      background: getRoleBadgeColor(user.role),
                      color: 'white',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      textTransform: 'capitalize'
                    }}>
                      {user.role}
                    </span>
                  )}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', color: '#A4DD00' }}>
                  {user.creditBalance.toFixed(2)}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', color: '#2196F3' }}>
                  ${user.cashBalance.toFixed(2)}
                </td>
                <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#666' }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    {editingUserId === user._id ? (
                      <>
                        <button
                          onClick={() => handleRoleChange(user._id, newRole || user.role)}
                          style={{
                            background: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                          }}
                        >
                          ✓ Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingUserId(null);
                            setNewRole('');
                          }}
                          style={{
                            background: '#9E9E9E',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                          }}
                        >
                          ✕ Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingUserId(user._id);
                            setNewRole(user.role);
                          }}
                          style={{
                            background: '#2196F3',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                          }}
                        >
                          Edit Role
                        </button>
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(user._id, user.name)}
                            style={{
                              background: '#F44336',
                              color: 'white',
                              border: 'none',
                              padding: '0.5rem 1rem',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              fontSize: '0.85rem'
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderActivityLogs = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading activity logs...</p>
        </div>
      );
    }

    if (activityLogs.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No activity logs found</p>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {activityLogs.map((log) => (
          <div
            key={log._id}
            className="card"
            style={{
              borderLeft: `4px solid ${getRoleBadgeColor(log.userRole)}`,
              background: '#fafafa'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    background: getRoleBadgeColor(log.userRole),
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    textTransform: 'capitalize'
                  }}>
                    {log.userRole}
                  </span>
                  <strong>{log.userName}</strong>
                </div>
                
                <div style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                  {log.action}
                </div>

                {log.details && (
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: '#666', 
                    marginBottom: '0.5rem',
                    padding: '0.5rem',
                    background: 'white',
                    borderRadius: '5px'
                  }}>
                    {log.details}
                  </div>
                )}

                <div style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  fontSize: '0.85rem', 
                  color: '#999',
                  marginTop: '0.5rem'
                }}>
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                  <span style={{ 
                    background: '#e0e0e0', 
                    padding: '0.15rem 0.5rem', 
                    borderRadius: '10px',
                    fontSize: '0.75rem'
                  }}>
                    {log.actionType}
                  </span>
                  <span style={{ 
                    background: '#e0e0e0', 
                    padding: '0.15rem 0.5rem', 
                    borderRadius: '10px',
                    fontSize: '0.75rem'
                  }}>
                    {log.resourceType}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <section className="hero">
        <h1>👥 Role & User Management</h1>
        <p>Manage user roles, permissions, and view activity logs</p>
      </section>

      <div className="container" style={{ padding: '3rem 2rem' }}>
        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          marginBottom: '2rem', 
          borderBottom: '2px solid #e0e0e0' 
        }}>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '1rem 2rem',
              background: activeTab === 'users' ? '#A4DD00' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'users' ? '3px solid #A4DD00' : 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: activeTab === 'users' ? '#2c2c2c' : '#666'
            }}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            style={{
              padding: '1rem 2rem',
              background: activeTab === 'logs' ? '#A4DD00' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'logs' ? '3px solid #A4DD00' : 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: activeTab === 'logs' ? '#2c2c2c' : '#666'
            }}
          >
            Activity Logs
          </button>
        </div>

        {/* Filters */}
        {activeTab === 'users' && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  Search Users
                </label>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control"
                />
              </div>
              <div style={{ minWidth: '150px' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  Filter by Role
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="form-control"
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="company">Company</option>
                  <option value="user">User</option>
                </select>
              </div>
              <button
                onClick={() => {
                  setRoleFilter('');
                  setSearchTerm('');
                }}
                className="btn"
                style={{ background: '#f5f5f5', color: '#666' }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="card">
          {activeTab === 'users' ? renderUsers() : renderActivityLogs()}
        </div>
      </div>
    </>
  );
};

export default AdminRoleManagement;
