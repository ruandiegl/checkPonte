import React, { type InputHTMLAttributes } from 'react';
import { Control, Field, Label } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, ...props }, ref) => {
  return (
    <Field>
      {label && <Label>{label}</Label>}
      <Control ref={ref} {...props} />
    </Field>
  );
});

Input.displayName = 'Input';

export default Input;
