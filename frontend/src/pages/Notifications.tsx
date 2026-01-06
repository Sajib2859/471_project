import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const API_BASE = API_BASE_URL;

interface Notification {
  _id: string;
  recipientId: string;
  type: string;
  title: string;
  message: string;
  relatedId?: string;
  relatedType?: string;
  isRead: boolean;
  priority?: string;
  createdAt: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserId(user._id || user.id);
      fetchNotifications(user._id || user.id);
    } else {
      setLoading(false);
    }
  }, [filter]);

  const fetchNotifications = async (uid: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE}/users/${uid}/notifications`,
        {
          params: { unreadOnly: filter === 'unread' ? 'true' : 'false' }
        }
      );
      setNotifications(response.data.data);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await axios.put(`${API_BASE}/notifications/${notificationId}/read`);
      // Refresh notifications
      if (userId) {
        fetchNotifications(userId);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`${API_BASE}/users/${userId}/notifications/read-all`);
      // Refresh notifications
      if (userId) {
        fetchNotifications(userId);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await axios.delete(`${API_BASE}/notifications/${notificationId}`);
      // Refresh notifications
      if (userId) {
        fetchNotifications(userId);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      deposit_validation: '✅',
      campaign_update: '📢',
      auction_activity: '🔨',
      direct_message: '💬',
      credit_redemption: '💰',
      auction_match: '🎯',
      inventory_match: '📦',
      price_alert: '💵',
      bid_update: '📊',
      auction_won: '🏆'
    };
    return icons[type] || '🔔';
  };

  const getPriorityColor = (priority?: string) => {
    const colors: Record<string, string> = {
      low: '#2196F3',
      medium: '#FF9800',
      high: '#F44336'
    };
    return colors[priority || 'medium'];
  };

  if (!userId) {
    return (
      <>
        <section className="hero">
          <h1>Notifications</h1>
          <p>Stay updated with your account activities</p>
        </section>
        <div className="container" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <p>Please log in to view your notifications.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <section className="hero">
        <h1>🔔 Notifications</h1>
        <p>Stay updated with your account activities</p>
      </section>

      <div className="container" style={{ padding: '3rem 2rem' }}>
        {/* Header with filters and actions */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>Your Notifications</h2>
            {unreadCount > 0 && (
              <span style={{
                background: '#F44336',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 'bold'
              }}>
                {unreadCount} unread
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilter('all')}
              className="btn"
              style={{
                background: filter === 'all' ? '#A4DD00' : '#f5f5f5',
                color: filter === 'all' ? '#2c2c2c' : '#666',
                padding: '0.5rem 1rem'
              }}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className="btn"
              style={{
                background: filter === 'unread' ? '#A4DD00' : '#f5f5f5',
                color: filter === 'unread' ? '#2c2c2c' : '#666',
                padding: '0.5rem 1rem'
              }}
            >
              Unread
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="btn"
                style={{
                  background: '#2196F3',
                  color: 'white',
                  padding: '0.5rem 1rem'
                }}
              >
                Mark All as Read
              </button>
            )}
          </div>
        </div>

        {/* Notifications list */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</p>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className="card"
                style={{
                  background: notification.isRead ? 'white' : '#f0f7ff',
                  borderLeft: `4px solid ${getPriorityColor(notification.priority)}`,
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>
                        {getNotificationIcon(notification.type)}
                      </span>
                      <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <span style={{
                          width: '10px',
                          height: '10px',
                          background: '#A4DD00',
                          borderRadius: '50%',
                          display: 'inline-block'
                        }} />
                      )}
                    </div>
                    
                    <p style={{ margin: '0.5rem 0', color: '#555' }}>
                      {notification.message}
                    </p>

                    <div style={{ 
                      display: 'flex', 
                      gap: '1rem', 
                      fontSize: '0.85rem', 
                      color: '#999',
                      marginTop: '0.5rem'
                    }}>
                      <span>
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                      <span style={{ 
                        background: '#e0e0e0', 
                        padding: '0.15rem 0.5rem', 
                        borderRadius: '10px',
                        fontSize: '0.75rem'
                      }}>
                        {notification.type.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                    {!notification.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification._id);
                        }}
                        style={{
                          background: '#4CAF50',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '0.85rem'
                        }}
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Delete this notification?')) {
                          deleteNotification(notification._id);
                        }
                      }}
                      style={{
                        background: '#f44336',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;
