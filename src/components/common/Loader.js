import React from 'react';
import './Loader.css';

const Loader = ({ size = 'medium', color = 'primary', fullScreen = false }) => {
  const sizeClasses = {
    small: 'loader-small',
    medium: 'loader-medium',
    large: 'loader-large'
  };

  const colorClasses = {
    primary: 'loader-primary',
    secondary: 'loader-secondary',
    accent: 'loader-accent',
    white: 'loader-white'
  };

  const loaderContent = (
    <div className={`loader ${sizeClasses[size]} ${colorClasses[color]}`}>
      <div className="loader-spinner">
        <div className="loader-dot"></div>
        <div className="loader-dot"></div>
        <div className="loader-dot"></div>
        <div className="loader-dot"></div>
      </div>
      <p className="loader-text">Cargando...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loader-fullscreen">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

export default Loader;