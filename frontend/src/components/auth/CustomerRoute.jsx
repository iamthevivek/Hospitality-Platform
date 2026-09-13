import { useAuth, useUser } from '../../lib/auth';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * Route wrapper that prevents Admins from accessing consumer/guest pages
 * (Home, Hotels, Booking, etc.) and automatically redirects them to /admin.
 */
export default function CustomerRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const isAdmin =
    isSignedIn &&
    (user?.role === 'ADMIN' ||
      user?.publicMetadata?.role === 'ADMIN' ||
      localStorage.getItem('role') === 'ADMIN');

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
