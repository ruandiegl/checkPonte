import React from 'react';

const Button = ({ children, variant = 'primary', loading = false, fullWidth = false, style, ...props }) => {
  const baseStyle = {
    padding: '8px 16px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
    width: fullWidth ? '100%' : 'auto',
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--color-accent)',
      color: 'var(--color-bg-primary)',
    },
    danger: {
      backgroundColor: 'var(--color-danger)',
      color: 'var(--color-text-primary)',
    },
    secondary: {
      backgroundColor: 'var(--color-bg-header)',
      color: 'var(--color-text-primary)',
    }
  };

  const mergedStyle = { ...baseStyle, ...variants[variant], ...style };

  return (
    <button
      style={mergedStyle}
      disabled={loading || props.disabled}
      onMouseOver={(e) => {
        if (variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)';
      }}
      onMouseOut={(e) => {
        if (variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--color-accent)';
      }}
      {...props}
    >
      {loading ? 'Carregando...' : children}
    </button>
  );
};

export default Button;
