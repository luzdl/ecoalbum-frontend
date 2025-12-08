import React from 'react';
import './Button.css';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const getVariantClass = () => {
    const variants = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      accent: 'btn-accent',
      outline: 'btn-outline',
      ghost: 'btn-ghost',
      danger: 'btn-danger'
    };
    return variants[variant] || variants.primary;
  };

  const getSizeClass = () => {
    const sizes = {
      small: 'btn-small',
      medium: 'btn-medium',
      large: 'btn-large'
    };
    return sizes[size] || sizes.medium;
  };

  const buttonClasses = [
    'btn',
    getVariantClass(),
    getSizeClass(),
    fullWidth ? 'btn-full-width' : '',
    disabled ? 'btn-disabled' : '',
    className
  ].filter(Boolean).join(' ');

  const renderIcon = () => {
    if (!icon) return null;
    
    if (typeof icon === 'string') {
      return <span className="btn-icon-text">{icon}</span>;
    }
    
    return <span className="btn-icon">{icon}</span>;
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="btn-loader">
          <span className="btn-loader-dot"></span>
          <span className="btn-loader-dot"></span>
          <span className="btn-loader-dot"></span>
        </span>
      )}
      
      {!loading && icon && iconPosition === 'left' && renderIcon()}
      <span className="btn-content">{children}</span>
      {!loading && icon && iconPosition === 'right' && renderIcon()}
    </button>
  );
};

export default Button;