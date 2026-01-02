import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from "../config";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import StarRating from '../components/StarRating';
import FRONTEND_CONFIG from '../config/constants';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
const API_BASE = API_BASE_URL;

interface WasteHub {
  _id: string;
  name: string;
  location: {
    address: string;
    city: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  wasteTypes: string[];
  status: string;
  operatingHours: {
    open: string;
    close: string;
  };
  contactNumber: string;
  capacity: {
    current: number;
    maximum: number;
  };
  averageRating?: number;
  totalRatings?: number;
}

interface Rating {
  _id: string;
  userId: { name: string; email: string };
  rating: number;
  review?: string;
  createdAt: string;
}

const WasteHubs: React.FC = () => {
  const [hubs, setHubs] = useState<WasteHub[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedHub, setSelectedHub] = useState<WasteHub | null>(null);
  const [hubRatings, setHubRatings] = useState<Rating[]>([]);
  const [newRating, setNewRating] = useState(0);
  const [newReview, setNewReview] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    fetchHubs();
  }, []);

  const fetchHubs = async () => {
    try {
      const response = await axios.get(`${API_BASE}/waste-hubs`);
      const hubsData = response.data.data;
      
      // Fetch ratings for each hub
      const hubsWithRatings = await Promise.all(
        hubsData.map(async (hub: WasteHub) => {
          try {
            const ratingResponse = await axios.get(`${API_BASE}/ratings/summary?targetId=${hub._id}&targetType=wastehub`);
            return {
              ...hub,
              averageRating: ratingResponse.data.averageRating || 0,
              totalRatings: ratingResponse.data.totalRatings || 0
            };
          } catch (error) {
            return { ...hub, averageRating: 0, totalRatings: 0 };
          }
        })
      );
      
      setHubs(hubsWithRatings);
    } catch (error) {
      console.error('Error fetching hubs:', error);
    } finally {
      setLoading(false);
    }
  };

  const openRatingModal = async (hub: WasteHub) => {
    setSelectedHub(hub);
    setShowRatingModal(true);
    setNewRating(0);
    setNewReview('');
    
    // Fetch existing ratings
    try {
      const response = await axios.get(`${API_BASE}/ratings/target?targetId=${hub._id}&targetType=wastehub`);
      setHubRatings(response.data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
      setHubRatings([]);
    }
  };

  const submitRating = async () => {
    if (!user) {
      alert('Please login to rate this hub');
      return;
    }
    
    if (newRating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      await axios.post(`${API_BASE}/ratings`, {
        userId: user.id,
        targetId: selectedHub?._id,
        targetType: 'wastehub',
        rating: newRating,
        review: newReview
      });
      
      alert('Rating submitted successfully!');
      setShowRatingModal(false);
      fetchHubs(); // Refresh to get updated ratings
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit rating');
    }
  };

  const filterByType = async (type: string) => {
    if (!type) {
      fetchHubs();
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/waste-hubs/filter?wasteType=${type}`);
      setHubs(response.data.data);
    } catch (error) {
      console.error('Error filtering hubs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterByStatus = async (status: string) => {
    if (!status) {
      fetchHubs();
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/waste-hubs/status?status=${status}`);
      setHubs(response.data.data);
    } catch (error) {
      console.error('Error filtering by status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'open': return '#c8e6c9';
      case 'closed': return '#ffcdd2';
      case 'maintenance': return '#fff9c4';
      default: return '#e0e0e0';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch(status) {
      case 'open': return '#2c2c2c';
      case 'closed': return '#c62828';
      case 'maintenance': return '#f57f17';
      default: return '#424242';
    }
  };

  const getCapacityColor = (current: number, maximum: number) => {
    const percentage = (current / maximum) * 100;
    if (percentage < 60) return '#A4DD00';
    if (percentage < 85) return 'linear-gradient(90deg, #ff9800 0%, #ffb74d 100%)';
    return 'linear-gradient(90deg, #f44336 0%, #ef5350 100%)';
  };

  if (loading) {
    return <div className="loading">Loading waste hubs...</div>;
  }

  return (
    <>
      <section className="hero">
        <h1>🏭 Waste Hub Locations</h1>
        <p>Find nearby waste disposal centers and recycling facilities in your area</p>
        <div style={{marginTop: '2rem', display: 'flex', gap: '2rem', justifyContent: 'center', fontSize: '1.1rem'}}>
          <div>📍 <strong>{hubs.length}</strong> Hubs Available</div>
          <div>🌍 <strong>5</strong> Cities Covered</div>
          <div>♻️ <strong>8</strong> Material Types</div>
        </div>
      </section>

      <div className="container">
        <div style={{
          marginBottom: '3rem',
          padding: '2rem',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 2px 20px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{marginBottom: '1.5rem', color: '#2c2c2c', fontSize: '1.4rem'}}>🔍 Filter Hubs</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem'}}>
            <div className="form-group" style={{marginBottom: 0}}>
              <label>Filter by Waste Type</label>
              <select 
                className="form-control"
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  filterByType(e.target.value);
                }}
              >
                <option value="">All Types</option>
                <option value="plastic">Plastic</option>
                <option value="glass">Glass</option>
                <option value="paper">Paper</option>
                <option value="metal">Metal</option>
                <option value="organic">Organic</option>
                <option value="electronic">Electronic</option>
                <option value="textile">Textile</option>
                <option value="hazardous">Hazardous</option>
              </select>
            </div>

            <div className="form-group" style={{marginBottom: 0}}>
              <label>Filter by Status</label>
              <select 
                className="form-control"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  filterByStatus(e.target.value);
                }}
              >
                <option value="">All Statuses</option>
                <option value="open">🟢 Open</option>
                <option value="closed">🔴 Closed</option>
                <option value="maintenance">🟡 Maintenance</option>
              </select>
            </div>

            <button 
              className="btn" 
              onClick={() => {
                setFilter('');
                setStatusFilter('');
                fetchHubs();
              }}
              style={{alignSelf: 'flex-end', marginBottom: 0}}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Interactive Map */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 className="section-title">Map View</h2>
          <div className="card" style={{ padding: '0', overflow: 'hidden', height: '500px' }}>
            <MapContainer
              center={[FRONTEND_CONFIG.MAP.DEFAULT_CENTER.lat, FRONTEND_CONFIG.MAP.DEFAULT_CENTER.lng]}
              zoom={FRONTEND_CONFIG.MAP.DEFAULT_ZOOM}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution={FRONTEND_CONFIG.MAP.ATTRIBUTION}
                url={FRONTEND_CONFIG.MAP.TILE_URL}
              />
              {hubs.map((hub) => {
                // Default coordinates if not available
                const lat = hub.location.coordinates?.latitude || FRONTEND_CONFIG.MAP.DEFAULT_CENTER.lat;
                const lng = hub.location.coordinates?.longitude || FRONTEND_CONFIG.MAP.DEFAULT_CENTER.lng;
                
                return (
                  <Marker key={hub._id} position={[lat, lng]}>
                    <Popup>
                      <div style={{ minWidth: '200px' }}>
                        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{hub.name}</h3>
                        <p style={{ marginBottom: '0.3rem', fontSize: '0.9rem' }}>
                          <strong>Address:</strong> {hub.location.address}, {hub.location.city}
                        </p>
                        <p style={{ marginBottom: '0.3rem', fontSize: '0.9rem' }}>
                          <strong>Status:</strong> <span style={{ 
                            color: hub.status === 'open' ? '#4caf50' : hub.status === 'closed' ? '#f44336' : '#ff9800',
                            fontWeight: 'bold'
                          }}>{hub.status.toUpperCase()}</span>
                        </p>
                        <p style={{ marginBottom: '0.3rem', fontSize: '0.9rem' }}>
                          <strong>Hours:</strong> {hub.operatingHours.open} - {hub.operatingHours.close}
                        </p>
                        <p style={{ marginBottom: '0.3rem', fontSize: '0.9rem' }}>
                          <strong>Contact:</strong> {hub.contactNumber}
                        </p>
                        <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                          Capacity: {hub.capacity.current}/{hub.capacity.maximum} kg
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>

        <h2 className="section-title">Available Hubs ({hubs.length})</h2>
        
        <div className="card-grid">
          {hubs.map((hub) => {
            const capacityPercentage = (hub.capacity.current / hub.capacity.maximum) * 100;
            return (
              <div key={hub._id} className="card">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem'}}>
                  <h3 style={{margin: 0, fontSize: '1.4rem'}}>{hub.name}</h3>
                  <span 
                    className="badge" 
                    style={{
                      backgroundColor: getStatusColor(hub.status),
                      color: getStatusTextColor(hub.status)
                    }}
                  >
                    {hub.status}
                  </span>
                </div>

                <div style={{marginBottom: '1rem'}}>
                  <p style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.7rem'}}>
                    <span style={{fontSize: '1.2rem'}}>📍</span>
                    <strong>Location:</strong> {hub.location.address}
                  </p>
                  <p style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.7rem', paddingLeft: '1.7rem', color: '#757575'}}>
                    {hub.location.city}
                  </p>
                  <p style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.7rem'}}>
                    <span style={{fontSize: '1.2rem'}}>📞</span>
                    <strong>Contact:</strong> {hub.contactNumber}
                  </p>
                  <p style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <span style={{fontSize: '1.2rem'}}>🕐</span>
                    <strong>Hours:</strong> {hub.operatingHours.open} - {hub.operatingHours.close}
                  </p>
                </div>
                
                <div style={{
                  marginTop: '1.5rem',
                  padding: '1.2rem',
                  backgroundColor: '#fafafa',
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0'
                }}>
                  <p style={{marginBottom: '0.8rem'}}><strong>♻️ Accepted Materials:</strong></p>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
                    {hub.wasteTypes.map((type) => (
                      <span key={type} className="badge badge-success">{type}</span>
                    ))}
                  </div>
                </div>

                <div style={{
                  marginTop: '1.5rem',
                  padding: '1.2rem',
                  background: capacityPercentage > 85 ? '#ffebee' : capacityPercentage > 60 ? '#fff3e0' : '#e8f5e9',
                  borderRadius: '12px',
                  border: '1px solid ' + (capacityPercentage > 85 ? '#ffcdd2' : capacityPercentage > 60 ? '#ffe0b2' : '#c8e6c9')
                }}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem'}}>
                    <strong>📊 Capacity:</strong>
                    <span style={{fontWeight: 'bold'}}>{capacityPercentage.toFixed(0)}%</span>
                  </div>
                  <p style={{fontSize: '0.9rem', marginBottom: '0.8rem', color: '#757575'}}>
                    {hub.capacity.current} / {hub.capacity.maximum} tons
                  </p>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{
                        width: `${capacityPercentage}%`,
                        background: getCapacityColor(hub.capacity.current, hub.capacity.maximum)
                      }}
                    ></div>
                  </div>
                </div>

                {/* Rating Section */}
                <div style={{
                  marginTop: '1.5rem',
                  padding: '1.2rem',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <StarRating rating={hub.averageRating || 0} readonly size="medium" />
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
                      {hub.averageRating?.toFixed(1) || 'No ratings'} ({hub.totalRatings || 0} reviews)
                    </p>
                  </div>
                  <button
                    className="btn"
                    onClick={() => openRatingModal(hub)}
                    style={{ marginBottom: 0, fontSize: '0.9rem', padding: '0.6rem 1.2rem' }}
                  >
                    ⭐ Rate Hub
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {hubs.length === 0 && (
          <div className="empty-state">
            <div style={{fontSize: '4rem', marginBottom: '1rem'}}>🔍</div>
            <h3>No waste hubs found</h3>
            <p>Try adjusting your filters to see more results</p>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && selectedHub && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }} onClick={() => setShowRatingModal(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '1.5rem' }}>Rate {selectedHub.name}</h2>
            
            {/* Rate this hub */}
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f5f5f5',
              borderRadius: '12px',
              marginBottom: '2rem'
            }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Your Rating</h3>
              <div style={{ marginBottom: '1rem' }}>
                <StarRating
                  rating={newRating}
                  onRatingChange={setNewRating}
                  size="large"
                />
              </div>
              <textarea
                placeholder="Write your review (optional)..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  minHeight: '100px',
                  marginBottom: '1rem',
                  resize: 'vertical'
                }}
              />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn" onClick={submitRating} style={{ flex: 1, marginBottom: 0 }}>
                  Submit Rating
                </button>
                <button
                  onClick={() => setShowRatingModal(false)}
                  style={{
                    flex: 1,
                    padding: '0.8rem 1.5rem',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 600
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Existing reviews */}
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Reviews ({hubRatings.length})</h3>
            {hubRatings.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
                No reviews yet. Be the first to review!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {hubRatings.map((rating) => (
                  <div key={rating._id} style={{
                    padding: '1rem',
                    backgroundColor: '#fafafa',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong>{rating.userId.name}</strong>
                      <StarRating rating={rating.rating} readonly size="small" />
                    </div>
                    {rating.review && (
                      <p style={{ margin: '0.5rem 0', color: '#555' }}>{rating.review}</p>
                    )}
                    <p style={{ fontSize: '0.85rem', color: '#999', margin: 0 }}>
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default WasteHubs;
