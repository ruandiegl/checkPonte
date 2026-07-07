import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import React from 'react';
import { CheckboxIndicator, CheckboxRoot } from './styles';

const Checkbox = React.forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ ...props }, ref) => (
  <CheckboxRoot ref={ref} {...props}>
    <CheckboxIndicator>
      <Check size={14} strokeWidth={3} />
    </CheckboxIndicator>
  </CheckboxRoot>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export default Checkbox;
