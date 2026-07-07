import styled from 'styled-components';
import { InputRoot } from '../ui/Input/styles';

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

export const Control = styled(InputRoot)`
  width: 100%;
  border-radius: 4px;
`;
