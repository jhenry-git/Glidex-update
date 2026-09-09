import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

/**
 * ProtectedRoute — Route protection component for authenticated pages
 * 
 * Renders child components only if the user is authenticated.
 * Redirects unauthenticated users to the login page.
 * 
 * @param children - The components to render if user is authenticated
 * @param fallback - Optional component to render while loading or on error
 * @param redirectTo - Path to redirect unauthenticated users (defaults to '/')
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  fallback = null,
  redirectTo = '/'
}: ProtectedRouteProps) {
  const authContext = useAuth();
  const location = useLocation();

  // Handle case where useAuth throws an error (not in provider)
  if (authContext instanceof Error) {
    console.error('Auth context error:', authContext.message);
    return fallback || null;
  }
  
  const { user, loading } = authContext;

  // Don't render anything while we're still checking auth state
  if (loading) {
    return fallback || null;
  }

  // If user is not authenticated, redirect to login page
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected content
  return children;
}