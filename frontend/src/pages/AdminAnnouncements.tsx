import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const API_BASE = API_BASE_URL;

interface Announcement {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  targetAudience: 'all' | 'user' | 'company' | 'admin';
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
}

const AdminAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'success' | 'error',
    targetAudience: 'all' as 'all' | 'user' | 'company' | 'admin',
    expiresAt: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAnnouncements();
    }
  }, [user]);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`${API_BASE}/announcements/all`);
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      alert('Please login as admin');
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        createdBy: user.id,
        expiresAt: formData.expiresAt || undefined
      };

      if (editingId) {
        await axios.put(`${API_BASE}/announcements/${editingId}`, dataToSend);
        alert('Announcement updated successfully!');
      } else {
        await axios.post(`${API_BASE}/announcements`, dataToSend);
        alert('Announcement created successfully!');
      }

      setShowForm(false);
      setFormData({
        title: '',
        message: '',
        type: 'info',
        targetAudience: 'all',
        expiresAt: ''
      });
      setEditingId(null);
      fetchAnnouncements();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save announcement');
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      message: announcement.message,
      type: announcement.type,
      targetAudience: announcement.targetAudience,
      expiresAt: announcement.expiresAt ? new Date(announcement.expiresAt).toISOString().slice(0, 16) : ''
    });
    setEditingId(announcement._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;

    try {
      await axios.delete(`${API_BASE}/announcements/${id}`);
      alert('Announcement deleted successfully!');
      fetchAnnouncements();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete announcement');
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await axios.patch(`${API_BASE}/announcements/${id}/toggle`);
      fetchAnnouncements();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to toggle announcement status');
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return '#2196F3';
      case 'warning': return '#FF9800';
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      default: return '#757575';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return 'ℹ️';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '📢';
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="container">
        <div className="empty-state">
          <h2>Access Denied</h2>
          <p>Only administrators can access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading announcements...</div>;
  }

  return (
    <>
      <section className="hero">
        <h1>📢 Announcement Management</h1>
        <p>Create and manage system-wide announcements</p>
      </section>

      <div className="container">
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="section-title">Announcements ({announcements.length})</h2>
          <button
            className="btn"
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({
                title: '',
                message: '',
                type: 'info',
                targetAudience: 'all',
                expiresAt: ''
              });
            }}
            style={{ marginBottom: 0 }}
          >
            {showForm ? 'Cancel' : '+ New Announcement'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>
              {editingId ? 'Edit Announcement' : 'Create New Announcement'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title*</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Message*</label>
                <textarea
                  className="form-control"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label>Type*</label>
                  <select
                    className="form-control"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  >
                    <option value="info">ℹ️ Info</option>
                    <option value="warning">⚠️ Warning</option>
                    <option value="success">✅ Success</option>
                    <option value="error">❌ Error</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Target Audience*</label>
                  <select
                    className="form-control"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value as any })}
                  >
                    <option value="all">👥 All Users</option>
                    <option value="user">👤 Regular Users</option>
                    <option value="company">🏢 Companies</option>
                    <option value="admin">👨‍💼 Admins</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Expires At (Optional)</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn" style={{ marginTop: '1rem' }}>
                {editingId ? 'Update Announcement' : 'Create Announcement'}
              </button>
            </form>
          </div>
        )}

        {/* Announcements List */}
        {announcements.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📢</div>
            <h3>No announcements yet</h3>
            <p>Create your first announcement to get started</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {announcements.map((announcement) => (
              <div
                key={announcement._id}
                className="card"
                style={{
                  borderLeft: `4px solid ${getTypeColor(announcement.type)}`,
                  opacity: announcement.isActive ? 1 : 0.6
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>{getTypeIcon(announcement.type)}</span>
                      <h3 style={{ margin: 0, fontSize: '1.3rem' }}>{announcement.title}</h3>
                    </div>
                    <p style={{ margin: '0.5rem 0', color: '#555' }}>{announcement.message}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <button
                      onClick={() => toggleActive(announcement._id, announcement.isActive)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: announcement.isActive ? '#4CAF50' : '#757575',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 600
                      }}
                    >
                      {announcement.isActive ? '✓ Active' : '○ Inactive'}
                    </button>
                    <button
                      onClick={() => handleEdit(announcement)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(announcement._id)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid #f44336',
                        backgroundColor: 'white',
                        color: '#f44336',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', color: '#757575', flexWrap: 'wrap' }}>
                  <span>
                    <strong>Audience:</strong> {announcement.targetAudience === 'all' ? '👥 All Users' : 
                      announcement.targetAudience === 'user' ? '👤 Regular Users' :
                      announcement.targetAudience === 'company' ? '🏢 Companies' : '👨‍💼 Admins'}
                  </span>
                  <span>
                    <strong>Created:</strong> {new Date(announcement.createdAt).toLocaleString()}
                  </span>
                  {announcement.expiresAt && (
                    <span>
                      <strong>Expires:</strong> {new Date(announcement.expiresAt).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminAnnouncements;
