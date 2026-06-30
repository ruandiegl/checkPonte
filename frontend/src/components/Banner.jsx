import React from 'react';
import { AlertTriangle } from 'lucide-react';

const Banner = ({ children }) => {
  return (
    <div style={{
      backgroundColor: '#7A5C00',
      padding: '12px 16px',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '20px',
      width: '100%'
    }}>
      <AlertTriangle size={20} color="var(--color-accent)" />
      <span style={{ fontSize: '14px', fontWeight: '500' }}>{children}</span>
    </div>
  );
};

export default Banner;
