import React from 'react';
import { useTheme } from '../ThemeContext';
import FRONTEND_CONFIG from '../config/constants';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        bottom: FRONTEND_CONFIG.UI.TOGGLE_BUTTON.position.bottom,
        right: FRONTEND_CONFIG.UI.TOGGLE_BUTTON.position.right,
        width: FRONTEND_CONFIG.UI.TOGGLE_BUTTON.size,
        height: FRONTEND_CONFIG.UI.TOGGLE_BUTTON.size,
        borderRadius: '50%',
        border: 'none',
        background: theme === 'light' ? FRONTEND_CONFIG.UI.GRADIENTS.lightTheme : FRONTEND_CONFIG.UI.GRADIENTS.darkTheme,
        color: 'white',
        fontSize: '1.5rem',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        zIndex: FRONTEND_CONFIG.UI.TOGGLE_BUTTON.zIndex,
        transition: 'transform 0.3s ease',
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;
