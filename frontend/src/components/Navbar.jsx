import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, ClipboardCheck, FileText, History, LogOut, Settings } from 'lucide-react';
import Badge from './Badge';

const Navbar = ({ user, onLogout }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  const links = [
    { to: '/checklist', label: 'Checklist', shortLabel: 'Checklist', icon: ClipboardCheck, show: true },
    { to: '/dashboard', label: 'Dashboard', shortLabel: 'Painel', icon: BarChart3, show: user?.role === 'master' },
    { to: '/history', label: 'Histórico', shortLabel: 'Histórico', icon: History, show: user?.role === 'master' },
    { to: '/reports', label: 'Relatórios', shortLabel: 'Relatórios', icon: FileText, show: user?.role === 'master' },
    { to: '/management', label: 'Gestão', shortLabel: 'Gestão', icon: Settings, show: user?.role === 'master' },
  ].filter((link) => link.show);

  const initials = user?.name
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'VU';

  return (
    <>
      <nav className="navbar">
        <div className="navbar-main">
          <NavLink to="/checklist" className="navbar-brand">
            <span className="navbar-mark">V</span>
            <span>VULCANO</span>
          </NavLink>

          <div className="navbar-desktop-links">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `navbar-link ${isActive ? 'is-active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="navbar-actions">
          <div className="navbar-user">
            <div className="navbar-avatar">{initials}</div>
            <div className="navbar-user-copy">
              <span className="navbar-user-name">{user?.name}</span>
              <Badge type={user?.role}>{user?.role}</Badge>
            </div>
          </div>

          <button type="button" onClick={() => setShowLogoutConfirm(true)} className="navbar-logout" aria-label="Sair">
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <nav className="bottom-nav" aria-label="Navegação principal">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `bottom-nav-item ${isActive ? 'is-active' : ''}`}
            >
              <Icon size={21} />
              <span>{link.shortLabel}</span>
            </NavLink>
          );
        })}
      </nav>

      {showLogoutConfirm && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="logout-modal-title">
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
              <button type="button" onClick={() => setShowLogoutConfirm(false) } style={{ backgroundColor: '#AAAAAA', color: '#333333'}}>
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
