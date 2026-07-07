import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ChartBody,
  ChartCard,
  ChartHeader,
  ChartTitle,
  EmptyChartText,
  TooltipBox,
  TooltipDot,
  TooltipLabel,
  TooltipValue,
} from './styles';

export type ChartDatum = {
  id: string | number;
  label: string;
  value: number;
  color?: string;
};

type TooltipPayload = {
  value?: number;
  payload?: ChartDatum;
  color?: string;
};

type ChartTooltipProps = {
  active?: boolean;
  payload?: TooltipPayload[];
  valueLabel: string;
};

type HorizontalBarChartProps = {
  title: React.ReactNode;
  data: ChartDatum[];
  emptyMessage: string;
  valueLabel?: string;
  accentColor?: string;
};

const DEFAULT_ACCENT = '#ff6370';

function truncateLabel(value: string) {
  if (value.length <= 16) return value;
  return `${value.slice(0, 15)}...`;
}

function ChartTooltipContent({ active, payload, valueLabel }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  const item = payload[0];
  const datum = item.payload;
  const color = datum?.color || item.color || DEFAULT_ACCENT;

  return (
    <TooltipBox>
      <TooltipLabel>{datum?.label}</TooltipLabel>
      <TooltipValue>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <TooltipDot $color={color} />
          {valueLabel}
        </span>
        <strong style={{ color: 'var(--color-text-primary)' }}>{item.value ?? 0}</strong>
      </TooltipValue>
    </TooltipBox>
  );
}

export function HorizontalBarChart({
  title,
  data,
  emptyMessage,
  valueLabel = 'Total',
  accentColor = DEFAULT_ACCENT,
}: HorizontalBarChartProps) {
  const chartHeight = Math.max(190, data.length * 26 + 34);
  const maxValue = Math.max(1, ...data.map((item) => item.value || 0));

  return (
    <ChartCard>
      <ChartHeader>
        <ChartTitle>{title}</ChartTitle>
      </ChartHeader>

      {data.length > 0 ? (
        <ChartBody style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 4, right: 8, bottom: 4, left: 0 }}
              barCategoryGap={12}
            >
              <CartesianGrid horizontal={false} stroke="var(--color-border)" strokeOpacity={0.7} />
              <XAxis type="number" hide domain={[0, maxValue]} />
              <YAxis
                type="category"
                dataKey="label"
                width={108}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value: string) => truncateLabel(value)}
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(245, 196, 0, 0.06)' }}
                content={<ChartTooltipContent valueLabel={valueLabel} />}
              />
              <Bar dataKey="value" radius={[0, 5, 5, 0]} barSize={8} background={{ fill: 'var(--color-bg-header)', radius: 5 }}>
                {data.map((entry) => (
                  <Cell key={entry.id} fill={entry.color || accentColor} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartBody>
      ) : (
        <EmptyChartText>{emptyMessage}</EmptyChartText>
      )}
    </ChartCard>
  );
}
