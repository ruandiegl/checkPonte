import React from 'react';

const Input = React.forwardRef(({ label, ...props }, ref) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && <label className="section-label">{label}</label>}
      <input ref={ref} {...props} />
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
