import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:9371/api';
const COMPANY_ID = '000000000000000000000002'; // Company ABC

interface MaterialRequirement {
  _id: string;
  companyId: string;
  materialType: string;
  quantity: number;
  unit: string;
  description: string;
  maxPrice: number;
  urgency: string;
  status: string;
  preferredLocations: string[];
  createdAt: string;
}

interface Notification {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const MaterialRequirements: React.FC = () => {
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState<MaterialRequirement[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [materialType, setMaterialType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [description, setDescription] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [urgency, setUrgency] = useState('medium');
  const [locations, setLocations] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [requirementsRes, notificationsRes] = await Promise.all([
        axios.get(`${API_BASE}/material-requirements`),
        axios.get(`${API_BASE}/companies/${COMPANY_ID}/notifications`)
      ]);
      setRequirements(requirementsRes.data.data);
      setNotifications(notificationsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/material-requirements`, {
        companyId: COMPANY_ID,
        materialType,
        quantity: parseFloat(quantity),
        unit,
        description,
        maxPrice: parseFloat(maxPrice),
        urgency,
        status: 'active',
        preferredLocations: locations,
        notificationPreferences: {
          auctionMatch: true,
          inventoryMatch: true,
          priceAlert: true
        }
      });
      alert('Material requirement created successfully!');
      fetchData();
      setShowForm(false);
      resetForm();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error creating requirement');
    }
  };

  const findMatches = async (reqId: string) => {
    try {
      const response = await axios.get(`${API_BASE}/material-requirements/${reqId}/matches`);
      if (response.data.matches.length > 0) {
        alert(`Found ${response.data.matches.length} matching auctions!`);
      } else {
        alert('No matching auctions found at this time.');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error finding matches');
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await axios.put(`${API_BASE}/notifications/${notificationId}/read`);
      fetchData();
    } catch (error) {
      console.error('Error marking notification as read');
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    
    // Navigate to auctions page if it's about matching auctions
    if (notification.type === 'auction_match' || notification.title.toLowerCase().includes('auction')) {
      navigate('/auctions');
    }
  };

  const resetForm = () => {
    setMaterialType('');
    setQuantity('');
    setDescription('');
    setMaxPrice('');
    setUrgency('medium');
    setLocations([]);
  };

  const addLocation = () => {
    if (locationInput && !locations.includes(locationInput)) {
      setLocations([...locations, locationInput]);
      setLocationInput('');
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case 'high': return '#ffcdd2';
      case 'medium': return '#fff9c4';
      case 'low': return '#c8e6c9';
      default: return '#e0e0e0';
    }
  };

  if (loading) {
    return <div className="loading">Loading material requirements...</div>;
  }

  return (
    <>
      <section className="hero">
        <h1>Material Requirements</h1>
        <p>Manage your company's material needs and find matching suppliers</p>
      </section>

      <div className="container">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
          <h2 className="section-title" style={{margin: 0}}>My Requirements</h2>
          <button className="btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Requirement'}
          </button>
        </div>

        {showForm && (
          <div className="card" style={{marginBottom: '3rem'}}>
            <h3>Create Material Requirement</h3>
            <form onSubmit={createRequirement}>
              <div className="form-group">
                <label>Material Type</label>
                <select
                  className="form-control"
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value)}
                  required
                >
                  <option value="">Select type...</option>
                  <option value="plastic">Plastic</option>
                  <option value="glass">Glass</option>
                  <option value="paper">Paper</option>
                  <option value="metal">Metal</option>
                  <option value="organic">Organic</option>
                  <option value="electronic">Electronic</option>
                </select>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem'}}>
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Unit</label>
                  <select
                    className="form-control"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  >
                    <option value="kg">kg</option>
                    <option value="tons">tons</option>
                    <option value="liters">liters</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div className="form-group">
                  <label>Max Price (৳)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Urgency</label>
                  <select
                    className="form-control"
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Preferred Locations</label>
                <div style={{display: 'flex', gap: '1rem', marginBottom: '0.5rem'}}>
                  <input
                    type="text"
                    className="form-control"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="Enter location"
                  />
                  <button type="button" className="btn" onClick={addLocation}>Add</button>
                </div>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
                  {locations.map((loc, idx) => (
                    <span key={idx} className="badge badge-success">
                      {loc}
                      <button
                        onClick={() => setLocations(locations.filter((_, i) => i !== idx))}
                        style={{marginLeft: '0.5rem', border: 'none', background: 'none', cursor: 'pointer'}}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn" style={{width: '100%'}}>
                Create Requirement
              </button>
            </form>
          </div>
        )}

        <div className="card-grid">
          {requirements.filter(r => r.companyId === COMPANY_ID).map((req) => (
            <div key={req._id} className="card">
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
                <h3>{req.materialType}</h3>
                <span
                  className="badge"
                  style={{
                    backgroundColor: getUrgencyColor(req.urgency),
                    color: req.urgency === 'high' ? '#c62828' : '#2c2c2c'
                  }}
                >
                  {req.urgency.toUpperCase()}
                </span>
              </div>

              <p><strong>Quantity:</strong> {req.quantity} {req.unit}</p>
              <p><strong>Max Price:</strong> ৳{req.maxPrice}</p>
              <p><strong>Status:</strong> <span className="badge badge-success">{req.status}</span></p>
              <p style={{marginTop: '0.5rem', fontSize: '0.9rem'}}>{req.description}</p>
              
              {req.preferredLocations.length > 0 && (
                <div style={{marginTop: '1rem'}}>
                  <p><strong>Locations:</strong></p>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem'}}>
                    {req.preferredLocations.map((loc, idx) => (
                      <span key={idx} className="badge" style={{backgroundColor: '#b3e5fc', color: '#01579b'}}>
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                className="btn"
                onClick={() => findMatches(req._id)}
                style={{width: '100%', marginTop: '1rem'}}
              >
                Find Matching Auctions
              </button>
            </div>
          ))}
        </div>

        <h2 className="section-title" style={{marginTop: '4rem'}}>Notifications</h2>
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className="card"
              style={{
                marginBottom: '1rem',
                backgroundColor: notif.isRead ? '#ffffff' : '#f1f8e9',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: notif.isRead ? '1px solid rgba(0,0,0,0.05)' : '2px solid #7cb342'
              }}
              onClick={() => handleNotificationClick(notif)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
                    <h4 style={{margin: 0}}>{notif.title}</h4>
                    {!notif.isRead && (
                      <span style={{
                        padding: '0.2rem 0.6rem',
                        backgroundColor: '#7cb342',
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '0.7rem',
                        fontWeight: 'bold'
                      }}>NEW</span>
                    )}
                  </div>
                  <p style={{fontSize: '0.9rem', margin: '0.5rem 0'}}>{notif.message}</p>
                  <p style={{fontSize: '0.85rem', color: '#757575', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    🕐 {new Date(notif.createdAt).toLocaleString()}
                  </p>
                  {(notif.type === 'auction_match' || notif.title.toLowerCase().includes('auction')) && (
                    <p style={{
                      fontSize: '0.85rem',
                      color: '#7cb342',
                      marginTop: '0.8rem',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}>
                      👉 Click to view auctions
                    </p>
                  )}
                </div>
                {!notif.isRead && (
                  <span style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#7cb342',
                    borderRadius: '50%',
                    flexShrink: 0,
                    marginLeft: '1rem'
                  }}></span>
                )}
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <p style={{textAlign: 'center', color: '#757575', padding: '2rem'}}>
              No notifications
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default MaterialRequirements;
