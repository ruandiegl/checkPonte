import React from 'react';

const Badge = ({ children, type = 'default' }) => {
  const styles = {
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    display: 'inline-block',
  };

  const types = {
    OK: { backgroundColor: 'var(--color-success)', color: '#fff' },
    NC: { backgroundColor: 'var(--color-warning)', color: '#fff' },
    IMP: { backgroundColor: 'var(--color-danger)', color: '#fff' },
    master: { backgroundColor: 'var(--color-accent)', color: '#111' },
    active: { backgroundColor: 'var(--color-success)', color: '#fff' },
    default: { backgroundColor: 'var(--color-bg-header)', color: '#aaa' }
  };

  return (
    <span style={{ ...styles, ...types[children] || types[type] }}>
      {children}
    </span>
  );
};

export default Badge;
