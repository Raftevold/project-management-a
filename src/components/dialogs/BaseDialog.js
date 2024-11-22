import React from 'react';
import './DialogStyles.css';

const BaseDialog = ({ title, onClose, children, className = '' }) => {
  // Handle clicking outside dialog to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle ESC key to close dialog
  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div 
      className="dialog-overlay" 
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div className={`dialog-content ${className}`}>
        <h2 id="dialog-title">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default BaseDialog;
