import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ 
  message = 'Ha ocurrido un error', 
  details = null, 
  onRetry = null,
  variant = 'default',
  icon = true
}) => {
  const getVariantClass = () => {
    const variants = {
      default: 'error-default',
      warning: 'error-warning',
      danger: 'error-danger',
      info: 'error-info'
    };
    return variants[variant] || variants.default;
  };

  return (
    <div className={`error-message ${getVariantClass()}`}>
      {icon && (
        <div className="error-icon">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
      )}
      
      <div className="error-content">
        <h3 className="error-title">Error</h3>
        <p className="error-message-text">{message}</p>
        
        {details && (
          <details className="error-details">
            <summary className="error-details-summary">Más información</summary>
            <pre className="error-details-content">{details}</pre>
          </details>
        )}
      </div>
      
      {onRetry && (
        <button 
          className="error-retry-button" 
          onClick={onRetry}
          aria-label="Reintentar"
        >
          Reintentar
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;