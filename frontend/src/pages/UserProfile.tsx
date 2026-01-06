import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const API_BASE = API_BASE_URL;

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  creditBalance: number;
  cashBalance: number;
  profilePhoto?: string;
  bio?: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    phone: '',
    address: ''
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = currentUser._id || currentUser.id;

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/users/${userId}/profile`);
      setUser(response.data.user);
      setStats(response.data.stats);
      setFormData({
        name: response.data.user.name || '',
        bio: response.data.user.bio || '',
        phone: response.data.user.phone || '',
        address: response.data.user.address || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) return;

    try {
      setUploading(true);
      const formDataUpload = new FormData();
      formDataUpload.append('photo', photoFile);

      const response = await axios.post(
        `${API_BASE}/users/${userId}/profile-photo`,
        formDataUpload,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setUser(response.data.user);
      setPhotoPreview(null);
      setPhotoFile(null);
      alert('Profile photo updated successfully!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${API_BASE}/users/${userId}/profile`,
        formData
      );
      setUser(response.data.user);
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>User not found</p>
      </div>
    );
  }

  return (
    <>
      <section className="hero" style={{ padding: '2rem' }}>
        <h1>My Profile</h1>
        <p>Manage your account information and settings</p>
      </section>

      <div className="container" style={{ maxWidth: '900px', padding: '2rem' }}>
        {/* Profile Header */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            {/* Profile Photo */}
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '4px solid #A4DD00',
                background: '#f5f5f5'
              }}>
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : user.profilePhoto ? (
                  <img src={`${API_BASE_URL.replace('/api', '')}${user.profilePhoto}`} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '48px', color: '#999' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <input
                type="file"
                id="photoUpload"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="photoUpload" style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                background: '#A4DD00',
                color: '#2c2c2c',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '20px'
              }}>
                📷
              </label>
            </div>

            {/* User Info */}
            <div style={{ flex: 1 }}>
              <h2 style={{ marginBottom: '0.5rem' }}>{user.name}</h2>
              <p style={{ color: '#666', marginBottom: '0.5rem' }}>{user.email}</p>
              <span style={{
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                background: user.role === 'admin' ? '#e91e63' : user.role === 'company' ? '#2196f3' : '#A4DD00',
                color: 'white',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}>
                {user.role.toUpperCase()}
              </span>
              {photoFile && (
                <div style={{ marginTop: '1rem' }}>
                  <button
                    onClick={handlePhotoUpload}
                    disabled={uploading}
                    className="btn"
                    style={{ marginRight: '0.5rem' }}
                  >
                    {uploading ? 'Uploading...' : 'Upload Photo'}
                  </button>
                  <button
                    onClick={() => {
                      setPhotoFile(null);
                      setPhotoPreview(null);
                    }}
                    className="btn"
                    style={{ background: '#666' }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #A4DD00, #88BB00)' }}>
            <h3 style={{ color: 'white', fontSize: '2rem', marginBottom: '0.5rem' }}>{stats.creditBalance}</h3>
            <p style={{ color: 'white', fontSize: '0.9rem' }}>Credits Balance</p>
          </div>
          <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #2196f3, #1976d2)' }}>
            <h3 style={{ color: 'white', fontSize: '2rem', marginBottom: '0.5rem' }}>৳{stats.cashBalance}</h3>
            <p style={{ color: 'white', fontSize: '0.9rem' }}>Cash Balance</p>
          </div>
          <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #e91e63, #c2185b)' }}>
            <h3 style={{ color: 'white', fontSize: '2rem', marginBottom: '0.5rem' }}>
              {Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
            </h3>
            <p style={{ color: 'white', fontSize: '0.9rem' }}>Days Active</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Profile Information</h3>
            {!editing && (
              <button onClick={() => setEditing(true)} className="btn" style={{ padding: '0.5rem 1rem' }}>
                Edit Profile
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  maxLength={500}
                  placeholder="Tell us about yourself..."
                />
                <small>{formData.bio.length}/500 characters</small>
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+880-XXX-XXXXXX"
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Your address"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      name: user.name || '',
                      bio: user.bio || '',
                      phone: user.phone || '',
                      address: user.address || ''
                    });
                  }}
                  className="btn"
                  style={{ background: '#666' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Bio:</strong>
                <p style={{ marginTop: '0.5rem', color: '#666' }}>
                  {user.bio || 'No bio added yet'}
                </p>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Phone:</strong>
                <p style={{ marginTop: '0.5rem', color: '#666' }}>
                  {user.phone || 'Not provided'}
                </p>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Address:</strong>
                <p style={{ marginTop: '0.5rem', color: '#666' }}>
                  {user.address || 'Not provided'}
                </p>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Member Since:</strong>
                <p style={{ marginTop: '0.5rem', color: '#666' }}>
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
