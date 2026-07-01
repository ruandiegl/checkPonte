import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getNavigationLinks } from '../utils/navigation';

const ignoredSelector = 'input, textarea, select, button, a, [role="dialog"], .modal-backdrop, .responsive-table, .tabs-scroll';

function shouldIgnoreSwipe(target) {
  return Boolean(target.closest?.(ignoredSelector));
}

const SwipeNavigation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const touchRef = useRef(null);
  const locationRef = useRef(location.pathname);
  const userRef = useRef(user);

  useEffect(() => {
    locationRef.current = location.pathname;
    userRef.current = user;
  }, [location.pathname, user]);

  useEffect(() => {
    const handleTouchStart = (event) => {
      if (!userRef.current || window.innerWidth > 760 || shouldIgnoreSwipe(event.target)) return;
      const touch = event.touches[0];
      touchRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
        target: event.target,
      };
    };

    const handleTouchEnd = (event) => {
      const currentTouch = touchRef.current;
      if (!currentTouch || !userRef.current || window.innerWidth > 760 || shouldIgnoreSwipe(currentTouch.target) || shouldIgnoreSwipe(event.target)) {
        touchRef.current = null;
        return;
      }

      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - currentTouch.x;
      const deltaY = touch.clientY - currentTouch.y;
      const elapsed = Date.now() - currentTouch.time;
      touchRef.current = null;

      if (elapsed > 700 || Math.abs(deltaX) < 72 || Math.abs(deltaY) > 60 || Math.abs(deltaX) < Math.abs(deltaY) * 1.4) return;

      const links = getNavigationLinks(userRef.current);
      const currentIndex = links.findIndex((link) => link.to === locationRef.current);
      if (currentIndex < 0) return;

      const nextIndex = deltaX < 0 ? currentIndex + 1 : currentIndex - 1;
      const nextLink = links[nextIndex];
      if (nextLink) navigate(nextLink.to);
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [navigate]);

  return null;
};

export default SwipeNavigation;
