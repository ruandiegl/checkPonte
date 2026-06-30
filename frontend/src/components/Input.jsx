import React from 'react';

const Input = ({ label, ...props }) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && <label className="section-label">{label}</label>}
      <input {...props} />
    </div>
  );
};

export default Input;
