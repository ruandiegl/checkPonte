import styled from 'styled-components';

export const EmptyRoot = styled.div`
  display: flex;
  min-height: 190px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 26px 18px;
  color: var(--color-text-secondary);
  text-align: center;
`;

export const EmptyIcon = styled.div`
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-bg-header);
  color: var(--color-accent);
`;

export const EmptyTitle = styled.h3`
  margin: 0;
  color: var(--color-text-primary);
  font-size: 15px;
  font-weight: 800;
`;

export const EmptyDescription = styled.p`
  max-width: 360px;
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.45;
`;
