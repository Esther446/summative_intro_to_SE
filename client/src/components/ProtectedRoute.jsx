import { Navigate } from 'react-router-dom';
import { isLoggedIn, getUser } from '../services/auth';

/**
 * Wraps a page and redirects if the user doesn't have the required role.
 * Usage:
 *   <ProtectedRoute role="employer"><PostInternship /></ProtectedRoute>
 *   <ProtectedRoute role="student"><SomePage /></ProtectedRoute>
 *   <ProtectedRoute><AnyLoggedInPage /></ProtectedRoute>
 */
export default function ProtectedRoute({ role, children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/" replace />;
  }

  if (role && getUser()?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
