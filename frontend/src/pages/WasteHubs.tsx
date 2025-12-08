import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:9371/api';

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
}

const WasteHubs: React.FC = () => {
  const [hubs, setHubs] = useState<WasteHub[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchHubs();
  }, []);

  const fetchHubs = async () => {
    try {
      const response = await axios.get(`${API_BASE}/waste-hubs`);
      setHubs(response.data.data);
    } catch (error) {
      console.error('Error fetching hubs:', error);
    } finally {
      setLoading(false);
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
    </>
  );
};

export default WasteHubs;
