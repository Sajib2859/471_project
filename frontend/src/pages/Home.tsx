import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <>
      <section className="hero">
        <h1>🌍 Transform Waste Into Worth</h1>
        <p>Join the green revolution with smart waste management solutions that reward your environmental efforts</p>
        <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem'}}>
          <Link to="/waste-hubs" className="btn">Find Waste Hubs</Link>
          <Link to="/credits" className="btn btn-secondary">Track Credits</Link>
        </div>
      </section>

      <div className="container">
        <h2 className="section-title">Our Services</h2>
        <div className="card-grid">
          <div className="card">
            <div style={{fontSize: '3.5rem', marginBottom: '1.5rem'}}>📍</div>
            <h3>Waste Hub Locations</h3>
            <p>Find nearby waste disposal hubs with real-time availability, capacity tracking, and comprehensive material acceptance information.</p>
            <Link to="/waste-hubs" className="btn" style={{marginTop: '1.5rem', width: '100%'}}>Explore Hubs</Link>
          </div>

          <div className="card">
            <div style={{fontSize: '3.5rem', marginBottom: '1.5rem'}}>💰</div>
            <h3>Credit Management</h3>
            <p>Earn eco-credits for every kilogram recycled. Track transactions, view analytics, and redeem credits for real cash rewards.</p>
            <Link to="/credits" className="btn" style={{marginTop: '1.5rem', width: '100%'}}>Manage Credits</Link>
          </div>

          <div className="card">
            <div style={{fontSize: '3.5rem', marginBottom: '1.5rem'}}>🏭</div>
            <h3>Material Auctions</h3>
            <p>Companies can participate in waste material auctions and bid on recyclable resources for industrial use.</p>
            <Link to="/auctions" className="btn" style={{marginTop: '1.5rem', width: '100%'}}>View Auctions</Link>
          </div>

          <div className="card">
            <div style={{fontSize: '3.5rem', marginBottom: '1.5rem'}}>📋</div>
            <h3>Material Requirements</h3>
            <p>Post your material needs, get matched with suppliers, and receive automated notifications for perfect matches.</p>
            <Link to="/materials" className="btn" style={{marginTop: '1.5rem', width: '100%'}}>Post Requirements</Link>
          </div>
        </div>

        <h2 className="section-title" style={{marginTop: '5rem'}}>How It Works</h2>
        <div className="card-grid">
          <div className="card">
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: '#A4DD00',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              color: '#2c2c2c',
              marginBottom: '1.5rem',
              fontWeight: 'bold'
            }}>1</div>
            <h3>Find a Hub</h3>
            <p>Use our geospatial search to locate the nearest waste disposal hub. Filter by material type, capacity, and operating hours.</p>
          </div>

          <div className="card">
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: '#A4DD00',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              color: '#2c2c2c',
              marginBottom: '1.5rem',
              fontWeight: 'bold'
            }}>2</div>
            <h3>Dispose Waste</h3>
            <p>Drop off your recyclables at verified hubs. Each material type has specific pricing and acceptance criteria.</p>
          </div>

          <div className="card">
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: '#A4DD00',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              color: '#2c2c2c',
              marginBottom: '1.5rem',
              fontWeight: 'bold'
            }}>3</div>
            <h3>Earn Credits</h3>
            <p>Automatically receive eco-credits based on weight and material type. Track all transactions in your personal dashboard.</p>
          </div>

          <div className="card">
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: '#A4DD00',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              color: '#2c2c2c',
              marginBottom: '1.5rem',
              fontWeight: 'bold'
            }}>4</div>
            <h3>Redeem Rewards</h3>
            <p>Convert credits to cash via bank transfer, mobile banking, or cash pickup. Process typically completes in 24-48 hours.</p>
          </div>
        </div>

        <div style={{
          marginTop: '5rem',
          padding: '4rem',
          background: 'linear-gradient(135deg, #f9f9e8 0%, #A4DD00 100%)',
          borderRadius: '20px',
          textAlign: 'center'
        }}>
          <h2 style={{fontSize: '2.5rem', color: '#2c2c2c', marginBottom: '1rem', fontWeight: '800'}}>
            Ready to Make a Difference?
          </h2>
          <p style={{fontSize: '1.2rem', color: '#424242', marginBottom: '2rem', maxWidth: '700px', margin: '0 auto 2rem'}}>
            Join thousands of users making the planet greener, one recyclable at a time
          </p>
          <Link to="/waste-hubs" className="btn" style={{fontSize: '1.1rem', padding: '1.2rem 3rem'}}>
            Get Started Today
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
