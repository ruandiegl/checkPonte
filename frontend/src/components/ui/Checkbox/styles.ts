import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import styled from 'styled-components';

export const CheckboxRoot = styled(CheckboxPrimitive.Root)`
  width: 20px;
  height: 20px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: var(--color-input-bg);
  color: #111111;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  cursor: pointer;
  transition: border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease;

  &:hover {
    border-color: var(--color-accent);
  }

  &:focus-visible {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 2px rgba(245, 196, 0, 0.22);
  }

  &[data-state='checked'] {
    border-color: var(--color-accent);
    background-color: var(--color-accent);
  }

  &[data-disabled] {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

export const CheckboxIndicator = styled(CheckboxPrimitive.Indicator)`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
