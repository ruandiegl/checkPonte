import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context';
import vulcanoLogo from '../../assets/vulcano-logo-transparent.png';
import { getErrorMessage } from '../../types/domain';
import {
  BrandLogo,
  BrandPanel,
  Footer,
  FormPanel,
  LoginButton,
  LoginCard,
  LoginField,
  LoginForm,
  LoginInput,
  LoginPageRoot,
  SystemTitle,
} from './styles';

const LoginPage = () => {
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
      toast.error(getErrorMessage(err, 'Usuário ou senha inválidos.'));
      passwordRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginPageRoot>
      <LoginCard aria-label="Acesso ao sistema Vulcano">
        <BrandPanel>
          <BrandLogo src={vulcanoLogo} alt="Metalúrgica Vulcano" />
        </BrandPanel>

        <FormPanel>
          <SystemTitle>SISTEMA DE INSPEÇÃO DE PONTES ROLANTES</SystemTitle>

          <LoginForm onSubmit={handleSubmit} noValidate>
            <LoginField>
              <span>USUÁRIO</span>
              <LoginInput
                ref={usernameRef}
                type="text"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
              />
            </LoginField>

            <LoginField>
              <span>SENHA</span>
              <LoginInput
                ref={passwordRef}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </LoginField>

            <LoginButton type="submit" disabled={loading}>
              {loading ? 'CARREGANDO...' : 'ENTRAR'}
            </LoginButton>
          </LoginForm>

          <Footer>Vulcano Industrial © 2026</Footer>
        </FormPanel>
      </LoginCard>
    </LoginPageRoot>
  );
};

export default LoginPage;
