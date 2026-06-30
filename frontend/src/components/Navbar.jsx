import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import Badge from './Badge';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav style={{
      backgroundColor: 'var(--color-bg-primary)',
      borderBottom: '1px solid var(--color-border)',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
        <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-accent)' }}>
          VULCANO
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/checklist" style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>Checklist</Link>
          {user?.role === 'master' && (
            <>
              <Link to="/dashboard" style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>Dashboard</Link>
              <Link to="/history" style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>Histórico</Link>
              <Link to="/reports" style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>Relatórios</Link>
              <Link to="/management" style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>Gestão</Link>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-bg-header)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <User size={18} color="var(--color-text-secondary)" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '13px', fontWeight: '500' }}>{user?.name}</span>
            <Badge type={user?.role}>{user?.role}</Badge>
          </div>
        </div>

        <button
          onClick={onLogout}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            padding: '5px'
          }}
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
