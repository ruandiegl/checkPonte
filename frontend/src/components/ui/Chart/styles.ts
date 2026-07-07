import styled from 'styled-components';

export const ChartCard = styled.section`
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-bg-card);
  padding: 16px;
`;

export const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
`;

export const ChartTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

export const ChartBody = styled.div`
  width: 100%;
  min-height: 190px;

  .recharts-cartesian-axis-tick-value {
    fill: var(--color-text-secondary);
  }

  .recharts-wrapper,
  .recharts-surface,
  .recharts-layer,
  .recharts-wrapper * {
    outline: none;
  }

  .recharts-wrapper *:focus,
  .recharts-wrapper *:focus-visible {
    outline: none;
  }
`;

export const TooltipBox = styled.div`
  min-width: 150px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-card);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.32);
  padding: 10px 12px;
`;

export const TooltipLabel = styled.div`
  margin-bottom: 7px;
  color: var(--color-text-primary);
  font-size: 12px;
  font-weight: 800;
`;

export const TooltipValue = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  color: var(--color-text-secondary);
  font-size: 12px;
`;

export const TooltipDot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: ${({ $color }) => $color};
`;

export const EmptyChartText = styled.p`
  margin: 0;
  padding: 24px 0 14px;
  color: var(--color-text-secondary);
  font-size: 13px;
  text-align: center;
`;
