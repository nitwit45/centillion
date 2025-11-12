import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user?.isFirstLogin) {
      navigate('/change-password');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.isFirstLogin) {
    return <Navigate to="/change-password" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

