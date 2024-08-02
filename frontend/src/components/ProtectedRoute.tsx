// components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';

interface ProtectedRouteProps {
  element: React.ComponentType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element: Component,
}) => {
  const { isLoggedIn } = useUserStore();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  return <Component />;
};

export default ProtectedRoute;
