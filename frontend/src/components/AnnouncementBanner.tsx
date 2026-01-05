import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import FRONTEND_CONFIG from '../config/constants';

const API_BASE = API_BASE_URL;

interface Announcement {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  targetAudience: 'all' | 'user' | 'company' | 'admin';
}

const AnnouncementBanner: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    fetchAnnouncements();
    // Load dismissed announcements from localStorage
    const dismissed = localStorage.getItem(FRONTEND_CONFIG.ANNOUNCEMENT.STORAGE_KEY);
    if (dismissed) {
      setDismissedIds(JSON.parse(dismissed));
    }
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`${API_BASE}/announcements/active`);
      if (response.data.announcements) {
        setAnnouncements(response.data.announcements);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const dismissAnnouncement = (id: string) => {
    const newDismissed = [...dismissedIds, id];
    setDismissedIds(newDismissed);
    localStorage.setItem(FRONTEND_CONFIG.ANNOUNCEMENT.STORAGE_KEY, JSON.stringify(newDismissed));
  };

  const getTypeColor = (type: string) => {
    const typeConfig = FRONTEND_CONFIG.ANNOUNCEMENT.TYPES[type as keyof typeof FRONTEND_CONFIG.ANNOUNCEMENT.TYPES];
    if (typeConfig) {
      return { bg: typeConfig.bg, border: typeConfig.border, text: typeConfig.text };
    }
    return { bg: '#F5F5F5', border: '#757575', text: '#424242' };
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = FRONTEND_CONFIG.ANNOUNCEMENT.TYPES[type as keyof typeof FRONTEND_CONFIG.ANNOUNCEMENT.TYPES];
    return typeConfig?.icon || '📢';
  };

  // Filter announcements based on user role and dismissed status
  const visibleAnnouncements = announcements.filter(announcement => {
    if (dismissedIds.includes(announcement._id)) return false;
    
    if (announcement.targetAudience === 'all') return true;
    
    if (!user) return false; // Non-logged in users only see 'all' announcements
    
    return announcement.targetAudience === user.role;
  });

  if (visibleAnnouncements.length === 0) return null;

  return (
    <div style={{ marginBottom: '1rem' }}>
      {visibleAnnouncements.map((announcement) => {
        const colors = getTypeColor(announcement.type);
        return (
          <div
            key={announcement._id}
            style={{
              padding: '1rem 2rem',
              backgroundColor: colors.bg,
              borderLeft: `4px solid ${colors.border}`,
              marginBottom: '0.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
              <span style={{ fontSize: '1.5rem' }}>{getTypeIcon(announcement.type)}</span>
              <div>
                <strong style={{ color: colors.text, fontSize: '1rem' }}>
                  {announcement.title}
                </strong>
                <p style={{ margin: '0.25rem 0 0 0', color: colors.text }}>
                  {announcement.message}
                </p>
              </div>
            </div>
            <button
              onClick={() => dismissAnnouncement(announcement._id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.5rem',
                color: colors.text,
                padding: '0.25rem 0.5rem',
                opacity: 0.6,
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
              title="Dismiss"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default AnnouncementBanner;
