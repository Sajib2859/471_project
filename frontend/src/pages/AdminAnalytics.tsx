import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const API_BASE = API_BASE_URL;

interface AnalyticsData {
  platformUsage?: any;
  wasteAnalytics?: any;
  campaignAnalytics?: any;
  userEngagement?: any;
}

const AdminAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'platform' | 'waste' | 'campaigns' | 'engagement'>('platform');
  const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [activeTab, dateFilter]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      const params = {
        startDate: dateFilter.startDate || undefined,
        endDate: dateFilter.endDate || undefined
      };

      let response;
      switch (activeTab) {
        case 'platform':
          response = await axios.get(`${API_BASE}/analytics/platform-usage`, { params });
          setAnalytics({ ...analytics, platformUsage: response.data.data });
          break;
        case 'waste':
          response = await axios.get(`${API_BASE}/analytics/waste`, { params });
          setAnalytics({ ...analytics, wasteAnalytics: response.data.data });
          break;
        case 'campaigns':
          response = await axios.get(`${API_BASE}/analytics/campaigns`, { params });
          setAnalytics({ ...analytics, campaignAnalytics: response.data.data });
          break;
        case 'engagement':
          response = await axios.get(`${API_BASE}/analytics/user-engagement`, { params });
          setAnalytics({ ...analytics, userEngagement: response.data.data });
          break;
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (type: string) => {
    try {
      setExporting(true);
      const params = {
        type,
        startDate: dateFilter.startDate || undefined,
        endDate: dateFilter.endDate || undefined
      };

      const response = await axios.get(`${API_BASE}/analytics/export`, {
        params,
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      alert(`${type} data exported successfully!`);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const renderPlatformUsage = () => {
    const data = analytics.platformUsage;
    if (!data) return null;

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Summary Cards */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <h3>Total Users</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '1rem 0' }}>{data.totalUsers}</p>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
          <h3>Active Users</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '1rem 0' }}>{data.activeUsersCount}</p>
        </div>

        {/* Activity by Type */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <h3>Activity by Type</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {data.activityByType?.map((item: any) => (
              <div key={item._id} style={{ textAlign: 'center', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#A4DD00' }}>{item.count}</div>
                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>{item._id}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Users by Role */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <h3>Users by Role</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {data.usersByRole?.map((item: any) => (
              <div key={item._id} style={{ 
                padding: '1.5rem', 
                background: item._id === 'admin' ? '#ff5722' : item._id === 'company' ? '#2196F3' : '#4CAF50',
                color: 'white',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{item.count}</div>
                <div style={{ fontSize: '1rem', marginTop: '0.5rem', textTransform: 'capitalize' }}>{item._id}s</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderWasteAnalytics = () => {
    const data = analytics.wasteAnalytics;
    if (!data) return null;

    return (
      <div style={{ display: 'grid', gap: '2rem' }}>
        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', color: 'white' }}>
            <h3>Total Deposits</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '1rem 0' }}>{data.totalDeposits}</p>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
            <h3>Credits Earned</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '1rem 0' }}>{data.totalCreditsEarned?.toFixed(2)}</p>
          </div>
        </div>

        {/* Waste by Type */}
        <div className="card">
          <h3>Waste Collected by Type</h3>
          <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Waste Type</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Total Quantity (kg)</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Count</th>
                </tr>
              </thead>
              <tbody>
                {data.wasteByType?.map((item: any, index: number) => (
                  <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{item._id}</td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>{item.totalQuantity.toFixed(2)}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Contributors */}
        <div className="card">
          <h3>🏆 Top Contributors</h3>
          <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>User</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Deposits</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Total Waste (kg)</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Credits Earned</th>
                </tr>
              </thead>
              <tbody>
                {data.topContributors?.map((item: any, index: number) => (
                  <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem' }}>
                      <div>{item.userName || 'Unknown'}</div>
                      <div style={{ fontSize: '0.85rem', color: '#999' }}>{item.userEmail}</div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>{item.depositCount}</td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>{item.totalQuantity.toFixed(2)}</td>
                    <td style={{ padding: '1rem', textAlign: 'right', color: '#A4DD00', fontWeight: 'bold' }}>{item.totalCredits.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recyclable Stats */}
        <div className="card">
          <h3>Recyclable vs Non-Recyclable</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {data.recyclableStats?.map((item: any) => (
              <div key={item._id.toString()} style={{ 
                padding: '1.5rem', 
                background: item._id ? '#4CAF50' : '#FF5722',
                color: 'white',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{item.totalQuantity.toFixed(2)} kg</div>
                <div style={{ fontSize: '1rem', marginTop: '0.5rem' }}>{item._id ? 'Recyclable' : 'Non-Recyclable'}</div>
                <div style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>({item.count} deposits)</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCampaignAnalytics = () => {
    const data = analytics.campaignAnalytics;
    if (!data) return null;

    return (
      <div style={{ display: 'grid', gap: '2rem' }}>
        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <h3>Total Campaigns</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '1rem 0' }}>{data.totalCampaigns}</p>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <h3>Total Participants</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '1rem 0' }}>{data.totalParticipants}</p>
          </div>
        </div>

        {/* Campaigns by Status */}
        <div className="card">
          <h3>Campaigns by Status</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {data.campaignsByStatus?.map((item: any) => (
              <div key={item._id} style={{ 
                textAlign: 'center', 
                padding: '1.5rem', 
                background: item._id === 'active' ? '#4CAF50' : item._id === 'upcoming' ? '#2196F3' : '#9E9E9E',
                color: 'white',
                borderRadius: '8px' 
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{item.count}</div>
                <div style={{ fontSize: '1rem', marginTop: '0.5rem', textTransform: 'capitalize' }}>{item._id}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Campaigns */}
        <div className="card">
          <h3>🌟 Most Successful Campaigns</h3>
          <div style={{ marginTop: '1rem' }}>
            {data.topCampaigns?.slice(0, 5).map((campaign: any, index: number) => (
              <div key={campaign._id} style={{ 
                padding: '1rem', 
                marginBottom: '1rem', 
                background: '#f5f5f5', 
                borderRadius: '8px',
                borderLeft: '4px solid #A4DD00'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                      #{index + 1} {campaign.title}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                      {campaign.description}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                      <span style={{ background: '#A4DD00', color: '#2c2c2c', padding: '0.25rem 0.75rem', borderRadius: '12px' }}>
                        {campaign.participantCount} participants
                      </span>
                      <span style={{ background: '#2196F3', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '12px' }}>
                        {campaign.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderUserEngagement = () => {
    const data = analytics.userEngagement;
    if (!data) return null;

    return (
      <div style={{ display: 'grid', gap: '2rem' }}>
        {/* Most Active Users */}
        <div className="card">
          <h3>🏅 Most Active Users</h3>
          <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Rank</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>User</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Activity Count</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {data.mostActiveUsers?.map((user: any, index: number) => (
                  <tr key={user._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>#{index + 1}</td>
                    <td style={{ padding: '1rem' }}>{user.userName}</td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', color: '#A4DD00' }}>
                      {user.activityCount}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#666' }}>
                      {new Date(user.lastActivity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity by Resource */}
        <div className="card">
          <h3>Activity by Resource Type</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {data.activityByResource?.map((item: any) => (
              <div key={item._id} style={{ 
                textAlign: 'center', 
                padding: '1.5rem', 
                background: '#f5f5f5', 
                borderRadius: '8px',
                border: '2px solid #A4DD00'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#A4DD00' }}>{item.count}</div>
                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>{item._id}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <section className="hero">
        <h1>📊 Analytics & Reports</h1>
        <p>Platform insights and data visualization</p>
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
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
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

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          marginBottom: '2rem', 
          borderBottom: '2px solid #e0e0e0',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveTab('platform')}
            style={{
              padding: '1rem 2rem',
              background: activeTab === 'platform' ? '#A4DD00' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'platform' ? '3px solid #A4DD00' : 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: activeTab === 'platform' ? '#2c2c2c' : '#666'
            }}
          >
            Platform Usage
          </button>
          <button
            onClick={() => setActiveTab('waste')}
            style={{
              padding: '1rem 2rem',
              background: activeTab === 'waste' ? '#A4DD00' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'waste' ? '3px solid #A4DD00' : 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: activeTab === 'waste' ? '#2c2c2c' : '#666'
            }}
          >
            Waste Analytics
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            style={{
              padding: '1rem 2rem',
              background: activeTab === 'campaigns' ? '#A4DD00' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'campaigns' ? '3px solid #A4DD00' : 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: activeTab === 'campaigns' ? '#2c2c2c' : '#666'
            }}
          >
            Campaigns
          </button>
          <button
            onClick={() => setActiveTab('engagement')}
            style={{
              padding: '1rem 2rem',
              background: activeTab === 'engagement' ? '#A4DD00' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'engagement' ? '3px solid #A4DD00' : 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: activeTab === 'engagement' ? '#2c2c2c' : '#666'
            }}
          >
            User Engagement
          </button>
        </div>

        {/* Export Buttons */}
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => exportData('deposits')}
            className="btn"
            disabled={exporting}
            style={{ background: '#4CAF50', color: 'white' }}
          >
            📥 Export Deposits
          </button>
          <button
            onClick={() => exportData('campaigns')}
            className="btn"
            disabled={exporting}
            style={{ background: '#2196F3', color: 'white' }}
          >
            📥 Export Campaigns
          </button>
          <button
            onClick={() => exportData('auctions')}
            className="btn"
            disabled={exporting}
            style={{ background: '#FF9800', color: 'white' }}
          >
            📥 Export Auctions
          </button>
          <button
            onClick={() => exportData('activity-logs')}
            className="btn"
            disabled={exporting}
            style={{ background: '#9C27B0', color: 'white' }}
          >
            📥 Export Activity Logs
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Loading analytics...</p>
          </div>
        ) : (
          <>
            {activeTab === 'platform' && renderPlatformUsage()}
            {activeTab === 'waste' && renderWasteAnalytics()}
            {activeTab === 'campaigns' && renderCampaignAnalytics()}
            {activeTab === 'engagement' && renderUserEngagement()}
          </>
        )}
      </div>
    </>
  );
};

export default AdminAnalytics;
