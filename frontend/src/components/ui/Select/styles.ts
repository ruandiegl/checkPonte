import * as SelectPrimitive from '@radix-ui/react-select';
import styled from 'styled-components';

export const SelectTrigger = styled(SelectPrimitive.Trigger)`
  width: 100%;
  min-height: 42px;
  padding: 10px 12px;
  border: 1px solid var(--color-input-border);
  border-radius: 6px;
  background-color: var(--color-input-bg);
  color: var(--color-text-primary);
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.35;
  cursor: pointer;
  transition: border-color 160ms ease, box-shadow 160ms ease;

  &:hover {
    border-color: var(--color-accent);
  }

  &:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(245, 196, 0, 0.18);
  }

  &[data-placeholder] {
    color: var(--color-text-secondary);
  }

  &[data-disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const SelectValue = styled(SelectPrimitive.Value)`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SelectIcon = styled(SelectPrimitive.Icon)`
  color: var(--color-text-secondary);
  display: inline-flex;
  flex: 0 0 auto;
`;

export const SelectContent = styled(SelectPrimitive.Content)`
  z-index: 300;
  width: var(--radix-select-trigger-width);
  max-height: min(320px, var(--radix-select-content-available-height));
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-bg-card);
  color: var(--color-text-primary);
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.48);
`;

export const SelectViewport = styled(SelectPrimitive.Viewport)`
  padding: 6px;
`;

export const SelectItemRoot = styled(SelectPrimitive.Item)`
  min-height: 38px;
  padding: 9px 34px 9px 11px;
  border-radius: 6px;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  position: relative;
  font-size: 14px;
  line-height: 1.25;
  cursor: pointer;
  user-select: none;

  &[data-highlighted] {
    outline: none;
    background-color: rgba(245, 196, 0, 0.12);
    color: var(--color-accent);
  }

  &[data-disabled] {
    pointer-events: none;
    opacity: 0.45;
  }
`;

export const SelectItemText = styled(SelectPrimitive.ItemText)`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SelectItemIndicator = styled(SelectPrimitive.ItemIndicator)`
  position: absolute;
  right: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent);
`;
