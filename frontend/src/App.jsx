import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import ChecklistPage from './pages/ChecklistPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import ManagementPage from './pages/ManagementPage';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/checklist" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/checklist" element={<PrivateRoute><ChecklistPage /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute role="master"><DashboardPage /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute role="master"><HistoryPage /></PrivateRoute>} />
          <Route path="/management" element={<PrivateRoute role="master"><ManagementPage /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/checklist" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
