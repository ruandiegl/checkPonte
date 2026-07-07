import type { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { BannerRoot, BannerText } from './styles';

interface BannerProps {
  children: ReactNode;
}

const Banner = ({ children }: BannerProps) => {
  return (
    <BannerRoot>
      <AlertTriangle size={20} color="var(--color-accent)" />
      <BannerText>{children}</BannerText>
    </BannerRoot>
  );
};

export default Banner;
