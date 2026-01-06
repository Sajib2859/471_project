import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from "../config";

const API_BASE = API_BASE_URL;

interface WasteHub {
  _id: string;
  name: string;
  location: {
    address: string;
    city: string;
  };
  wasteTypes: string[];
  status: string;
  contactNumber: string;
}

interface Deposit {
  _id: string;
  userId: string;
  hubId: string;
  wasteType: string;
  quantity: number;
  unit: string;
  isRecyclable: boolean;
  description: string;
  status: string;
  creditsEarned: number;
  depositDate: string;
}

const WasteDeposit: React.FC = () => {
  const [hubs, setHubs] = useState<WasteHub[]>([]);
  const [userDeposits, setUserDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    userId: '',
    hubId: '',
    wasteType: '',
    quantity: '',
    unit: 'kg',
    isRecyclable: true,
    description: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch waste hubs and user deposits on mount
  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUserId(user._id || user.id);
      setFormData(prev => ({ ...prev, userId: user._id || user.id }));
    }

    const loadData = async () => {
      await fetchHubs();
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchUserDeposits();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  const fetchHubs = async () => {
    try {
      const response = await axios.get(`${API_BASE}/waste-hubs`);
      setHubs(response.data.data);
    } catch (error) {
      console.error('Error fetching hubs:', error);
      setErrorMessage('Failed to load waste hubs');
    }
  };

  const fetchUserDeposits = async () => {
    try {
      const response = await axios.get(`${API_BASE}/users/${currentUserId}/deposits`);
      setUserDeposits(response.data.data);
    } catch (error) {
      console.error('Error fetching deposits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleHubChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      hubId: e.target.value,
      wasteType: '' // Reset waste type when hub changes
    }));
  };

  const getAvailableWasteTypes = () => {
    if (!formData.hubId) return [];
    const selectedHub = hubs.find(h => h._id === formData.hubId);
    return selectedHub?.wasteTypes || [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.hubId || !formData.wasteType || !formData.quantity) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.quantity) <= 0) {
      setErrorMessage('Quantity must be greater than 0');
      return;
    }

    setRegistering(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post(`${API_BASE}/deposits`, {
        userId: formData.userId,
        hubId: formData.hubId,
        wasteType: formData.wasteType,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        isRecyclable: formData.isRecyclable,
        description: formData.description
      });

      setSuccessMessage(`✅ Deposit registered successfully! You earned ${response.data.creditsEarned} credits.`);

      // Reset form
      setFormData({
        userId: formData.userId,
        hubId: '',
        wasteType: '',
        quantity: '',
        unit: 'kg',
        isRecyclable: true,
        description: ''
      });

      // Refresh deposits
      fetchUserDeposits();

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Error registering deposit');
    } finally {
      setRegistering(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return '#fff3cd';
      case 'accepted': return '#d4edda';
      case 'rejected': return '#f8d7da';
      default: return '#e9ecef';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch(status) {
      case 'pending': return '#856404';
      case 'accepted': return '#155724';
      case 'rejected': return '#721c24';
      default: return '#383d41';
    }
  };

  return (
    <>
      <section className="hero">
        <h1>Register Waste Deposit</h1>
        <p>Deposit your recyclable or non-recyclable waste at a selected hub and earn credits</p>
      </section>

      <div className="container">
        {/* Registration Form */}
        <div style={{
          marginBottom: '3rem',
          padding: '2rem',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 2px 20px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{marginBottom: '1.5rem', color: '#2c2c2c', fontSize: '1.4rem'}}>New Waste Deposit</h3>

          {successMessage && (
            <div style={{
              padding: '1rem',
              marginBottom: '1.5rem',
              background: '#d4edda',
              border: '1px solid #c3e6cb',
              borderRadius: '8px',
              color: '#155724'
            }}>
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div style={{
              padding: '1rem',
              marginBottom: '1.5rem',
              background: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '8px',
              color: '#721c24'
            }}>
              ❌ {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              
              {/* Waste Hub Selection */}
              <div className="form-group">
                <label>Select Waste Hub *</label>
                <select
                  className="form-control"
                  name="hubId"
                  value={formData.hubId}
                  onChange={handleHubChange}
                  required
                >
                  <option value="">-- Choose a hub --</option>
                  {hubs.map(hub => (
                    <option key={hub._id} value={hub._id}>
                      {hub.name} ({hub.location.city})
                    </option>
                  ))}
                </select>
              </div>

              {/* Waste Type Selection */}
              <div className="form-group">
                <label>Waste Type *</label>
                <select
                  className="form-control"
                  name="wasteType"
                  value={formData.wasteType}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.hubId}
                >
                  <option value="">-- Choose waste type --</option>
                  {getAvailableWasteTypes().map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  className="form-control"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="e.g., 5.5"
                  step="0.1"
                  min="0.1"
                  required
                />
              </div>

              {/* Unit */}
              <div className="form-group">
                <label>Unit</label>
                <select
                  className="form-control"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="liters">Liters</option>
                  <option value="pieces">Pieces</option>
                </select>
              </div>

              {/* Recyclable Toggle */}
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 0 }}>
                  <input
                    type="checkbox"
                    name="isRecyclable"
                    checked={formData.isRecyclable}
                    onChange={handleInputChange}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <span>Recyclable Material</span>
                </label>
                <small style={{ color: '#666', marginTop: '0.5rem', display: 'block' }}>
                  {formData.isRecyclable ? 'Earns 100% credits' : 'Earns 50% credits'}
                </small>
              </div>
            </div>

            {/* Description */}
            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label>Description (Optional)</label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Add any additional details about the waste..."
                rows={3}
              ></textarea>
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: '2rem' }}>
              <button
                type="submit"
                disabled={registering}
                className="btn"
                style={{
                  cursor: registering ? 'not-allowed' : 'pointer',
                  opacity: registering ? 0.6 : 1
                }}
              >
                {registering ? 'Registering...' : 'Register Deposit'}
              </button>
            </div>
          </form>
        </div>

        {/* Your Deposits History */}
        <div style={{
          padding: '2rem',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 2px 20px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{marginBottom: '1.5rem', color: '#2c2c2c', fontSize: '1.4rem'}}>
            📋 Your Deposits ({userDeposits.length})
          </h3>

          {loading ? (
            <div className="loading">Loading your deposits...</div>
          ) : userDeposits.length === 0 ? (
            <p style={{color: '#666', textAlign: 'center', padding: '2rem'}}>
              No deposits registered yet. Register your first waste deposit above!
            </p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              {userDeposits.map(deposit => (
                <div
                  key={deposit._id}
                  style={{
                    padding: '1.5rem',
                    background: getStatusColor(deposit.status),
                    border: `2px solid ${getStatusTextColor(deposit.status)}`,
                    borderRadius: '8px',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem 0', textTransform: 'capitalize' }}>
                        🗑️ {deposit.wasteType}
                      </h4>
                      <p style={{ margin: '0.25rem 0', color: '#555', fontSize: '0.9rem' }}>
                        {deposit.quantity} {deposit.unit}
                      </p>
                    </div>
                    <span style={{
                      padding: '0.5rem 1rem',
                      background: getStatusTextColor(deposit.status),
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      {deposit.status}
                    </span>
                  </div>

                  {deposit.description && (
                    <p style={{ margin: '0.75rem 0', fontSize: '0.9rem', color: '#555' }}>
                      📝 {deposit.description}
                    </p>
                  )}

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: `1px solid ${getStatusTextColor(deposit.status)}33`
                  }}>
                    <div>
                      <small style={{ color: '#666' }}>Recyclable</small>
                      <p style={{ margin: '0.25rem 0 0 0', fontWeight: 'bold' }}>
                        {deposit.isRecyclable ? '♻️ Yes' : '🚫 No'}
                      </p>
                    </div>
                    <div>
                      <small style={{ color: '#666' }}>Credits Earned</small>
                      <p style={{ margin: '0.25rem 0 0 0', fontWeight: 'bold', color: '#A4DD00', fontSize: '1.1rem' }}>
                        +{deposit.creditsEarned}
                      </p>
                    </div>
                  </div>

                  <p style={{ margin: '1rem 0 0 0', fontSize: '0.8rem', color: '#999' }}>
                    {new Date(deposit.depositDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .hero {
          background: linear-gradient(135deg, #A4DD00 0%, #b8e633 100%);
          color: #2c2c2c;
          padding: 4rem 2rem;
          text-align: center;
          margin-bottom: 3rem;
          border-radius: 16px;
        }

        .hero h1 {
          font-size: 2.5rem;
          margin: 0 0 1rem 0;
        }

        .hero p {
          font-size: 1.1rem;
          margin: 0;
          opacity: 0.95;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem 4rem 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #2c2c2c;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .form-control {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          font-family: inherit;
          transition: border-color 0.3s;
        }

        .form-control:focus {
          outline: none;
          border-color: #A4DD00;
          box-shadow: 0 0 0 3px rgba(164, 221, 0, 0.1);
        }

        .form-control:disabled {
          background: #f5f5f5;
          color: #999;
          cursor: not-allowed;
        }

        textarea.form-control {
          resize: vertical;
          min-height: 100px;
        }

        .loading {
          text-align: center;
          padding: 3rem;
          color: #666;
          font-size: 1.1rem;
        }
      `}</style>
    </>
  );
};

export default WasteDeposit;
