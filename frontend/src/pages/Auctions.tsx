import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const API_BASE = API_BASE_URL;
const COMPANY_ID = '000000000000000000000002'; // Company ABC from seed data

interface Auction {
  _id: string;
  itemName: string;
  wasteType: string;
  quantity: number;
  unit: string;
  startingPrice: number;
  currentBid: number;
  status: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
}

interface Bid {
  _id: string;
  auctionId: string;
  bidderId: string;
  bidAmount: number;
  bidType: string;
  createdAt: string;
}

const Auctions: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [myBids, setMyBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidType, setBidType] = useState('cash');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [auctionsRes, bidsRes] = await Promise.all([
        axios.get(`${API_BASE}/auctions`),
        axios.get(`${API_BASE}/users/${COMPANY_ID}/bids`)
      ]);
      setAuctions(auctionsRes.data.data);
      setMyBids(bidsRes.data.data);
    } catch (error) {
      console.error('Error fetching auctions:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEligibility = async (auctionId: string) => {
    try {
      const response = await axios.post(`${API_BASE}/auctions/${auctionId}/check-eligibility`, {
        userId: COMPANY_ID
      });
      alert(response.data.message);
      return response.data.eligible;
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error checking eligibility');
      return false;
    }
  };

  const placeBid = async () => {
    if (!selectedAuction) return;
    
    try {
      await axios.post(`${API_BASE}/auctions/${selectedAuction._id}/bid`, {
        bidderId: COMPANY_ID,
        bidAmount: parseFloat(bidAmount),
        bidType
      });
      alert('Bid placed successfully!');
      fetchData();
      setSelectedAuction(null);
      setBidAmount('');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error placing bid');
    }
  };

  if (loading) {
    return <div className="loading">Loading auctions...</div>;
  }

  return (
    <>
      <section className="hero">
        <h1>🎯 Waste Material Auctions</h1>
        <p>Bid on recyclable materials and industrial waste resources</p>
      </section>

      <div className="container">
        <h2 className="section-title">Ongoing Auctions</h2>
        
        {auctions.filter(a => a.status === 'live').length === 0 && auctions.length > 0 && (
          <div className="alert alert-info" style={{marginBottom: '2rem'}}>
            💡 Showing all auctions. Filter: {auctions.filter(a => a.status === 'live').length} live, {auctions.filter(a => a.status === 'scheduled').length} scheduled
          </div>
        )}

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}>
          {auctions.map((auction) => (
            <div key={auction._id} style={{
              background: 'white',
              borderRadius: '16px',
              padding: '0',
              boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              border: auction.status === 'live' ? '3px solid #A4DD00' : '1px solid #e0e0e0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1.5rem 2rem',
                background: auction.status === 'live' 
                  ? 'linear-gradient(135deg, #cddc39 0%, #d4e157 100%)'
                  : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                borderBottom: '1px solid rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  flex: 1,
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: '#2c2c2c'
                }}>
                  {auction.wasteType || auction.itemName || 'Material Auction'}
                </div>
                <div style={{fontSize: '1.5rem', marginRight: '1rem'}}>➤</div>
                <div style={{
                  display: 'flex',
                  gap: '2rem',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{fontSize: '0.9rem', color: '#757575'}}>Amount</div>
                    <div style={{
                      fontWeight: 'bold',
                      fontSize: '1.2rem'
                    }}>
                      {auction.quantity} {auction.unit || 'Ton'}
                    </div>
                  </div>
                  <div>
                    <div style={{fontSize: '0.9rem', color: '#757575'}}>Starting Bid</div>
                    <div style={{
                      fontWeight: 'bold',
                      fontSize: '1.2rem'
                    }}>
                      {(auction.startingPrice || 0).toLocaleString()} tk
                    </div>
                  </div>
                  <div>
                    <div style={{fontSize: '0.9rem', color: '#757575'}}>Highest Bid</div>
                    <div style={{
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      color: '#2c2c2c'
                    }}>
                      {(auction.currentBid || 0).toLocaleString()} tk
                    </div>
                  </div>
                  <div>
                    <div style={{fontSize: '0.9rem', color: '#757575'}}>Participants</div>
                    <div style={{
                      fontWeight: 'bold',
                      fontSize: '1.2rem'
                    }}>
                      {Math.floor(Math.random() * 30) + 5}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                padding: '1.5rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{flex: 1}}>
                  <p style={{marginBottom: '0.5rem'}}>
                    <strong>📍 Location:</strong> {auction.location || 'Dhaka, Bangladesh'}
                  </p>
                  <p style={{marginBottom: '0.5rem'}}>
                    <strong>📋 Description:</strong> {auction.description || 'High quality recyclable material'}
                  </p>
                  <p style={{fontSize: '0.9rem', color: '#757575'}}>
                    <strong>🕐 Ends:</strong> {new Date(auction.endTime).toLocaleString()}
                  </p>
                </div>
                <div style={{display: 'flex', gap: '1rem', marginLeft: '2rem'}}>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => checkEligibility(auction._id)}
                  >
                    Check Eligibility
                  </button>
                  <button 
                    className="btn"
                    onClick={() => setSelectedAuction(auction)}
                    disabled={auction.status !== 'live'}
                  >
                    Place Bid
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {auctions.length === 0 && (
          <div className="empty-state">
            <div style={{fontSize: '4rem', marginBottom: '1rem'}}>🎯</div>
            <h3>No auctions available</h3>
            <p>Check back later for new auction opportunities</p>
          </div>
        )}

        <h2 className="section-title" style={{marginTop: '4rem'}}>My Bid History</h2>
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          {myBids.map((bid) => (
            <div key={bid._id} className="card" style={{marginBottom: '1rem'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <h4>৳{bid.bidAmount}</h4>
                  <p style={{fontSize: '0.9rem', color: '#757575'}}>
                    {new Date(bid.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className="badge badge-success">{bid.bidType}</span>
              </div>
            </div>
          ))}
          {myBids.length === 0 && (
            <p style={{textAlign: 'center', color: '#757575', padding: '2rem'}}>
              No bids placed yet
            </p>
          )}
        </div>
      </div>

      {selectedAuction && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{maxWidth: '500px', margin: '2rem'}}>
            <h3>Place Bid for {selectedAuction.itemName}</h3>
            <p style={{marginTop: '1rem'}}>Current Bid: ৳{selectedAuction.currentBid}</p>
            
            <div className="form-group" style={{marginTop: '1.5rem'}}>
              <label>Your Bid Amount (৳)</label>
              <input
                type="number"
                className="form-control"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                min={selectedAuction.currentBid + 1}
                required
              />
            </div>

            <div className="form-group">
              <label>Bid Type</label>
              <select
                className="form-control"
                value={bidType}
                onChange={(e) => setBidType(e.target.value)}
              >
                <option value="cash">Cash</option>
                <option value="credit">Credit</option>
              </select>
            </div>

            <div style={{display: 'flex', gap: '1rem', marginTop: '1.5rem'}}>
              <button 
                className="btn"
                onClick={() => setSelectedAuction(null)}
                style={{flex: 1, backgroundColor: '#757575'}}
              >
                Cancel
              </button>
              <button 
                className="btn"
                onClick={placeBid}
                style={{flex: 1}}
              >
                Submit Bid
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Auctions;
