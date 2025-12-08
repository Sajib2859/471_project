import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:9371/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'user' | 'company'>('user');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock login - In real app, this would call backend API
      await axios.get(`${API_BASE}/waste-hubs`); // Just to test connection
      
      // Mock user data based on email
      if (email.includes('company') || email.includes('industries') || userType === 'company') {
        const companyUser = {
          id: '000000000000000000000002',
          name: 'Company ABC',
          email: email || 'company@example.com',
          role: 'company'
        };
        localStorage.setItem('user', JSON.stringify(companyUser));
        navigate('/company-dashboard');
      } else {
        const regularUser = {
          id: '000000000000000000000004',
          name: 'Regular User',
          email: email || 'user@example.com',
          role: 'user'
        };
        localStorage.setItem('user', JSON.stringify(regularUser));
        navigate('/');
      }
    } catch (error) {
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="hero" style={{padding: '4rem 2rem'}}>
        <h1>Welcome to WasteWise</h1>
        <p>Login to access your account</p>
      </section>

      <div className="container" style={{maxWidth: '500px', padding: '3rem 2rem'}}>
        <div className="card">
          <h2 style={{textAlign: 'center', marginBottom: '2rem', color: '#2c2c2c'}}>Login</h2>
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            padding: '0.5rem',
            background: '#f5f5f5',
            borderRadius: '12px'
          }}>
            <button
              type="button"
              onClick={() => setUserType('user')}
              style={{
                flex: 1,
                padding: '1rem',
                border: 'none',
                borderRadius: '8px',
                background: userType === 'user' ? '#A4DD00' : 'transparent',
                color: userType === 'user' ? '#2c2c2c' : '#757575',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              👤 User
            </button>
            <button
              type="button"
              onClick={() => setUserType('company')}
              style={{
                flex: 1,
                padding: '1rem',
                border: 'none',
                borderRadius: '8px',
                background: userType === 'company' ? '#A4DD00' : 'transparent',
                color: userType === 'company' ? '#2c2c2c' : '#757575',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              🏭 Company
            </button>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                placeholder={userType === 'company' ? 'company@example.com' : 'user@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn" 
              style={{width: '100%', marginTop: '1rem'}}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#e3f2fd',
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: '#01579b'
          }}>
            <strong>Demo Credentials:</strong><br/>
            👤 User: user@example.com<br/>
            🏭 Company: company@example.com<br/>
            Password: any (demo mode)
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
