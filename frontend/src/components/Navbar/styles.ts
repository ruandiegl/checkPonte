import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const NavbarRoot = styled.nav`
  min-height: 56px;
  padding: 0;
  background-color: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: 760px) {
    min-height: 60px;
  }
`;

export const NavbarMain = styled.div`
  min-width: 0;
  align-self: stretch;
  display: flex;
  align-items: center;
  gap: 28px;

  @media (max-width: 760px) {
    gap: 0;
  }
`;

export const BrandLink = styled(NavLink)`
  align-self: stretch;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.16em;
  white-space: nowrap;

  &:hover {
    color: var(--color-text-primary);
  }
`;

export const BrandSurface = styled.span`
  width: 160px;
  min-height: 56px;
  padding: 9px 34px 11px;
  background-color: #ffffff;
  border-radius: 0;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 3px;
    background-color: #f1a000;
  }

  @media (max-width: 760px) {
    width: min(160px, 45vw);
    min-height: 60px;
    padding: 8px 18px 10px;
  }
`;

export const BrandLogo = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

export const DesktopLinks = styled.div`
  align-self: stretch;
  display: flex;
  align-items: center;
  gap: 0;

  @media (max-width: 760px) {
    display: none;
  }
`;

export const NavbarItem = styled(NavLink)`
  min-width: 92px;
  min-height: 56px;
  padding: 0 14px;
  color: var(--color-text-primary);
  border-bottom: 3px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;

  &:hover,
  &.is-active {
    color: var(--color-accent);
  }

  &.is-active {
    border-bottom-color: var(--color-accent);
  }
`;

export const NavbarActions = styled.div`
  align-self: stretch;
  padding: 0 20px;
  border-left: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 760px) {
    padding: 0;
    border-left: none;
  }
`;

export const NavbarUser = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 760px) {
    display: none;
  }
`;

export const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background-color: var(--color-accent);
  color: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  font-size: 11px;
  font-weight: 800;
`;

export const UserCopy = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

export const UserName = styled.span`
  max-width: 170px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  font-weight: 600;
`;

export const LogoutButton = styled.button`
  min-width: 40px;
  min-height: 40px;
  padding: 8px;
  border: 1px solid var(--color-border);
  background: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 760px) {
    margin-right: 10px;
  }
`;

export const BottomNav = styled.nav`
  display: none;

  @media (max-width: 760px) {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 150;
    min-height: calc(64px + env(safe-area-inset-bottom));
    padding: 8px 8px calc(8px + env(safe-area-inset-bottom));
    background-color: rgba(17, 17, 17, 0.96);
    border-top: 1px solid var(--color-border);
    box-shadow: 0 -16px 36px rgba(0, 0, 0, 0.38);
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 2px;
  }
`;

export const BottomNavItem = styled(NavLink)`
  flex: 1 1 0;
  min-width: 0;
  min-height: 48px;
  color: var(--color-text-secondary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 3px;
  font-size: 10px;
  font-weight: 700;
  line-height: 1.1;
  text-align: center;
  transition: background-color 180ms ease, color 180ms ease, transform 180ms ease;

  &:hover {
    color: var(--color-accent);
  }

  &.is-active {
    color: var(--color-accent);
    background-color: rgba(245, 196, 0, 0.1);
    transform: translateY(-1px);
  }

  span {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
