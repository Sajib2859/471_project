import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const API_BASE = API_BASE_URL;

interface ICompanyAnalytics {
  auctionsWon: any[];
  materialsAcquired: any[];
  transactionHistory: any[];
  spendingTrend: any[];
  totalStats: {
    totalAuctions: number;
    totalQuantity: number;
    totalSpent: number;
  };
}

const CompanyAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<ICompanyAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
  const [companyId, setCompanyId] = useState('');

  useEffect(() => {
    // Get company user from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCompanyId(user.id);
      fetchAnalytics(user.id);
    } else {
      setLoading(false);
    }
  }, [dateFilter]);

  const fetchAnalytics = async (cid: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/analytics/company/${cid}`, {
        params: {
          startDate: dateFilter.startDate || undefined,
          endDate: dateFilter.endDate || undefined
        }
      });
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching company analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!companyId) {
    return (
      <>
        <section className="hero">
          <h1>Company Analytics</h1>
          <p>Track your participation and performance</p>
        </section>
        <div className="container" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <p>Please log in as a company to view analytics.</p>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <section className="hero">
          <h1>🏭 Company Analytics</h1>
          <p>Track your participation and performance</p>
        </section>
        <div className="container" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <p>Loading analytics...</p>
        </div>
      </>
    );
  }

  if (!analytics) {
    return (
      <>
        <section className="hero">
          <h1>🏭 Company Analytics</h1>
          <p>Track your participation and performance</p>
        </section>
        <div className="container" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <p>No analytics data available.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <section className="hero">
        <h1>🏭 Company Analytics</h1>
        <p>Track your participation and performance</p>
      </section>

      <div className="container" style={{ padding: '3rem 2rem' }}>
        {/* Date Filter */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>Date Range Filter</h3>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Start Date</label>
              <input
                type="date"
                value={dateFilter.startDate}
                onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
                className="form-control"
                style={{ padding: '0.5rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>End Date</label>
              <input
                type="date"
                value={dateFilter.endDate}
                onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
                className="form-control"
                style={{ padding: '0.5rem' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                onClick={() => setDateFilter({ startDate: '', endDate: '' })}
                className="btn"
                style={{ background: '#f5f5f5', color: '#666' }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>Total Auctions Won</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>
              {analytics.totalStats.totalAuctions}
            </p>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>Total Materials (kg)</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>
              {analytics.totalStats.totalQuantity.toFixed(2)}
            </p>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', color: 'white' }}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>Total Spent</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>
              ${analytics.totalStats.totalSpent.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Auctions Won by Material Type */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>🎯 Auctions Won by Material Type</h3>
          {analytics.auctionsWon.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              No auctions won yet
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              {analytics.auctionsWon.map((item, index) => (
                <div key={index} style={{
                  padding: '1.5rem',
                  background: '#f5f5f5',
                  borderRadius: '8px',
                  borderLeft: '4px solid #A4DD00'
                }}>
                  <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem', textTransform: 'capitalize' }}>
                    {item._id}
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2c2c2c', marginBottom: '0.5rem' }}>
                    {item.count}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>
                    {item.totalQuantity.toFixed(2)} kg
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#2196F3', fontWeight: 'bold' }}>
                    ${item.totalAmount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Materials Acquired */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>📦 Recent Materials Acquired</h3>
          {analytics.materialsAcquired.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              No materials acquired yet
            </p>
          ) : (
            <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Title</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Material Type</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Quantity</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Amount Paid</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.materialsAcquired.slice(0, 10).map((item: any) => (
                    <tr key={item._id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1rem' }}>{item.title}</td>
                      <td style={{ padding: '1rem', textTransform: 'capitalize' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          background: '#A4DD00',
                          color: '#2c2c2c',
                          borderRadius: '12px',
                          fontSize: '0.85rem'
                        }}>
                          {item.materialType}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>
                        {item.quantity} {item.unit}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', color: '#2196F3' }}>
                        ${item.currentBid.toFixed(2)}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#666' }}>
                        {new Date(item.endTime).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Spending Trend */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>💰 Spending Trend</h3>
          {analytics.spendingTrend.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              No spending data available
            </p>
          ) : (
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {analytics.spendingTrend.map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    background: '#f5f5f5',
                    borderRadius: '8px'
                  }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>
                        {new Date(item._id.date).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>
                        {item.auctionCount} auction{item.auctionCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2196F3' }}>
                      ${item.totalSpent.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <h3>📊 Recent Transaction History</h3>
          {analytics.transactionHistory.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              No transactions yet
            </p>
          ) : (
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {analytics.transactionHistory.slice(0, 15).map((log: any) => (
                <div
                  key={log._id}
                  style={{
                    padding: '1rem',
                    background: '#f5f5f5',
                    borderRadius: '8px',
                    borderLeft: '4px solid #2196F3'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                        {log.action}
                      </div>
                      {log.details && (
                        <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem' }}>
                          {log.details}
                        </div>
                      )}
                      <div style={{ fontSize: '0.75rem', color: '#999' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        background: '#e0e0e0',
                        borderRadius: '12px',
                        fontSize: '0.75rem'
                      }}>
                        {log.actionType}
                      </span>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        background: '#2196F3',
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '0.75rem'
                      }}>
                        {log.resourceType}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CompanyAnalytics;
