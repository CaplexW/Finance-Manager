import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  redirectPath?: string;
}

export default function ProtectedRoute({
  isAuthenticated,
  redirectPath = '/login',
}: ProtectedRouteProps): JSX.Element {
  const currentPath = window.location.pathname;
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate replace state={{ from: currentPath }} to={redirectPath} />
  );
}

