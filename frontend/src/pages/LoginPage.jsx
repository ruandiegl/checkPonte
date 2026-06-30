import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';

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
      await login(username, password);
      navigate('/checklist');
    } catch (err) {
      setError(err.message);
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
          <h1 style={{ color: 'var(--color-accent)', letterSpacing: '2px', fontSize: '28px' }}>VULCANO</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px', marginTop: '5px' }}>SISTEMA DE INSPEÇÃO DE PONTES ROLANTES</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="USUÁRIO"
            placeholder="Digite seu usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            label="SENHA"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div style={{ color: 'var(--color-danger)', fontSize: '13px', marginBottom: '15px', textAlign: 'center' }}>
              {error}
            </div>
          )}

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
