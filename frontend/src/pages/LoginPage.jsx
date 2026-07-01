import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import vulcanoLogo from '../assets/vulcano-logo-transparent.png';

const LoginPage = () => {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-bg-primary)'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img src={vulcanoLogo} alt="Metalúrgica Vulcano" className="login-logo" />
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px', marginTop: '5px' }}>SISTEMA DE INSPEÇÃO DE PONTES ROLANTES</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <Input
            ref={usernameRef}
            label="USUÁRIO"
            placeholder="Digite seu usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            ref={passwordRef}
            label="SENHA"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" fullWidth loading={loading}>
            ENTRAR
          </Button>
        </form>

        <p style={{ color: 'var(--color-text-secondary)', fontSize: '11px', textAlign: 'center', marginTop: '20px' }}>
          Vulcano Industrial © 2026
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
