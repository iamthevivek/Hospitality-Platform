import { useAuth } from '../../lib/auth';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth();
  const location = useLocation();
  
  if (!isLoaded) return <div className="flex justify-center items-center min-h-screen"><LoadingSpinner /></div>;
  if (!isSignedIn) return <Navigate to="/sign-in" state={{ from: location }} replace />;
  return children;
}
