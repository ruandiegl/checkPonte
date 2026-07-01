import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './context/AuthContext';
import SwipeNavigation from './components/SwipeNavigation';
import LoginPage from './pages/LoginPage';
import ChecklistPage from './pages/ChecklistPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import OperatorHistoryPage from './pages/OperatorHistoryPage';
import ManagementPage from './pages/ManagementPage';
import ReportsPage from './pages/ReportsPage';

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
        <SwipeNavigation />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/checklist" element={<PrivateRoute><ChecklistPage /></PrivateRoute>} />
          <Route path="/my-history" element={<PrivateRoute><OperatorHistoryPage /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute role="master"><DashboardPage /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute role="master"><HistoryPage /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute role="master"><ReportsPage /></PrivateRoute>} />
          <Route path="/management" element={<PrivateRoute role="master"><ManagementPage /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/checklist" />} />
          <Route path="*" element={<Navigate to="/checklist" replace />} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        theme="dark"
        autoClose={2600}
        closeOnClick
        pauseOnHover
        newestOnTop
      />
    </AuthProvider>
  );
}

export default App;
