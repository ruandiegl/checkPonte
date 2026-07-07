import styled from 'styled-components';

export const Field = styled.div`
  margin-bottom: 16px;
`;

export const Label = styled.label`
  color: var(--color-text-secondary);
  display: block;
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: uppercase;
`;

export const Control = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-input-border);
  border-radius: 4px;
  background-color: var(--color-input-bg);
  color: var(--color-text-primary);
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: var(--color-accent);
  }
`;
