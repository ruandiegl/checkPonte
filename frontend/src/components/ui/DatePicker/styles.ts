import * as PopoverPrimitive from '@radix-ui/react-popover';
import styled from 'styled-components';

export const DateButton = styled.button`
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

  &:focus-visible {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(245, 196, 0, 0.18);
  }

  svg {
    color: var(--color-text-secondary);
    flex: 0 0 auto;
  }
`;

export const CalendarPanel = styled(PopoverPrimitive.Content)`
  z-index: 320;
  width: min(318px, calc(100vw - 24px));
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-bg-card);
  color: var(--color-text-primary);
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.48);
`;

export const CalendarHeader = styled.div`
  display: grid;
  grid-template-columns: 36px 1fr 36px;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;

  strong {
    font-size: 13px;
    text-align: center;
    text-transform: capitalize;
  }
`;

export const MonthButton = styled.button`
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background-color: var(--color-bg-header);
  color: var(--color-text-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: var(--color-accent);
  }
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 4px;
`;

export const Weekday = styled.span`
  min-height: 26px;
  color: var(--color-text-secondary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
`;

export const DayButton = styled.button<{ $selected?: boolean; $outside?: boolean }>`
  aspect-ratio: 1;
  min-width: 0;
  padding: 0;
  border: 1px solid ${({ $selected }) => ($selected ? 'var(--color-accent)' : 'transparent')};
  border-radius: 6px;
  background-color: ${({ $selected }) => ($selected ? 'var(--color-accent)' : 'transparent')};
  color: ${({ $selected, $outside }) => {
    if ($selected) return '#111111';
    if ($outside) return 'var(--color-text-secondary)';
    return 'var(--color-text-primary)';
  }};
  opacity: ${({ $outside }) => ($outside ? 0.55 : 1)};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;

  &:hover {
    border-color: var(--color-accent);
    background-color: ${({ $selected }) => ($selected ? 'var(--color-accent)' : 'rgba(245, 196, 0, 0.1)')};
  }
`;
