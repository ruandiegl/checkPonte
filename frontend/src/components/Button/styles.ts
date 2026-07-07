import styled from 'styled-components';

export type ButtonVariant = 'primary' | 'danger' | 'secondary';

const variants = {
  primary: {
    background: 'var(--color-accent)',
    color: 'var(--color-bg-primary)',
  },
  danger: {
    background: 'var(--color-danger)',
    color: 'var(--color-text-primary)',
  },
  secondary: {
    background: 'var(--color-bg-header)',
    color: 'var(--color-text-primary)',
  },
} satisfies Record<ButtonVariant, { background: string; color: string }>;

export const ButtonRoot = styled.button<{ $variant?: ButtonVariant; $fullWidth?: boolean }>`
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  min-height: 38px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: ${({ $variant = 'primary' }) => variants[$variant]?.background || variants.primary.background};
  color: ${({ $variant = 'primary' }) => variants[$variant]?.color || variants.primary.color};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  transition: filter 0.2s, opacity 0.2s;

  &:hover:not(:disabled) {
    filter: ${({ $variant = 'primary' }) => ($variant === 'primary' ? 'brightness(0.94)' : 'brightness(1.08)')};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.72;
  }
`;
