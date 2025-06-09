import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { LoginPage } from './LoginPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <>{children}</>;
};