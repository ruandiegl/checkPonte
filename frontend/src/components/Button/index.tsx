import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { ButtonRoot } from './styles';
import type { ButtonVariant } from './styles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
  style?: CSSProperties;
}

const Button = ({ children, variant = 'primary', loading = false, fullWidth = false, style, ...props }: ButtonProps) => {
  return (
    <ButtonRoot
      $variant={variant}
      $fullWidth={fullWidth}
      style={style}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? 'Carregando...' : children}
    </ButtonRoot>
  );
};

export default Button;
