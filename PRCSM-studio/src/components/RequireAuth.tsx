/**
 * RequireAuth Component
 * Route guard that redirects unauthenticated users to login
 * Preserves the intended destination with returnTo parameter
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps): React.ReactElement {
  const { accessToken, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mb-4"></div>
          <p className="text-white">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!accessToken) {
    // Preserve the current location so we can redirect back after login
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?returnTo=${returnTo}`} replace />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}