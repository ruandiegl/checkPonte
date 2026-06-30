import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockApi } from '../services/mockApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authData = mockApi.getAuthenticatedUser();
    if (authData) {
      setUser(authData.user);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const data = await mockApi.login(username, password);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    mockApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
