import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoCard = ({ isMobile }) => (
  <div className="login-logo-card" style={{ margin: isMobile ? '0 auto 30px' : '0' }}>
    <div style={{
      color: '#f0a500',
      fontWeight: 'bold',
      fontSize: '24px',
      lineHeight: 1
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <span style={{ fontSize: '40px', color: '#f0a500' }}>M</span>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '10px', color: '#333', marginBottom: '-5px' }}>Metalúrgica</div>
          <div style={{ fontSize: '20px', color: '#1a237e', fontWeight: '900' }}>VULCANO</div>
        </div>
      </div>
      <div style={{ fontSize: '10px', color: '#1a237e', marginTop: '4px', letterSpacing: '0.05em' }}>www.e-vulcano.com.br</div>
    </div>
  </div>
);

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loggedUser = await login(username, password);
      navigate(loggedUser.role === 'master' ? '/dashboard' : '/checklist');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-bg" style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="login-card-container">
        {/* Left Panel (Brand) - Hidden on Mobile */}
        <div className="login-brand-panel desktop-only">
          {/* Decorative Rings */}
          <div className="login-ring" style={{
            width: '400px',
            height: '400px',
            border: '1px solid rgba(240,165,0,0.08)'
          }} />
          <div className="login-ring" style={{
            width: '520px',
            height: '520px',
            border: '1px solid rgba(240,165,0,0.04)'
          }} />

          <LogoCard />

          <p style={{
            marginTop: '30px',
            color: '#666',
            fontSize: '11px',
            letterSpacing: '0.2em',
            textAlign: 'center',
            maxWidth: '220px',
            zIndex: 1
          }}>
            SISTEMA DE INSPEÇÃO DE PONTES ROLANTES
          </p>
        </div>

        {/* Right Panel (Form) */}
        <div className="login-form-panel">
          {/* Mobile Logo */}
          <div className="mobile-only">
            <LogoCard isMobile />
            <p style={{
              color: '#666',
              fontSize: '10px',
              letterSpacing: '0.15em',
              textAlign: 'center',
              marginBottom: '30px',
              textTransform: 'uppercase'
            }}>
              Sistema de Inspeção de Pontes Rolantes
            </p>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ color: 'var(--text-v3-primary)', fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>Bem-vindo</h2>
            <p style={{ color: 'var(--text-v3-secondary)', fontSize: '14px' }}>Faça login para continuar</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '11px',
                color: 'var(--text-v3-label)',
                letterSpacing: '0.15em',
                marginBottom: '8px'
              }}>USUÁRIO</label>
              <input
                type="text"
                className="login-input-v3"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                fontSize: '11px',
                color: 'var(--text-v3-label)',
                letterSpacing: '0.15em',
                marginBottom: '8px'
              }}>SENHA</label>
              <input
                type="password"
                className="login-input-v3"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div style={{ color: 'var(--color-danger)', fontSize: '13px', marginBottom: '15px', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="login-button-v3"
            >
              {loading ? 'CARREGANDO...' : 'ENTRAR'}
            </button>
          </form>

          <p style={{
            color: 'var(--text-v3-footer)',
            fontSize: '11px',
            textAlign: 'center',
            marginTop: '40px'
          }}>
            Vulcano Industrial © 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
