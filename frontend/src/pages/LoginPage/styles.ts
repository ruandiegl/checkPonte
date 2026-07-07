import styled from 'styled-components';

export const LoginPageRoot = styled.div`
  min-height: 100dvh;
  padding: 24px;
  background-color: #101112;
  background-image: repeating-linear-gradient(
    45deg,
    transparent 0,
    transparent 10px,
    rgba(255, 255, 255, 0.025) 10px,
    rgba(255, 255, 255, 0.025) 12px
  );
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 760px) {
    align-items: flex-start;
    justify-content: flex-start;
    padding: 42px 16px 24px;
  }

  @media (max-width: 420px) {
    padding-left: 12px;
    padding-right: 12px;
  }
`;

export const LoginCard = styled.main`
  width: min(420px, 100%);
  overflow: hidden;
  background-color: #1f1f1f;
  border-radius: 12px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
  animation: page-enter-soft 260ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
`;

export const BrandPanel = styled.section`
  min-height: 176px;
  padding: 36px 42px 34px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 760px) {
    min-height: 152px;
    padding: 28px 30px;
  }
`;

export const BrandLogo = styled.img`
  width: min(280px, 100%);
  height: auto;
  display: block;

  @media (max-width: 760px) {
    width: min(260px, 100%);
  }
`;

export const FormPanel = styled.section`
  padding: 28px 32px 30px;
  border-top: 4px solid #f1a000;
  background-color: #1f1f1f;

  @media (max-width: 760px) {
    padding: 24px 24px 26px;
  }

  @media (max-width: 420px) {
    padding-left: 20px;
    padding-right: 20px;
  }
`;

export const SystemTitle = styled.p`
  margin-bottom: 24px;
  color: #b6b6b6;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.31em;
  text-align: center;

  @media (max-width: 760px) {
    font-size: 10px;
    letter-spacing: 0.22em;
  }
`;

export const LoginForm = styled.form`
  display: grid;
  gap: 18px;
`;

export const LoginField = styled.label`
  display: grid;
  gap: 8px;

  span {
    color: #d8d8d8;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.15em;
  }
`;

export const LoginInput = styled.input`
  width: 100%;
  min-height: 46px;
  padding: 12px 15px;
  border: 1px solid #444444;
  border-radius: 8px;
  background-color: #151515;
  color: #f5f5f5;
  font-size: 14px;
  outline: none;
  transition: border-color 180ms ease, box-shadow 180ms ease;

  &::placeholder {
    color: #a9b1c0;
  }

  &:focus {
    border-color: #f1a000;
    box-shadow: 0 0 0 2px rgba(241, 160, 0, 0.18);
  }
`;

export const LoginButton = styled.button`
  width: 100%;
  min-height: 48px;
  margin-top: 3px;
  padding: 13px 18px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(180deg, #f5ad00 0%, #ee9900 100%);
  color: #050505;
  cursor: pointer;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.24em;
  transition: filter 180ms ease, transform 180ms ease;

  &:hover:not(:disabled) {
    filter: brightness(1.05);
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.72;
  }
`;

export const Footer = styled.p`
  margin-top: 22px;
  color: #555555;
  font-size: 11px;
  text-align: center;
`;
