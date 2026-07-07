import styled from 'styled-components';

export type BadgeType = 'OK' | 'NC' | 'IMP' | 'master' | 'active' | 'default' | string;

const variants = {
  OK: { background: 'var(--color-success)', color: '#fff' },
  NC: { background: 'var(--color-warning)', color: '#fff' },
  IMP: { background: 'var(--color-danger)', color: '#fff' },
  master: { background: 'var(--color-accent)', color: '#111' },
  active: { background: 'var(--color-success)', color: '#fff' },
  default: { background: 'var(--color-bg-header)', color: '#aaa' },
} as const;

export const BadgeRoot = styled.span<{ $type?: BadgeType }>`
  padding: 2px 8px;
  border-radius: 4px;
  background: ${({ $type = 'default' }) => variants[$type as keyof typeof variants]?.background || variants.default.background};
  color: ${({ $type = 'default' }) => variants[$type as keyof typeof variants]?.color || variants.default.color};
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.45;
  text-transform: uppercase;
`;
