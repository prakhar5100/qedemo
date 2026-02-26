import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ status, orderId }) => {
  const getStatusClass = () => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  };

  const getStatusText = () => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <span 
      className={`status-badge ${getStatusClass()}`}
      data-testid={orderId ? `order-status-${orderId}` : 'status-badge'}
    >
      {getStatusText()}
    </span>
  );
};

export default StatusBadge;
