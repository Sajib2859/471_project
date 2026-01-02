import React, { useState } from 'react';
import FRONTEND_CONFIG from '../config/constants';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  onRatingChange, 
  readonly = false,
  size = 'medium' 
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeStyles = {
    small: { fontSize: '1rem' },
    medium: { fontSize: '1.5rem' },
    large: { fontSize: '2rem' }
  };

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div style={{ display: 'inline-flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleClick(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          style={{
            ...sizeStyles[size],
            cursor: readonly ? 'default' : 'pointer',
            color: star <= (hoverRating || rating) ? FRONTEND_CONFIG.RATING.COLORS.filled : FRONTEND_CONFIG.RATING.COLORS.empty,
            transition: 'color 0.2s ease'
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
