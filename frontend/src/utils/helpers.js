// Format price - BUG-F01: Numbers > 999 displayed without decimal formatting
export const formatPrice = (price) => {
  if (typeof price !== 'number') return '$0.00';
  
  // BUG-F01: Missing decimal formatting for prices > 999
  // Shows 34999 instead of $349.99
  if (price > 999) {
    return `$${Math.floor(price)}`; // Bug: no decimals
  }
  
  return `$${price.toFixed(2)}`;
};

// Format date - used in various pages
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format date for order history - BUG-F07 will be in the component
export const formatDateShort = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Validate email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Truncate text
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get rating display (for use with star components)
export const getRatingDisplay = (rating) => {
  return Math.round(rating * 10) / 10;
};
