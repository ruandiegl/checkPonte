import React from 'react';
import { LogOut } from 'lucide-react';
import Badge from '../Badge';
import vulcanoLogo from '../../assets/vulcano-logo-transparent.png';
import { getNavigationLinks } from '../../utils/navigation';
import type { AppUser } from '../../types/domain';
import {
  Avatar,
  BottomNav,
  BottomNavItem,
  BrandLink,
  BrandLogo,
  BrandSurface,
  DesktopLinks,
  LogoutButton,
  NavbarActions,
  NavbarItem,
  NavbarMain,
  NavbarRoot,
  NavbarUser,
  UserCopy,
  UserName,
} from './styles';

interface NavbarProps {
  user?: AppUser | null;
  onLogout: () => void;
}

const Navbar = ({ user, onLogout }: NavbarProps) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const links = getNavigationLinks(user);

  const initials = user?.name
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'VU';

  return (
    <>
      <NavbarRoot>
        <NavbarMain>
          <BrandLink to="/checklist">
            <BrandSurface>
              <BrandLogo src={vulcanoLogo} alt="Metalúrgica Vulcano" />
            </BrandSurface>
          </BrandLink>

          <DesktopLinks>
            {links.map((link) => (
              <NavbarItem
                key={link.to}
                to={link.to}
                className={({ isActive }) => (isActive ? 'is-active' : '')}
              >
                {link.label}
              </NavbarItem>
            ))}
          </DesktopLinks>
        </NavbarMain>

        <NavbarActions>
          <NavbarUser>
            <Avatar>{initials}</Avatar>
            <UserCopy>
              <UserName>{user?.name}</UserName>
              <Badge type={user?.role}>{user?.role}</Badge>
            </UserCopy>
          </NavbarUser>

          <LogoutButton type="button" onClick={() => setShowLogoutConfirm(true)} aria-label="Sair">
            <LogOut size={18} />
          </LogoutButton>
        </NavbarActions>
      </NavbarRoot>

      <BottomNav aria-label="Navegação principal">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <BottomNavItem
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'is-active' : '')}
            >
              <Icon size={21} />
              <span>{link.shortLabel}</span>
            </BottomNavItem>
          );
        })}
      </BottomNav>

      {showLogoutConfirm && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-modal-title"
          onPointerDown={(event: React.PointerEvent<HTMLDivElement>) => {
            if (event.target === event.currentTarget) setShowLogoutConfirm(false);
          }}
        >
          <div className="modal-panel" style={{ width: 'min(420px, 100%)' }}>
            <div className="modal-header">
              <div>
                <h2 id="logout-modal-title" style={{ fontSize: '18px' }}>Sair do sistema</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px', marginTop: '4px' }}>
                  Sua sessão atual será encerrada.
                </p>
              </div>
              <button type="button" className="icon-action" onClick={() => setShowLogoutConfirm(false)} aria-label="Fechar">
                ×
              </button>
            </div>

            <div className="modal-body">
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                Deseja realmente sair da aplicação?
              </p>
            </div>

            <div className="modal-footer">
              <button type="button" onClick={() => setShowLogoutConfirm(false)} style={{ backgroundColor: '#AAAAAA', color: '#333333' }}>
                Cancelar
              </button>
              <button type="button" onClick={onLogout} style={{ backgroundColor: 'var(--color-danger)', color: '#fff' }}>
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
