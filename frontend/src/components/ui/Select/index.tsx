import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import React from 'react';
import {
  SelectContent,
  SelectIcon,
  SelectItemIndicator,
  SelectItemRoot,
  SelectItemText,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from './styles';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<ComponentPropsWithoutRef<typeof SelectPrimitive.Root>, 'onValueChange'> {
  options: SelectOption[];
  placeholder?: string;
  onValueChange: (value: string) => void;
  'aria-label'?: string;
}

const Select = React.forwardRef<ElementRef<typeof SelectPrimitive.Trigger>, SelectProps>(
  ({ options, placeholder, value, onValueChange, disabled, 'aria-label': ariaLabel, ...props }, ref) => {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled} {...props}>
      <SelectTrigger ref={ref} aria-label={ariaLabel}>
        <SelectValue placeholder={placeholder} />
        <SelectIcon>
          <ChevronDown size={16} />
        </SelectIcon>
      </SelectTrigger>
      <SelectPrimitive.Portal>
        <SelectContent position="popper" sideOffset={6}>
          <SelectViewport>
            {options.map((option) => (
              <SelectItemRoot key={option.value} value={option.value} disabled={option.disabled}>
                <SelectItemText>{option.label}</SelectItemText>
                <SelectItemIndicator>
                  <Check size={15} strokeWidth={3} />
                </SelectItemIndicator>
              </SelectItemRoot>
            ))}
          </SelectViewport>
        </SelectContent>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
});

Select.displayName = 'Select';

export default Select;
