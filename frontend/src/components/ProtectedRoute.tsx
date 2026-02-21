import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  // While the authentication status is being checked on app load,
  // show a full-screen loader to prevent UI flashing or incorrect redirects.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-900">
        <div className="w-12 h-12 border-4 border-t-purple-500 border-gray-600 rounded-full animate-spin" />
      </div>
    );
  }

  // After loading, if the user is authenticated, render the nested routes (e.g., AppLayout).
  // Otherwise, redirect them to the login page.
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
