import React from 'react';
import './StarRating.css';
import '../styles/StarRating.css';

const StarRating = ({ rating, size = 'medium', interactive = false, onRate }) => {
  const stars = [1, 2, 3, 4, 5];

  const getStarClass = (starNumber) => {
    const diff = rating - starNumber;
    if (diff >= 0) return 'star-full';
    if (diff > -1) return 'star-half';
    return 'star-empty';
  };

  const handleClick = (starNumber) => {
    if (interactive && onRate) {
      onRate(starNumber);
    }
  };

  return (
    <div className={`star-rating star-rating-${size}`}>
      {stars.map(star => (
        <span
          key={star}
          className={`star ${getStarClass(star)} ${interactive ? 'star-interactive' : ''}`}
          onClick={() => handleClick(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
