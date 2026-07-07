import styled from 'styled-components';

export const InputRoot = styled.input`
  width: 100%;
  min-height: 42px;
  padding: 10px 12px;
  border: 1px solid var(--color-input-border);
  border-radius: 6px;
  background-color: var(--color-input-bg);
  color: var(--color-text-primary);
  font-family: inherit;
  font-size: 14px;
  line-height: 1.35;
  transition: border-color 160ms ease, box-shadow 160ms ease;

  &::placeholder {
    color: var(--color-text-secondary);
  }

  &:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(245, 196, 0, 0.18);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
