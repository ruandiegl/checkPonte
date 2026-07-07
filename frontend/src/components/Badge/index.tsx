import type { HTMLAttributes, ReactNode } from 'react';
import { BadgeRoot } from './styles';
import type { BadgeType } from './styles';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  type?: BadgeType;
}

const Badge = ({ children, type = 'default', ...props }: BadgeProps) => {
  return (
    <BadgeRoot $type={(children || type) as BadgeType} {...props}>
      {children}
    </BadgeRoot>
  );
};

export default Badge;
