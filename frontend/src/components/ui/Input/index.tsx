import type { ComponentPropsWithoutRef } from 'react';
import React from 'react';
import { InputRoot } from './styles';

const Input = React.forwardRef<HTMLInputElement, ComponentPropsWithoutRef<'input'>>(
  ({ ...props }, ref) => <InputRoot ref={ref} {...props} />,
);

Input.displayName = 'Input';

export default Input;
