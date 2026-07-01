import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import vulcanoLogo from '../assets/vulcano-logo-transparent.png';

const LoginPage = () => {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username.trim()) {
      toast.warning('Informe o usuário para entrar.');
      usernameRef.current?.focus();
      return;
    }
    if (!password.trim()) {
      toast.warning('Informe a senha para entrar.');
      passwordRef.current?.focus();
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login(username, password);
      navigate(loggedUser.role === 'master' ? '/dashboard' : '/checklist');
    } catch (err) {
      toast.error(err.message);
      passwordRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-bg">
      <main className="login-card-container" aria-label="Acesso ao sistema Vulcano">
        <section className="login-brand-panel">
          <img src={vulcanoLogo} alt="Metalúrgica Vulcano" className="login-card-logo" />
        </section>

        <section className="login-form-panel">
          <p className="login-system-title">SISTEMA DE INSPEÇÃO DE PONTES ROLANTES</p>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <label className="login-field">
              <span>USUÁRIO</span>
              <input
                ref={usernameRef}
                type="text"
                className="login-input-v3"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
              />
            </label>

            <label className="login-field">
              <span>SENHA</span>
              <input
                ref={passwordRef}
                type="password"
                className="login-input-v3"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </label>

            <button type="submit" disabled={loading} className="login-button-v3">
              {loading ? 'CARREGANDO...' : 'ENTRAR'}
            </button>
          </form>

          <p className="login-footer">Vulcano Industrial © 2026</p>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;
