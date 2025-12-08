import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:9371/api';
const COMPANY_ID = '000000000000000000000002';

interface MaterialRequirement {
  _id: string;
  materialType: string;
  quantity: number;
  unit: string;
  maxPrice: number;
  status: string;
  createdAt: string;
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const CompanyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [requirements, setRequirements] = useState<MaterialRequirement[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'company') {
      navigate('/');
      return;
    }
    setUser(parsedUser);
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [reqRes, notifRes] = await Promise.all([
        axios.get(`${API_BASE}/material-requirements`),
        axios.get(`${API_BASE}/companies/${COMPANY_ID}/notifications`)
      ]);
      setRequirements(reqRes.data.data.filter((r: any) => r.companyId === COMPANY_ID));
      setNotifications(notifRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <>
      <section className="hero" style={{padding: '3rem 2rem'}}>
        <h1>🏭 Company Dashboard</h1>
        <p>Welcome, {user?.name || 'Company'}</p>
      </section>

      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          <div 
            className="card" 
            style={{cursor: 'pointer', textAlign: 'center', background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)'}}
            onClick={() => navigate('/materials')}
          >
            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>📋</div>
            <h3>Orders</h3>
            <p style={{fontSize: '0.9rem', color: '#424242'}}>Manage material requirements</p>
          </div>

          <div 
            className="card" 
            style={{cursor: 'pointer', textAlign: 'center', background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)'}}
            onClick={() => {
              const notifCard = document.getElementById('notifications-section');
              notifCard?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🔔</div>
            <h3>Notifications</h3>
            <div style={{
              position: 'relative',
              display: 'inline-block',
              marginTop: '0.5rem'
            }}>
              <p style={{fontSize: '0.9rem', color: '#e65100'}}>
                {notifications.filter(n => !n.isRead).length} unread
              </p>
            </div>
          </div>

          <div 
            className="card" 
            style={{cursor: 'pointer', textAlign: 'center', background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'}}
            onClick={() => navigate('/auctions')}
          >
            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🎯</div>
            <h3>Inventory</h3>
            <p style={{fontSize: '0.9rem', color: '#01579b'}}>Browse available auctions</p>
          </div>

          <div 
            className="card" 
            style={{cursor: 'pointer', textAlign: 'center', background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)'}}
            onClick={() => navigate('/credits')}
          >
            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>💰</div>
            <h3>Account</h3>
            <p style={{fontSize: '0.9rem', color: '#880e4f'}}>View balance & transactions</p>
          </div>

          <div 
            className="card" 
            style={{cursor: 'pointer', textAlign: 'center', background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)'}}
          >
            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🛠️</div>
            <h3>Support</h3>
            <p style={{fontSize: '0.9rem', color: '#4a148c'}}>Get help & contact us</p>
          </div>
        </div>

        {/* Current Orders Section */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '3rem',
          boxShadow: '0 2px 20px rgba(0,0,0,0.08)'
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
            <h2 style={{margin: 0, color: '#2c2c2c'}}>Current Orders</h2>
            <button className="btn" onClick={() => navigate('/materials')}>
              + Add Order
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr auto',
            gap: '1rem',
            padding: '1rem',
            background: '#f5f5f5',
            borderRadius: '8px',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            <div>Current Orders</div>
            <div>Budget</div>
            <div>Due Date</div>
            <div>Action</div>
          </div>

          {requirements.slice(0, 5).map((req) => (
            <div key={req._id} style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr auto',
              gap: '1rem',
              padding: '1.5rem 1rem',
              borderBottom: '1px solid #e0e0e0',
              alignItems: 'center'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #2c2c2c 0%, #424242 100%)',
                color: 'white',
                padding: '0.8rem 1.5rem',
                borderRadius: '25px',
                fontWeight: 'bold',
                display: 'inline-block',
                maxWidth: 'fit-content'
              }}>
                {req.materialType} - {req.quantity} {req.unit}
              </div>
              <div style={{
                background: '#A4DD00',
                padding: '0.8rem 1.5rem',
                borderRadius: '50px',
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#2c2c2c'
              }}>
                {req.maxPrice.toLocaleString()} tk
              </div>
              <div style={{
                background: '#A4DD00',
                padding: '0.8rem 1.5rem',
                borderRadius: '50px',
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#2c2c2c'
              }}>
                {new Date(req.createdAt).toLocaleDateString()}
              </div>
              <button className="btn" onClick={() => navigate('/materials')}>
                Update
              </button>
            </div>
          ))}

          {requirements.length === 0 && (
            <p style={{textAlign: 'center', padding: '2rem', color: '#757575'}}>
              No orders yet. Click "Add Order" to create one.
            </p>
          )}
        </div>

        {/* Notifications Section */}
        <div 
          id="notifications-section"
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 2px 20px rgba(0,0,0,0.08)'
          }}
        >
          <h2 style={{marginBottom: '2rem', color: '#2c2c2c'}}>🔔 Notifications</h2>
          
          {notifications.slice(0, 10).map((notif) => (
            <div key={notif._id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.5rem',
              background: notif.isRead ? 'white' : '#A4DD00',
              borderRadius: '12px',
              marginBottom: '1rem',
              border: '1px solid #e0e0e0',
              cursor: 'pointer'
            }}
            onClick={() => {
              if (notif.title.toLowerCase().includes('auction')) {
                navigate('/auctions');
              }
            }}
            >
              <div style={{flex: 1}}>
                <p style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>{notif.message}</p>
                <p style={{fontSize: '0.85rem', color: '#757575'}}>
                  {new Date(notif.createdAt).toLocaleString()}
                </p>
              </div>
              {notif.title.toLowerCase().includes('auction') && (
                <button className="btn" style={{
                  padding: '0.6rem 1.5rem',
                  fontSize: '0.85rem'
                }}>
                  Go
                </button>
              )}
            </div>
          ))}

          {notifications.length === 0 && (
            <p style={{textAlign: 'center', padding: '2rem', color: '#757575'}}>
              No notifications
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default CompanyDashboard;
